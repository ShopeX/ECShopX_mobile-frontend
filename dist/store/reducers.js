"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require("../npm/redux/lib/redux.js");

var _cart = require("./cart.js");

var _cart2 = _interopRequireDefault(_cart);

var _user = require("./user.js");

var _user2 = _interopRequireDefault(_user);

var _address = require("./address.js");

var _address2 = _interopRequireDefault(_address);

var _member = require("./member.js");

var _member2 = _interopRequireDefault(_member);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
  cart: _cart2.default,
  user: _user2.default,
  address: _address2.default,
  member: _member2.default
});