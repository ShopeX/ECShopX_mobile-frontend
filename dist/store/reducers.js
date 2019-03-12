"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require("../npm/redux/lib/redux.js");

var _cart = require("./cart.js");

var _cart2 = _interopRequireDefault(_cart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
  cart: _cart2.default
});