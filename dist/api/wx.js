'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;
exports.code = code;
exports.userInfo = userInfo;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function info(data) {
  return _req2.default.post('/wx.info', data);
}

function code(code) {
  return _req2.default.get('/wx.code', { code: code });
}

function userInfo() {
  return _req2.default.get('/wx.user.info');
}