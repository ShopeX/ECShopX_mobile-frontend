"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throttle = exports.debounce = exports.log = exports.styleNames = exports.classNames = undefined;

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
exports.calcTimer = calcTimer;
exports.resolveOrderStatus = resolveOrderStatus;
exports.goToPage = goToPage;
exports.maskMobile = maskMobile;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../npm/classnames/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../npm/stylenames/lib/index.js");

var _index6 = _interopRequireDefault(_index5);

var _index7 = require("../npm/qs/lib/index.js");

var _index8 = _interopRequireDefault(_index7);

var _moment = require("../npm/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _index9 = require("../consts/index.js");

var _get2 = require("../npm/lodash/get.js");

var _get3 = _interopRequireDefault(_get2);

var _findKey2 = require("../npm/lodash/findKey.js");

var _findKey3 = _interopRequireDefault(_findKey2);

var _pickBy2 = require("../npm/lodash/pickBy.js");

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _debounce = require("../npm/lodash/debounce.js");

var _debounce2 = _interopRequireDefault(_debounce);

var _throttle = require("../npm/lodash/throttle.js");

var _throttle2 = _interopRequireDefault(_throttle);

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
  {
    // eslint-disable-next-line
    var page = getCurrentPages().pop();
    router = page.$component.$router;
  }
  var _router = router,
      path = _router.path,
      origParams = _router.params;

  var params = (0, _pickBy3.default)(origParams, function (val) {
    return val !== '';
  });

  var fullPath = "" + path + (Object.keys(params).length > 0 ? '?' + _index8.default.stringify(params) : '');

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

  if (isRedirect) {
    return _index2.default.redirectTo({ url: url });
  }

  return _index2.default.navigateTo({ url: url });
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
  var formatter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD HH:mm:ss';

  return (0, _moment2.default)(time).format(formatter);
}

function copyText(text) {
  var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '内容已复制';

  return new Promise(function (resolve, reject) {
    {
      _index2.default.setClipboardData({
        data: text,
        success: resolve,
        error: reject
      });
    }
  });
}

function calcTimer(totalSec) {
  var remainingSec = totalSec;
  var dd = Math.floor(totalSec / 24 / 3600);
  remainingSec -= dd * 3600 * 24;
  var hh = Math.floor(remainingSec / 3600);
  remainingSec -= hh * 3600;
  var mm = Math.floor(remainingSec / 60);
  remainingSec -= mm * 60;
  var ss = Math.floor(remainingSec);

  return {
    dd: dd,
    hh: hh,
    mm: mm,
    ss: ss
  };
}

function resolveOrderStatus(status, isBackwards) {
  if (isBackwards) {
    return (0, _findKey3.default)(_index9.STATUS_TYPES_MAP, function (o) {
      return o === status;
    });
  }

  return _index9.STATUS_TYPES_MAP[status];
}

function goToPage(page) {
  // eslint-disable-next-line
  var loc = location;
  page = page.replace(/^\//, '');
  var url = loc.protocol + "//" + loc.host + "/" + page;
  console.log(url);
  loc.href = url;
}

function maskMobile(mobile) {
  return mobile.replace(/^(\d{2})(\d+)(\d{2}$)/, '$1******$3');
}

exports.classNames = _index4.default;
exports.styleNames = _index6.default;
exports.log = _log2.default;
exports.debounce = _debounce2.default;
exports.throttle = _throttle2.default;