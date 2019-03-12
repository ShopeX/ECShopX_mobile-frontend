"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = list;

var _req = require("./req.js");

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function list() {
  _req2.default.get('/region.json');
}

exports.default = {};