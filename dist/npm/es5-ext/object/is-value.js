"use strict";

var _undefined = require("../function/noop.js")(); // Support ES3 engines

module.exports = function (val) {
  return val !== _undefined && val !== null;
};