const crypto = require("crypto");

const digest = obj =>
  crypto
    .createHash(`md5`)
    .update(JSON.stringify(obj))
    .digest(`hex`);

exports.channelToChannelNode = ({channel, createNodeId}) => {
  const fieldData = {
    channelId: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    customUrl: channel.snippet.customUrl,
    publishedAt: channel.snippet.publishedAt,
  }

  const node = Object.assign(fieldData, {
    id: createNodeId(channel.id),
    parent: null,
    children: [],
    internal: {
      type: 'YoutubeChannel',
      contentDigest: digest(fieldData),
      content: JSON.stringify(channel),
    },
  })

  return node
}

exports.videosToVideoNodes = ({videos, channelNodeId, createNodeId}) => {
  return videos.map((video) => videoToVideoNode({video, channelNodeId, createNodeId}))
}

const videoToVideoNode = ({video, channelNodeId, createNodeId}) => {
  const thumbnails = video.snippet.thumbnails

  const fieldData = {
    videoId: video.contentDetails.videoId,
    channelId: video.snippet.channelId,
    title: video.snippet.title,
    description: video.snippet.description,
    publishedAt: video.snippet.publishedAt,
    privacyStatus: video.status.privacyStatus,
    thumbnails: Object.keys(thumbnails).map(size => {
      const thumbnail = thumbnails[size]
      return {
        size,
        url: thumbnail.url,
        width: thumbnail.width,
        height: thumbnail.height,
      }
    })
  }

  const node = Object.assign(fieldData, {
    id: createNodeId(video.id),
    parent: channelNodeId,
    children: [],
    internal: {
      type: 'YoutubeVideo',
      contentDigest: digest(fieldData),
      content: JSON.stringify(video),
    },
  })
  
  return node
}

exports.videoToVideoNode = videoToVideoNode
