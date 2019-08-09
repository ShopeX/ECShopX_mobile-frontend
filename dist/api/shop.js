'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShop = getShop;
exports.list = list;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getShop() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/distributor/is_valid', params);
}

function list() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/distributor/list', params);
}