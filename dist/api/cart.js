'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.get = get;
exports.count = count;
exports.add = add;
exports.fastBuy = fastBuy;
exports.del = del;
exports.select = select;
exports.updateNum = updateNum;
exports.updatePromotion = updatePromotion;
exports.checkout = checkout;
exports.total = total;
exports.coupons = coupons;
exports.likeList = likeList;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function get(params) {
  return _req2.default.get('/cart', _extends({
    shop_type: 'distributor'
  }, params));
}

function count(params) {
  return _req2.default.get('/cartcount', _extends({
    shop_type: 'distributor'
  }, params));
}

function add(params) {
  var item_id = params.item_id,
      _params$num = params.num,
      num = _params$num === undefined ? 1 : _params$num,
      _params$isAccumulate = params.isAccumulate,
      isAccumulate = _params$isAccumulate === undefined ? false : _params$isAccumulate;

  return _req2.default.post('/cart', {
    item_id: item_id,
    num: num,
    isAccumulate: isAccumulate,
    shop_type: 'distributor'
  });
}

function fastBuy(params) {
  var item_id = params.item_id,
      _params$num2 = params.num,
      num = _params$num2 === undefined ? 1 : _params$num2;

  return _req2.default.post('/cart', {
    cart_type: 'fastbuy',
    item_id: item_id,
    num: num,
    isAccumulate: false,
    shop_type: 'distributor'
  });
}

function del(_ref) {
  var cart_id = _ref.cart_id;

  return _req2.default.delete('/cartdel', { cart_id: cart_id });
}

function select(_ref2) {
  var cart_id = _ref2.cart_id,
      is_checked = _ref2.is_checked;

  return _req2.default.put('/cartupdate/checkstatus', { cart_id: cart_id, is_checked: is_checked });
}

function updateNum(_ref3) {
  var cart_id = _ref3.cart_id,
      num = _ref3.num;

  return _req2.default.put('/cartupdate/num', { cart_id: cart_id, num: num });
}

function updatePromotion(_ref4) {
  var cart_id = _ref4.cart_id,
      activity_id = _ref4.activity_id;

  return _req2.default.put('/cartupdate/promotion', { cart_id: cart_id, activity_id: activity_id });
}

function checkout() {
  return _req2.default.get('/cart.checkout');
}

function total(params) {
  // return req.post('/cart.total')
  return _req2.default.post('/getFreightFee', params);
}

function coupons(params) {
  return _req2.default.get('/user/newGetCardList', params);
}

function likeList(params) {
  return _req2.default.get('/promotions/recommendlike', params);
}