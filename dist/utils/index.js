"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.styleNames = exports.classNames = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.isFunction = isFunction;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isString = isString;
exports.normalizeArray = normalizeArray;
exports.getCurrentRoute = getCurrentRoute;
exports.normalizeQuerys = normalizeQuerys;
exports.pickBy = pickBy;
exports.navigateTo = navigateTo;
exports.resolvePath = resolvePath;
exports.formatTime = formatTime;
exports.formatDataTime = formatDataTime;
exports.copyText = copyText;

var _index = require("../npm/classnames/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../npm/stylenames/lib/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../npm/@tarojs/taro-weapp/index.js");

var _index6 = _interopRequireDefault(_index5);

var _index7 = require("../npm/qs/lib/index.js");

var _index8 = _interopRequireDefault(_index7);

var _moment = require("../npm/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _get2 = require("../npm/lodash/get.js");

var _get3 = _interopRequireDefault(_get2);

var _log = require("./log.js");

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var isPrimitiveType = function isPrimitiveType(val, type) {
  return Object.prototype.toString.call(val) === type;
};

function isFunction(val) {
  return isPrimitiveType(val, '[object Function]');
}

function isNumber(val) {
  return isPrimitiveType(val, '[object Number]');
}

function isObject(val) {
  return isPrimitiveType(val, '[object Object]');
}

function isArray(arr) {
  return Array.isArray(arr);
}

function isString(val) {
  return typeof val === 'string';
}

function normalizeArray() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.reduce(function (ret, item) {
    return ret.concat(item);
  }, []);
}

function getCurrentRoute(router) {
  var params = router.params,
      path = router.path;

  var fullPath = "" + path + (params ? '?' + _index8.default.stringify(params) : '');

  return {
    path: path,
    fullPath: fullPath,
    params: params
  };
}

function normalizeQuerys() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var scene = params.scene,
      rest = _objectWithoutProperties(params, ["scene"]);

  var queryStr = decodeURIComponent(scene);

  var ret = _extends({}, rest, _index8.default.parse(queryStr));

  return ret;
}

function pickBy(arr) {
  var keyMaps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var picker = function picker(item) {
    var ret = {};

    Object.keys(keyMaps).forEach(function (key) {
      var val = keyMaps[key];

      if (isString(val)) {
        ret[key] = (0, _get3.default)(item, val);
      } else if (isFunction(val)) {
        ret[key] = val(item);
      } else {
        ret[key] = val;
      }
    });

    return ret;
  };

  if (isArray(arr)) {
    return arr.map(picker);
  } else {
    return picker(arr);
  }
}

function navigateTo(url, isRedirect) {
  if (isObject(isRedirect)) {
    isRedirect = false;
  }
  return _index6.default[!isRedirect ? 'navigateTo' : 'redirectTo']({
    url: url
  });
}

function resolvePath(baseUrl) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var queryStr = typeof params === 'string' ? params : _index8.default.stringify(params);

  return "" + baseUrl + (baseUrl.indexOf('?') >= 0 ? '&' : '?') + queryStr;
}

function formatTime(time) {
  var formatter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD';

  return (0, _moment2.default)(time).format(formatter);
}

function formatDataTime(time) {
  var formatter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD hh:mm:ss';

  return (0, _moment2.default)(time).format(formatter);
}

function copyText(text) {
  var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '内容已复制';

  return new Promise(function (resolve, reject) {
    {
      _index6.default.setClipboardData({
        data: text,
        success: resolve,
        error: reject
      });
    }
  });
}

exports.classNames = _index2.default;
exports.styleNames = _index4.default;
exports.log = _log2.default;