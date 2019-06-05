'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

function login(data) {
  return _req2.default.post('/login', data);
}

function logout() {
  return _req2.default.post('/user.logout');
}

function refreshToken() {
  return _req2.default.get('/token/refresh');
}

function reg(data) {
  return _req2.default.post('/member', data);
}

function regRule() {
  return _req2.default.get('/member/agreement');
}

function regImg() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // return req.post('http://pjj.aixue7.com/index.php/api/weapp/deposit/rechargeruleshttp://api.espier.local/index.php/api/h5app/wxapp/member', data)
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