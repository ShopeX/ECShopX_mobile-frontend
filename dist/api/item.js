'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.search = search;
exports.detail = detail;
exports.desc = desc;
exports.rateList = rateList;
exports.category = category;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function search() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // return req.get('/item.search', params)
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/goods/items', params);
}

function detail(item_id) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // return req.get('/item.detail', { item_id, ...params })
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/goods/items/' + item_id, params);
}

function desc(item_id) {
  return _req2.default.get('/item.desc', { item_id: item_id });
}

function rateList(item_id) {
  return _req2.default.get('/item.rate.list', { item_id: item_id });
}

function category() {
  return _req2.default.get('/category.itemCategory');
}