"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.info = info;
exports.code = code;
exports.userInfo = userInfo;
exports.login = login;
exports.prelogin = prelogin;
exports.decryptPhone = decryptPhone;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _req = require("./req.js");

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAppId = function getAppId() {
  var _ref = wx.getExtConfigSync ? wx.getExtConfigSync() : {},
      appid = _ref.appid;

  return appid;
};

function info(data) {
  return _req2.default.post('/wx.info', data);
}

function code(code) {
  return _req2.default.get('/wx.code', { code: code });
}

function userInfo() {
  return _req2.default.get('/wx.user.info');
}

function login(params) {
  var appid = getAppId();
  return _req2.default.post('/login', _extends({}, params, {
    appid: appid,
    auth_type: 'wxapp'
  }), { showError: false });
}

function prelogin(params) {
  var appid = getAppId();
  return _req2.default.post('/prelogin', _extends({}, params, {
    appid: appid,
    auth_type: 'wxapp'
  }));
}

function decryptPhone(params) {
  var appid = getAppId();
  return _req2.default.get('/member/decryptPhone', _extends({}, params, {
    appid: appid
  }));
}