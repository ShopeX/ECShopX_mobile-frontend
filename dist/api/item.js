'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.search = search;
exports.detail = detail;
exports.desc = desc;
exports.rateList = rateList;
exports.category = category;
exports.groupList = groupList;
exports.seckillCheck = seckillCheck;
exports.seckillCancelCheck = seckillCancelCheck;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function search() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // return req.get('/item.search', params)
  return _req2.default.get('/goods/items', params);
}

function detail(item_id) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return _req2.default.get('/goods/items/' + item_id, params);
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

function groupList(params) {
  return _req2.default.get('/promotions/groups', params);
}

function seckillCheck(_ref) {
  var item_id = _ref.item_id,
      _ref$num = _ref.num,
      num = _ref$num === undefined ? 1 : _ref$num,
      seckill_id = _ref.seckill_id;

  return _req2.default.get('/promotion/seckillactivity/geticket', {
    item_id: item_id,
    num: num,
    seckill_id: seckill_id
  });
}

function seckillCancelCheck() {
  return _req2.default.delete('/promotion/seckillactivity/cancelTicket');
}