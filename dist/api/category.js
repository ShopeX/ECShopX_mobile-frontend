'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.getCategory = getCategory;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function get() {
  return _req2.default.get('/goods/category');
}

function getCategory() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/pageparams/setting', params);
}