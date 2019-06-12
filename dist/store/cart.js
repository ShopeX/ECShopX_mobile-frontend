'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createReducer;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getTotalCount = getTotalCount;
exports.getTotalPrice = getTotalPrice;
exports.getSelectedCart = getSelectedCart;

var _index = require('../npm/redux-create-reducer/index.js');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// import dotProp from 'dot-prop-immutable'

function walkCart(state, fn) {
  state.list.forEach(function (shopCart) {
    shopCart.list.forEach(fn);
  });
}

var initState = {
  list: [],
  cartIds: [],
  fastbuy: null,
  coupon: null,
  selection: []
};

var cart = (0, _index.createReducer)(initState, (_createReducer = {}, _defineProperty(_createReducer, 'cart/checkout', function cartCheckout(state, action) {
  var checkoutItem = action.payload;

  return _extends({}, state, {
    checkoutItem: checkoutItem
  });
}), _defineProperty(_createReducer, 'cart/fastbuy', function cartFastbuy(state, action) {
  var _action$payload = action.payload,
      item = _action$payload.item,
      _action$payload$num = _action$payload.num,
      num = _action$payload$num === undefined ? 1 : _action$payload$num;


  return _extends({}, state, {
    fastbuy: _extends({}, item, {
      num: num
    })
  });
}), _defineProperty(_createReducer, 'cart/updateNum', function cartUpdateNum(state, action) {
  var _action$payload2 = action.payload,
      cart_id = _action$payload2.cart_id,
      num = _action$payload2.num;


  walkCart(state, function (t) {
    if (t.cart_id === cart_id) {
      t.num = num;
    }
  });
  var list = [].concat(_toConsumableArray(state.list));

  return _extends({}, state, {
    list: list
  });
}), _defineProperty(_createReducer, 'cart/update', function cartUpdate(state, action) {
  var list = action.payload;
  var cartIds = [];
  walkCart({ list: list }, function (t) {
    cartIds.push(t.cart_id);
  });

  return _extends({}, state, {
    list: list,
    cartIds: cartIds
  });
}), _defineProperty(_createReducer, 'cart/clearFastbuy', function cartClearFastbuy(state) {
  return _extends({}, state, {
    fastbuy: null
  });
}), _defineProperty(_createReducer, 'cart/clear', function cartClear(state) {
  return _extends({}, state, initState);
}), _defineProperty(_createReducer, 'cart/clearCoupon', function cartClearCoupon(state) {
  return _extends({}, state, {
    coupon: null
  });
}), _defineProperty(_createReducer, 'cart/selection', function cartSelection(state, action) {
  var selection = action.payload;
  return _extends({}, state, {
    selection: selection
  });
}), _defineProperty(_createReducer, 'cart/changeCoupon', function cartChangeCoupon(state, action) {
  var coupon = action.payload;

  return _extends({}, state, {
    coupon: coupon
  });
}), _createReducer));

exports.default = cart;
function getTotalCount(state, isAll) {
  var total = 0;

  walkCart(state, function (item) {
    if (!isAll && !state.selection.includes(item.cart_id)) return;
    total += +item.num;
  });

  return total;
}

function getTotalPrice(state) {
  var total = 0;

  walkCart(state, function (item) {
    if (!state.selection.includes(item.cart_id)) return;

    total += +item.price * +item.num;
  });

  return total.toFixed(2);
}

function getSelectedCart(state) {
  return state.list.filter(function (item) {
    return state.selection.includes(item.item_id);
  });
}