'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.get = get;
exports.getBasic = getBasic;
exports.add = add;
exports.update = update;
exports.del = del;
exports.checkout = checkout;
exports.total = total;
exports.coupons = coupons;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function get(params) {
  // return req.get('/cart.get')
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/cart', _extends({
    shop_type: 'distributor'
  }, params));
}

function getBasic(params) {
  // return req.get('/cart.get.basic')
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/cart', _extends({
    shop_type: 'distributor'
  }, params));
}

function add(item) {
  var num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  // return req.post('/cart.add', { sku_id, quantity })
  var item_id = item.item_id,
      shop_id = item.shop_id;

  return _req2.default.post('http://pjj.aixue7.com/index.php/api/h5app/wxapp/cart', {
    item_id: item_id,
    shop_id: shop_id,
    num: num,
    shop_type: 'distributor'
  });
}

function update(_ref) {
  var cart_params = _ref.cart_params;

  return _req2.default.post('/cart.update', { cart_params: cart_params });
}

function del(_ref2) {
  var cart_id = _ref2.cart_id;

  return _req2.default.post('/cart.del', { cart_id: cart_id });
}

function checkout() {
  return _req2.default.get('/cart.checkout');
}

function total(params) {
  // return req.post('/cart.total')
  return _req2.default.post('http://pjj.aixue7.com/index.php/api/h5app/wxapp/getFreightFee', params);
}

function coupons(params) {
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/user/newGetCardList', params);
}