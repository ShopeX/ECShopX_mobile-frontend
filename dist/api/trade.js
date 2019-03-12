'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = list;
exports.detail = detail;
exports.create = create;
exports.confirm = confirm;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function list(params) {
  return _req2.default.get('/trade.list', params);
}

function detail(tid) {
  return _req2.default.get('/trade.get', { tid: tid });
}

function create(data) {
  // return req.post('/trade.create', data)
  return _req2.default.post('http://pjj.aixue7.com/index.php/api/h5app/wxapp/order_new', data);
}

function confirm(tid) {
  return _req2.default.get('/trade.confirm', { tid: tid });
}