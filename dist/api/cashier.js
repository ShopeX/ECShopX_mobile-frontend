"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrderDetail = getOrderDetail;
exports.getPayment = getPayment;

var _req = require("./req.js");

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOrderDetail(order_id) {
  return _req2.default.get("/order_new/" + order_id);
}

function getPayment() {
  var parmas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.post('/payment', parmas);
}