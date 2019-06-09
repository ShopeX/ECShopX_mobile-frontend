'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = list;
exports.info = info;
exports.apply = apply;
exports.modify = modify;
exports.sendback = sendback;
exports.close = close;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function list(params) {
  return _req2.default.get('/aftersales', params);
}

function info(params) {
  return _req2.default.get('/aftersales/info', params);
}

function apply(params) {
  return _req2.default.post('/aftersales', params);
}

function modify(params) {
  return _req2.default.post('/aftersales/modify', params);
}

function sendback(params) {
  return _req2.default.post('/aftersales/sendback', params);
}

function close(params) {
  return _req2.default.post('/aftersales/close', params);
}