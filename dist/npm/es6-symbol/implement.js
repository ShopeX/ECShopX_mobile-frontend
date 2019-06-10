'use strict';

if (!require("./is-implemented.js")()) {
  Object.defineProperty(require("../es5-ext/global.js"), 'Symbol', { value: require("./polyfill.js"), configurable: true, enumerable: false,
    writable: true });
}