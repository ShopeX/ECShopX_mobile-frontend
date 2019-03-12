'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var noop = function noop() {};

var debug = function debug() {
  var _console, _console2;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var cArgs = [];
  args.forEach(function (item) {
    var cItem = (typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== 'object' ? ['%c' + item, 'color: #3e76f6; font-weight: normal;'] : item;
    cArgs = cArgs.concat(cItem);
  });

  (_console = console).groupCollapsed.apply(_console, _toConsumableArray(cArgs));
  (_console2 = console).trace.apply(_console2, args);
  console.groupEnd();
};

var log = _extends({}, console, {
  debug: debug
});

exports.default = log;