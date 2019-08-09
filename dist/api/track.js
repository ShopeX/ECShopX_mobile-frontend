"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewnum = viewnum;

var _req = require("./req.js");

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function viewnum() {
  var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.post('/track/viewnum', {});
}