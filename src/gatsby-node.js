import createVideoNodesFromChannelId from './create-video-nodes-from-channel-id'

exports.createSchemaCustomization = ({ actions: {createTypes} }) => {
  const typeDefs = `
    type YoutubeChannel implements Node @dontInfer {
      channelId: String!
      title: String!
      description: String!
      customUrl: String!
      publishedAt: Date! @dateformat
      videos: [YoutubeVideo!]! @link(by: "channelId", from: "channelId")
    }
    
    type YoutubeVideo implements Node @dontInfer {
      videoId: String!
      channelId: String!
      title: String!
      description: String!
      publishedAt: Date! @dateformat
      privacyStatus: String!
      channel: YoutubeChannel! @link(by: "channelId", from: "channelId")
      thumbnails: [YoutubeVideoThumbnail!]!
    }

    type YoutubeVideoThumbnail @dontInfer {
      size: String!
      url: String!
      width: Int!
      height: Int!
    }
  `
  createTypes(typeDefs)
}


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
