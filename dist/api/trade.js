'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = list;
exports.detail = detail;
exports.create = create;
exports.confirm = confirm;
exports.cancel = cancel;
exports.getCount = getCount;
exports.deliveryInfo = deliveryInfo;
exports.tradeQuery = tradeQuery;
exports.imgUpload = imgUpload;
exports.involiceList = involiceList;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function list(params) {
  // return req.get('/trade.list', params)
  return _req2.default.get('/orders', params);
}

function detail(tid) {
  // return req.get('/trade.get', { tid })
  return _req2.default.get('/order/' + tid);
}

function create(data) {
  // return req.post('/trade.create', data)
  return _req2.default.post('/order', data);
}

function confirm(tid) {
  return _req2.default.post('/order/confirmReceipt', { order_id: tid });
}

function cancel(data) {
  return _req2.default.post('/order/cancel', data);
}

function getCount() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { order_type: 'normal' };

  return _req2.default.get('/orderscount', params);
}

function deliveryInfo(order_id) {
  return _req2.default.get('/order/waybill/' + order_id);
}

function tradeQuery(trade_id) {
  return _req2.default.get('/tradequery', { trade_id: trade_id });
}

function imgUpload() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/espier/upload', params);
}

function involiceList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/orders/invoice', params);
}