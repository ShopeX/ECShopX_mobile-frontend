"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detail = detail;

var _req = require("./req.js");

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function detail(id) {
  return _req2.default.get("/article/management/" + id);
}

exports.default = {};