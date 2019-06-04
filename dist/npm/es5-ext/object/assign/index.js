"use strict";

module.exports = require("./is-implemented.js")() ? Object.assign : require("./shim.js");