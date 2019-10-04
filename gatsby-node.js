"use strict";

var _createVideoNodesFromChannelId = _interopRequireDefault(require("./create-video-nodes-from-channel-id"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

exports.createSchemaCustomization = function (_ref) {
  var createTypes = _ref.actions.createTypes;
  var typeDefs = "\n    type YoutubeVideo implements Node @dontInfer {\n      publishedAt: Date! @dateformat\n      title: String!\n      description: String!\n      videoId: String!\n      privacyStatus: String!\n      channelId: String!\n      channelTitle: String!\n      thumbnail: YoutubeVideoThumbnail!\n      originalID: String!\n    }\n\n    type YoutubeVideoThumbnail @dontInfer {\n      url: String!\n      width: Int!\n      height: Int!\n    }\n  ";
  createTypes(typeDefs);
};

exports.sourceNodes =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref2, _ref3) {
    var boundActionCreators, store, cache, createNodeId, channelId, apiKey, _ref3$maxVideos, maxVideos, createNode;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            boundActionCreators = _ref2.boundActionCreators, store = _ref2.store, cache = _ref2.cache, createNodeId = _ref2.createNodeId;
            channelId = _ref3.channelId, apiKey = _ref3.apiKey, _ref3$maxVideos = _ref3.maxVideos, maxVideos = _ref3$maxVideos === void 0 ? 50 : _ref3$maxVideos;
            createNode = boundActionCreators.createNode;

            if (channelId) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return");

          case 5:
            channelId = Array.isArray(channelId) ? channelId : [channelId];
            _context2.prev = 6;
            _context2.next = 9;
            return Promise.all(channelId.map(
            /*#__PURE__*/
            function () {
              var _ref5 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(channelIdEntry) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        return _context.abrupt("return", (0, _createVideoNodesFromChannelId["default"])({
                          channelId: channelIdEntry,
                          apiKey: apiKey,
                          maxVideos: maxVideos,
                          createNode: createNode,
                          store: store,
                          cache: cache,
                          createNodeId: createNodeId
                        }));

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 9:
            return _context2.abrupt("return");

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](6);
            console.error(_context2.t0);
            process.exit(1);

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[6, 12]]);
  }));

  return function (_x, _x2) {
    return _ref4.apply(this, arguments);
  };
}();