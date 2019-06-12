'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeClass = exports.addClass = exports.hasClass = undefined;
exports.isElement = isElement;
exports.lockScreen = lockScreen;
exports.toggleTouchMove = toggleTouchMove;

var _index = require('../npm/nervjs/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isElement(o) {
  return o instanceof Element;
}

var hasClass = exports.hasClass = function hasClass(el, cls) {
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return !!(el.className || '').match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }
};

var addClass = exports.addClass = function addClass(el, cls) {
  if (el.classList) {
    el.classList.add(cls);
  } else if (!hasClass(el, cls)) {
    el.className += ' ' + cls;
  }
};

var removeClass = exports.removeClass = function removeClass(el, cls) {
  if (el.classList) {
    el.classList.remove(cls);
  } else {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)', 'g');
    el.className = el.className.replace(reg, '');
  }
};

function lockScreen() {
  var isLock = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
}

function toggleTouchMove(el) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
}