'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = login;
exports.logout = logout;
exports.refreshToken = refreshToken;
exports.reg = reg;
exports.regParam = regParam;
exports.info = info;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function login(data) {
  return _req2.default.post('http://pjj.aixue7.com/index.php/api/h5app/wxapp/login?company_id=1', data);
}

function logout() {
  return _req2.default.post('/user.logout');
}

function refreshToken() {
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/token/refresh');
}

function reg(data) {
  // return req.post('http://pjj.aixue7.com/index.php/api/weapp/deposit/rechargeruleshttp://api.espier.local/index.php/api/h5app/wxapp/member', data)
  return _req2.default.post('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member?company_id=1', data);
}

function regParam() {
  // return req.post('http://pjj.aixue7.com/index.php/api/weapp/deposit/rechargeruleshttp://api.espier.local/index.php/api/h5app/wxapp/member', data)
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/setting?company_id=1');
}

function info() {
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/setting?company_id=1');
}