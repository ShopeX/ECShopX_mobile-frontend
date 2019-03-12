"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _article = require("./article.js");

var article = _interopRequireWildcard(_article);

var _cart = require("./cart.js");

var cart = _interopRequireWildcard(_cart);

var _cashier = require("./cashier.js");

var cashier = _interopRequireWildcard(_cashier);

var _category = require("./category.js");

var category = _interopRequireWildcard(_category);

var _item = require("./item.js");

var item = _interopRequireWildcard(_item);

var _member = require("./member.js");

var member = _interopRequireWildcard(_member);

var _region = require("./region.js");

var region = _interopRequireWildcard(_region);

var _trade = require("./trade.js");

var trade = _interopRequireWildcard(_trade);

var _user = require("./user.js");

var user = _interopRequireWildcard(_user);

var _wx = require("./wx.js");

var wx = _interopRequireWildcard(_wx);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  article: article,
  cart: cart,
  cashier: cashier,
  category: category,
  item: item,
  member: member,
  region: region,
  trade: trade,
  user: user,
  wx: wx
};