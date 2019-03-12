"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createReducer;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getTotalCount = getTotalCount;
exports.getSelectedCart = getSelectedCart;

var _index = require("../npm/redux-create-reducer/index.js");

var _index2 = require("../npm/dot-prop-immutable/index.js");

var _index3 = _interopRequireDefault(_index2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initState = {
  list: [],
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
}), _defineProperty(_createReducer, 'cart/add', function cartAdd(state, action) {
  var _action$payload2 = action.payload,
      item = _action$payload2.item,
      _action$payload2$num = _action$payload2.num,
      num = _action$payload2$num === undefined ? 1 : _action$payload2$num;

  var idx = state.list.findIndex(function (t) {
    return item.item_id === t.item_id;
  });
  var list = void 0;

  if (idx >= 0) {
    list = _index3.default.set(state.list, "" + idx, _extends({}, item, { num: +state.list[idx].num + num }));
  } else {
    list = [].concat(_toConsumableArray(state.list), [_extends({}, item, { num: num })]);
  }

  return _extends({}, state, {
    list: list
  });
}), _defineProperty(_createReducer, 'cart/update', function cartUpdate(state, action) {
  var _action$payload3 = action.payload,
      item = _action$payload3.item,
      num = _action$payload3.num;

  var idx = state.list.findIndex(function (t) {
    return item.item_id === t.item_id;
  });
  var list = void 0;

  if (idx >= 0) {
    list = _index3.default.set(state.list, "" + idx, _extends({}, item, { num: num }));
  } else {
    list = [].concat(_toConsumableArray(state.list), [_extends({}, item, { num: num })]);
  }

  return _extends({}, state, {
    list: list
  });
}), _defineProperty(_createReducer, 'cart/delete', function cartDelete(state, action) {
  var item_id = action.payload.item_id;

  var idx = state.list.findIndex(function (t) {
    return t.item_id === item_id;
  });

  return _index3.default.delete(state, "list." + idx);
}), _defineProperty(_createReducer, 'cart/clearFastbuy', function cartClearFastbuy(state) {
  return _extends({}, state, {
    fastbuy: null
  });
}), _defineProperty(_createReducer, 'cart/clear', function cartClear(state) {
  return _extends({}, state, initState);
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
function getTotalCount(state) {
  return state.list.reduce(function (acc, item) {
    return +item.num + acc;
  }, 0);
}

function getSelectedCart(state) {
  console.log(state.selection);
  return state.list.filter(function (item) {
    return state.selection.includes(item.item_id);
  });
}