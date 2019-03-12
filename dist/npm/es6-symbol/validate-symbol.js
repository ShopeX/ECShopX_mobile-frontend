'use strict';

var isSymbol = require("./is-symbol.js");

module.exports = function (value) {
  if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
  return value;
};