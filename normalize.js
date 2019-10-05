"use strict";

var crypto = require("crypto");

var digest = function digest(obj) {
  return crypto.createHash("md5").update(JSON.stringify(obj)).digest("hex");
};

exports.channelToChannelNode = function (_ref) {
  var channel = _ref.channel,
      createNodeId = _ref.createNodeId;
  var fieldData = {
    channelId: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    customUrl: channel.snippet.customUrl,
    publishedAt: channel.snippet.publishedAt
  };
  var node = Object.assign(fieldData, {
    id: createNodeId(channel.id),
    parent: null,
    children: [],
    internal: {
      type: 'YoutubeChannel',
      contentDigest: digest(fieldData),
      content: JSON.stringify(channel)
    }
  });
  return node;
};

exports.videosToVideoNodes = function (_ref2) {
  var videos = _ref2.videos,
      channelNodeId = _ref2.channelNodeId,
      createNodeId = _ref2.createNodeId;
  return videos.map(function (video) {
    return videoToVideoNode({
      video: video,
      channelNodeId: channelNodeId,
      createNodeId: createNodeId
    });
  });
};

var videoToVideoNode = function videoToVideoNode(_ref3) {
  var video = _ref3.video,
      channelNodeId = _ref3.channelNodeId,
      createNodeId = _ref3.createNodeId;
  var thumbnails = video.snippet.thumbnails;
  var fieldData = {
    videoId: video.contentDetails.videoId,
    channelId: video.snippet.channelId,
    title: video.snippet.title,
    description: video.snippet.description,
    publishedAt: video.snippet.publishedAt,
    privacyStatus: video.status.privacyStatus,
    thumbnails: Object.keys(thumbnails).map(function (size) {
      var thumbnail = thumbnails[size];
      return {
        size: size,
        url: thumbnail.url,
        width: thumbnail.width,
        height: thumbnail.height
      };
    })
  };
  var node = Object.assign(fieldData, {
    id: createNodeId(video.id),
    parent: channelNodeId,
    children: [],
    internal: {
      type: 'YoutubeVideo',
      contentDigest: digest(fieldData),
      content: JSON.stringify(video)
    }
  });
  return node;
};

exports.videoToVideoNode = videoToVideoNode;