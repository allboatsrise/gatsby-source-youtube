"use strict";

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

exports.sourceNodes =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref, _ref2) {
    var boundActionCreators, store, cache, createNodeId, channelId, apiKey, _ref2$maxVideos, maxVideos, createNode, createVideoNodesFromChannelId;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            boundActionCreators = _ref.boundActionCreators, store = _ref.store, cache = _ref.cache, createNodeId = _ref.createNodeId;
            channelId = _ref2.channelId, apiKey = _ref2.apiKey, _ref2$maxVideos = _ref2.maxVideos, maxVideos = _ref2$maxVideos === void 0 ? 50 : _ref2$maxVideos;
            createNode = boundActionCreators.createNode;

            createVideoNodesFromChannelId =
            /*#__PURE__*/
            function () {
              var _ref4 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(channelId, apiKey) {
                var api, videos, channelResp, channelData, _videos, uploadsId, pageSize, videoResp, _videos2, nextPageToken;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        api = getApi();
                        videos = [];
                        _context.next = 4;
                        return api.get("channels?part=contentDetails&id=".concat(channelId, "&key=").concat(apiKey));

                      case 4:
                        channelResp = _context.sent;
                        channelData = channelResp.data.items[0];

                        if (!channelData) {
                          _context.next = 22;
                          break;
                        }

                        uploadsId = get(channelData, "contentDetails.relatedPlaylists.uploads");
                        pageSize = Math.min(50, maxVideos);
                        _context.next = 11;
                        return api.get("playlistItems?part=snippet%2CcontentDetails%2Cstatus&maxResults=".concat(pageSize, "&playlistId=").concat(uploadsId, "&key=").concat(apiKey));

                      case 11:
                        videoResp = _context.sent;

                        (_videos = videos).push.apply(_videos, _toConsumableArray(videoResp.data.items));

                      case 13:
                        if (!(videoResp.data.nextPageToken && videos.length < maxVideos)) {
                          _context.next = 22;
                          break;
                        }

                        pageSize = Math.min(50, maxVideos - videos.length);
                        nextPageToken = videoResp.data.nextPageToken;
                        _context.next = 18;
                        return api.get("playlistItems?part=snippet%2CcontentDetails%2Cstatus&maxResults=".concat(pageSize, "&pageToken=").concat(nextPageToken, "&playlistId=").concat(uploadsId, "&key=").concat(apiKey));

                      case 18:
                        videoResp = _context.sent;

                        (_videos2 = videos).push.apply(_videos2, _toConsumableArray(videoResp.data.items));

                        _context.next = 13;
                        break;

                      case 22:
                        videos = normalize.normalizeRecords(videos);
                        videos = normalize.createGatsbyIds(videos, createNodeId);
                        _context.next = 26;
                        return normalize.downloadThumbnails({
                          items: videos,
                          store: store,
                          cache: cache,
                          createNode: createNode
                        });

                      case 26:
                        videos = _context.sent;
                        normalize.createNodesFromEntities(videos, createNode);
                        return _context.abrupt("return");

                      case 29:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function createVideoNodesFromChannelId(_x3, _x4) {
                return _ref4.apply(this, arguments);
              };
            }();

            _context3.prev = 4;

            if (!Array.isArray(channelId)) {
              _context3.next = 10;
              break;
            }

            _context3.next = 8;
            return Promise.all(channelId.map(
            /*#__PURE__*/
            function () {
              var _ref5 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2(channelIdEntry) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        return _context2.abrupt("return", createVideoNodesFromChannelId(channelIdEntry, apiKey));

                      case 1:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x5) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 8:
            _context3.next = 12;
            break;

          case 10:
            _context3.next = 12;
            return createVideoNodesFromChannelId(channelId, apiKey);

          case 12:
            return _context3.abrupt("return");

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](4);
            console.error(_context3.t0);
            process.exit(1);

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 15]]);
  }));

  return function (_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}();