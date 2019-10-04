import createVideoNodesFromChannelId from './create-video-nodes-from-channel-id'

exports.sourceNodes = async (
  { boundActionCreators, store, cache, createNodeId },
  { channelId, apiKey, maxVideos=50 }
) => {
  const { createNode } = boundActionCreators;

  if (!channelId) return
  channelId = Array.isArray(channelId) ? channelId : [channelId]

  try {
    await Promise.all(channelId.map(async (channelIdEntry) => {
      return createVideoNodesFromChannelId({
        channelId: channelIdEntry,
        apiKey,
        maxVideos,
        createNode,
        store,
        cache,
        createNodeId
      })
    }));
    return;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
