"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var axios = require("axios");

var get = require("lodash/get");

var normalize = require("./normalize");

function getApi() {
  var rateLimit = 500;
  var lastCalled = null;

  var rateLimiter = function rateLimiter(call) {
    var now = Date.now();

    if (lastCalled) {
      lastCalled += rateLimit;
      var wait = lastCalled - now;

      if (wait > 0) {
        return new Promise(function (resolve) {
          return setTimeout(function () {
            return resolve(call);
          }, wait);
        });
      }
    }

    lastCalled = now;
    return call;
  };

  var api = axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3/"
  });
  api.interceptors.request.use(rateLimiter);
  return api;
}

var createVideoNodesFromChannelId =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var channelId, apiKey, maxVideos, createNode, store, cache, createNodeId, api, videos, channelResp, channelData, _videos, uploadsId, pageSize, videoResp, _videos2, nextPageToken;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            channelId = _ref.channelId, apiKey = _ref.apiKey, maxVideos = _ref.maxVideos, createNode = _ref.createNode, store = _ref.store, cache = _ref.cache, createNodeId = _ref.createNodeId;
            api = getApi();
            videos = [];
            _context.next = 5;
            return api.get("channels?part=contentDetails&id=".concat(channelId, "&key=").concat(apiKey));

          case 5:
            channelResp = _context.sent;
            channelData = channelResp.data.items[0];

            if (!channelData) {
              _context.next = 23;
              break;
            }

            uploadsId = get(channelData, "contentDetails.relatedPlaylists.uploads");
            pageSize = Math.min(50, maxVideos);
            _context.next = 12;
            return api.get("playlistItems?part=snippet%2CcontentDetails%2Cstatus&maxResults=".concat(pageSize, "&playlistId=").concat(uploadsId, "&key=").concat(apiKey));

          case 12:
            videoResp = _context.sent;

            (_videos = videos).push.apply(_videos, _toConsumableArray(videoResp.data.items));

          case 14:
            if (!(videoResp.data.nextPageToken && videos.length < maxVideos)) {
              _context.next = 23;
              break;
            }

            pageSize = Math.min(50, maxVideos - videos.length);
            nextPageToken = videoResp.data.nextPageToken;
            _context.next = 19;
            return api.get("playlistItems?part=snippet%2CcontentDetails%2Cstatus&maxResults=".concat(pageSize, "&pageToken=").concat(nextPageToken, "&playlistId=").concat(uploadsId, "&key=").concat(apiKey));

          case 19:
            videoResp = _context.sent;

            (_videos2 = videos).push.apply(_videos2, _toConsumableArray(videoResp.data.items));

            _context.next = 14;
            break;

          case 23:
            videos = normalize.normalizeRecords(videos);
            videos = normalize.createGatsbyIds(videos, createNodeId);
            _context.next = 27;
            return normalize.downloadThumbnails({
              items: videos,
              store: store,
              cache: cache,
              createNode: createNode
            });

          case 27:
            videos = _context.sent;
            normalize.createNodesFromEntities(videos, createNode);
            return _context.abrupt("return");

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createVideoNodesFromChannelId(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = createVideoNodesFromChannelId;
exports["default"] = _default;