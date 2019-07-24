'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.become = become;
exports.update = update;
exports.dashboard = dashboard;
exports.info = info;
exports.subordinate = subordinate;
exports.commission = commission;
exports.statistics = statistics;
exports.withdrawRecord = withdrawRecord;
exports.withdraw = withdraw;
exports.qrcode = qrcode;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function become() {
  return _req2.default.post('/promoter');
}

function update() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.put('/promoter', params);
}

function dashboard() {
  return _req2.default.get('/promoter/index');
}

function info() {
  return _req2.default.get('/promoter/info');
}

function subordinate(params) {
  return _req2.default.get('/promoter/children', params);
}

function commission() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/promoter/brokerages', params);
}

function statistics() {
  return _req2.default.get('/promoter/brokerage/count');
}

function withdrawRecord(params) {
  return _req2.default.get('/promoter/cash_withdrawal', params);
}

function withdraw() {
  return _req2.default.post('/promoter/cash_withdrawal');
}

function qrcode() {
  return _req2.default.post('/promoter/qrcode');
}