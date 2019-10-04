"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var get = require("lodash/get");

var _require = require("gatsby-source-filesystem"),
    createRemoteFileNode = _require.createRemoteFileNode;

var crypto = require("crypto");

var digest = function digest(str) {
  return crypto.createHash("md5").update(str).digest("hex");
};

exports.createGatsbyIds = function (items, createNodeId) {
  return items.map(function (e) {
    e.originalID = e.id;
    e.id = createNodeId(e.id.toString());
    return e;
  });
};

exports.normalizeRecords = function (items) {
  return (items || []).map(function (item) {
    var e = {
      id: get(item, "id"),
      publishedAt: get(item, "snippet.publishedAt"),
      title: get(item, "snippet.title"),
      description: get(item, "snippet.description"),
      videoId: get(item, "contentDetails.videoId"),
      privacyStatus: get(item, "status.privacyStatus"),
      channelId: get(item, "snippet.channelId"),
      channelTitle: get(item, "snippet.channelTitle"),
      thumbnail: get(item, "snippet.thumbnails.maxres", get(item, "snippet.thumbnails.standard", get(item, "snippet.thumbnails.high", get(item, "snippet.thumbnails.medium", get(item, "snippet.thumbnails.default")))))
    };
    return e;
  });
};

exports.downloadThumbnails =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref) {
    var items, store, cache, createNode, createNodeId;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            items = _ref.items, store = _ref.store, cache = _ref.cache, createNode = _ref.createNode, createNodeId = _ref.createNodeId;
            return _context2.abrupt("return", Promise.all(items.map(
            /*#__PURE__*/
            function () {
              var _ref3 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(item) {
                var fileNode;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(item.thumbnail && item.thumbnail.url)) {
                          _context.next = 9;
                          break;
                        }

                        _context.prev = 1;
                        _context.next = 4;
                        return createRemoteFileNode({
                          url: item.thumbnail.url,
                          parentNodeId: item.id,
                          store: store,
                          cache: cache,
                          createNode: createNode,
                          createNodeId: createNodeId
                        });

                      case 4:
                        fileNode = _context.sent;
                        _context.next = 9;
                        break;

                      case 7:
                        _context.prev = 7;
                        _context.t0 = _context["catch"](1);

                      case 9:
                        if (fileNode) {
                          item.localThumbnail___NODE = fileNode.id;
                        }

                        return _context.abrupt("return", item);

                      case 11:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[1, 7]]);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }())));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.createNodesFromEntities = function (items, createNode) {
  items.forEach(function (e) {
    var entity = _extends({}, e);

    var node = _objectSpread({}, entity, {
      parent: null,
      children: [],
      internal: {
        type: "YoutubeVideo",
        contentDigest: digest(JSON.stringify(entity))
      }
    });

    createNode(node);
  });
};