'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointDetail = pointDetail;
exports.couponList = couponList;
exports.addressList = addressList;
exports.addressCreate = addressCreate;
exports.addressUpdate = addressUpdate;
exports.addressDelete = addressDelete;
exports.areaList = areaList;
exports.addressCreateOrUpdate = addressCreateOrUpdate;
exports.favoriteItems = favoriteItems;
exports.getRechargeNumber = getRechargeNumber;
exports.qrcodeData = qrcodeData;
exports.pointList = pointList;
exports.pointTotal = pointTotal;
exports.depositList = depositList;
exports.depositTotal = depositTotal;
exports.recommendUserInfo = recommendUserInfo;
exports.recommendIndexInfo = recommendIndexInfo;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pointDetail() {
  return _req2.default.get('/member.point.detail');
}

function couponList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/user/newGetCardList', params);
}

function addressList() {
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/addresslist');
}

function addressCreate() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.post('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/address', params);
}

function addressUpdate(data) {
  return _req2.default.put('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/address/' + data.address_id, data);
}

function addressDelete(address_id) {
  return _req2.default.delete('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/address/' + address_id);
}

function areaList() {
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/addressarea');
}

function addressCreateOrUpdate(data) {
  var fn = data.address_id ? addressUpdate : addressCreate;
  return fn(data);
}

function favoriteItems() {
  return _req2.default.get('/member.favorite.item.list');
}

function getRechargeNumber() {
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/weapp/deposit/rechargerules');
}

function qrcodeData() {
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/promoter/qrcode');
}

function pointList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/point/member', params);
}

function pointTotal() {
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/point/member/info');
}

function depositList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/weapp/deposit/list', params);
}

function depositTotal() {
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/weapp/deposit/info');
}

function recommendUserInfo() {
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/promoter/info');
}

function recommendIndexInfo() {
  return _req2.default.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/promoter/index');
}