'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.login = login;
exports.logout = logout;
exports.refreshToken = refreshToken;
exports.reg = reg;
exports.regRule = regRule;
exports.regImg = regImg;
exports.regSmsCode = regSmsCode;
exports.regParam = regParam;
exports.info = info;
exports.forgotPwd = forgotPwd;
exports.prelogin = prelogin;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAppId = function getAppId() {
  var _ref = wx.getExtConfigSync ? wx.getExtConfigSync() : {},
      appid = _ref.appid;

  return appid;
};

function login(data) {
  return _req2.default.post('/login', data);
}

function logout() {
  return _req2.default.post('/user.logout');
}

function refreshToken() {
  return _req2.default.get('/token/refresh');
}

function reg(params) {
  var appid = getAppId();
  return _req2.default.post('/member', _extends({}, params, {
    appid: appid
  }));
}

function regRule() {
  return _req2.default.get('/member/agreement');
}

function regImg() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/member/image/code', params);
}

function regSmsCode() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/member/sms/code', params);
}

function regParam() {
  return _req2.default.get('/member/setting');
}

function info() {
  return { data: {}
    // return req.get('/member/setting')
  };
}

function forgotPwd() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.post('/member/reset/password', params);
}

function prelogin(data) {
  return _req2.default.post('/prelogin', data);
}