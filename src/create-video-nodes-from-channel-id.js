const axios = require("axios");
const normalize = require("./normalize");

function getApi() {
  const rateLimit = 500;
  let lastCalled = null;

  const rateLimiter = call => {
    const now = Date.now();
    if (lastCalled) {
      lastCalled += rateLimit;
      const wait = lastCalled - now;
      if (wait > 0) {
        return new Promise(resolve => setTimeout(() => resolve(call), wait));
      }
    }
    lastCalled = now;
    return call;
  };

  const api = axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3/"
  });

  api.interceptors.request.use(rateLimiter);

  return api;
}


const createVideoNodesFromChannelId = async ({
  channelId,
  apiKey,
  maxVideos,
  createNode,
  createNodeId
}) => {
  var api = getApi();
  let videos = [];

  const channelResp = await api.get(
    `channels?part=snippet,contentDetails&id=${channelId}&key=${apiKey}`
  );

  const channel = channelResp.data.items[0];
  if (!!channel) {
    const uploadsId = channel.contentDetails.relatedPlaylists.uploads
    let pageSize = Math.min(50, maxVideos);

    let videoResp = await api.get(
      `playlistItems?part=snippet%2CcontentDetails%2Cstatus&maxResults=${pageSize}&playlistId=${uploadsId}&key=${apiKey}`
    );
    videos.push(...videoResp.data.items);

    while (videoResp.data.nextPageToken && videos.length < maxVideos) {
      pageSize = Math.min(50, maxVideos - videos.length);
      let nextPageToken = videoResp.data.nextPageToken;
      videoResp = await api.get(
        `playlistItems?part=snippet%2CcontentDetails%2Cstatus&maxResults=${pageSize}&pageToken=${nextPageToken}&playlistId=${uploadsId}&key=${apiKey}`
      );
      videos.push(...videoResp.data.items);
    }
  } else {
    console.warn(`Failed to fetch channel data. (channelId: ${channelId})`)
    return
  }

  // channel
  const channelNode = normalize.channelToChannelNode({channel, createNodeId})
  createNode(channelNode)

  // videos
  const videoNodes = normalize.videosToVideoNodes({videos, channelNodeId: channelNode.id, createNodeId})
  videoNodes.forEach((node) => createNode(node))
}

export default createVideoNodesFromChannelId