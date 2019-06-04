'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getOrderDetail = getOrderDetail;
exports.getPayment = getPayment;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOrderDetail(order_id) {
  return _req2.default.get('/order_new/' + order_id);
}

function getPayment() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // TODO: openid获取
  params = _extends({}, params, {
    open_id: 'olp694lNHedXSGa3HPrqj6nPILOU'
  });
  return _req2.default.post('/payment', params);
}