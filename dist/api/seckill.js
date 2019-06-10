"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seckillList = seckillList;

var _req = require("./req.js");

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function seckillList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // return req.get('/item.search', params)
  return _req2.default.get('/promotion/seckillactivity/getlist', params);
}