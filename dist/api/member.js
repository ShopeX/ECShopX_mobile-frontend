'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memberInfo = memberInfo;
exports.setMemberInfo = setMemberInfo;
exports.pointDetail = pointDetail;
exports.favsList = favsList;
exports.addFav = addFav;
exports.delFav = delFav;
exports.couponList = couponList;
exports.homeCouponList = homeCouponList;
exports.homeCouponGet = homeCouponGet;
exports.addressList = addressList;
exports.addressCreate = addressCreate;
exports.addressUpdate = addressUpdate;
exports.addressDelete = addressDelete;
exports.areaList = areaList;
exports.addressCreateOrUpdate = addressCreateOrUpdate;
exports.itemHistorySave = itemHistorySave;
exports.itemHistory = itemHistory;
exports.getRechargeNumber = getRechargeNumber;
exports.qrcodeData = qrcodeData;
exports.promoter = promoter;
exports.h5_qrcodeData = h5_qrcodeData;
exports.pointList = pointList;
exports.pointTotal = pointTotal;
exports.depositList = depositList;
exports.depositTotal = depositTotal;
exports.depositPay = depositPay;
exports.depositPayRule = depositPayRule;
exports.formId = formId;
exports.recommendUserInfo = recommendUserInfo;
exports.recommendIndexInfo = recommendIndexInfo;
exports.recommendMember = recommendMember;
exports.recommendOrder = recommendOrder;
exports.depositToPoint = depositToPoint;
exports.pointDraw = pointDraw;
exports.pointDrawRule = pointDrawRule;
exports.pointDrawSwiper = pointDrawSwiper;
exports.pointDrawDetail = pointDrawDetail;
exports.pointDrawIntro = pointDrawIntro;
exports.pointDrawPay = pointDrawPay;
exports.pointDrawPayList = pointDrawPayList;
exports.pointDrawLuck = pointDrawLuck;
exports.pointOrderDetail = pointOrderDetail;
exports.pointOrderAddress = pointOrderAddress;
exports.pointOrderConfirm = pointOrderConfirm;
exports.pointDrawLuckAll = pointDrawLuckAll;
exports.pointMyOrder = pointMyOrder;
exports.pointAllOrder = pointAllOrder;
exports.pointCompute = pointCompute;
exports.pointCheckLucky = pointCheckLucky;
exports.pointComputeResult = pointComputeResult;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function memberInfo() {
  return _req2.default.get('/member');
}

function setMemberInfo() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.put('/member', params);
}

function pointDetail() {
  return _req2.default.get('/member.point.detail');
}

function favsList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/member/collect/item', params);
}

function addFav(item_id) {
  return _req2.default.post('/member/collect/item/' + item_id);
}

function delFav(item_ids) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  item_ids = Array.isArray(item_ids) ? item_ids : [item_ids];
  var _params$is_empty = params.is_empty,
      is_empty = _params$is_empty === undefined ? false : _params$is_empty;

  return _req2.default.delete('/member/collect/item', {
    item_ids: item_ids,
    is_empty: is_empty
  });
}

function couponList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/user/newGetCardList', params);
}

function homeCouponList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/getCardList', params);
}

function homeCouponGet() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/user/receiveCard', params);
}

function addressList() {
  return _req2.default.get('/member/addresslist');
}

function addressCreate() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.post('/member/address', params);
}

function addressUpdate(data) {
  return _req2.default.put('/member/address/' + data.address_id, data);
}

function addressDelete(address_id) {
  return _req2.default.delete('/member/address/' + address_id);
}

/*export function areaList () {
  return req.get('/member/addressarea')
}*/

function areaList() {
  return _req2.default.get('/espier/address');
}

function addressCreateOrUpdate(data) {
  var fn = data.address_id ? addressUpdate : addressCreate;
  return fn(data);
}

function itemHistorySave(item_id) {
  return _req2.default.post('/member/browse/history/save', { item_id: item_id });
}

function itemHistory(params) {
  return _req2.default.get('/member/browse/history/list', params);
}

function getRechargeNumber() {
  return _req2.default.get('/deposit/rechargerules');
}

function qrcodeData() {
  return _req2.default.get('/promoter/qrcode');
}

function promoter() {
  return _req2.default.post('/promoter');
}

function h5_qrcodeData() {
  return _req2.default.get('/brokerage/qrcode');
}

function pointList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/point/member', params);
}

function pointTotal() {
  return _req2.default.get('/point/member/info');
}

function depositList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/deposit/list', params);
}

function depositTotal() {
  return _req2.default.get('/deposit/info');
}

function depositPay() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.post('/deposit/recharge_new', params);
}

function depositPayRule() {
  return _req2.default.get('/deposit/recharge/agreement');
}

function formId(formid) {
  return _req2.default.post('/promotion/formid', { formid: formid });
}

function recommendUserInfo() {
  return _req2.default.get('/promoter/info');
}

function recommendIndexInfo() {
  return _req2.default.get('/promoter/index');
}

function recommendMember() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/promoter/children', params);
}

function recommendOrder() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/promoter/brokerages', params);
}

function depositToPoint() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.post('/deposit/to/point', params);
}

function pointDraw() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/promotion/luckydraw', params);
}

function pointDrawRule() {
  return _req2.default.get('/promotion/luckyrules');
}

function pointDrawSwiper() {
  return _req2.default.get('/promotion/luckydraw_show');
}

function pointDrawDetail(luckydraw_id) {
  return _req2.default.get('/promotion/luckydraw/' + luckydraw_id);
}

function pointDrawIntro(item_id) {
  return _req2.default.get('/goods/itemintro/' + item_id);
}

function pointDrawPay() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.post('/promotion/luckydraworder', params);
}

function pointDrawPayList() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/promotion/luckydraw/joinactivitys', params);
}

function pointDrawLuck() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/promotion/luckydrawmember', params);
}

function pointOrderDetail(luckydraw_trade_id) {
  return _req2.default.get('/promotion/member/luckydraworder/' + luckydraw_trade_id);
}

function pointOrderAddress() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.post('/promotion/member/luckyaddress', params);
}

function pointOrderConfirm() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.post('/promotion/member/luckyorderfinish', params);
}

function pointDrawLuckAll() {
  return _req2.default.get('/promotion/luckydrawmember');
}

function pointMyOrder() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/promotion/luckydrawjoinlist', params);
}

function pointAllOrder(luckydraw_id) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return _req2.default.get('/promotion/luckydraw/alljoinlist/' + luckydraw_id, params);
}

function pointCompute(luckydraw_id) {
  return _req2.default.get('/promotion/luckydraw/winning/' + luckydraw_id);
}

function pointCheckLucky(luckydraw_id) {
  return _req2.default.get('/promotion/luckydraw/checkwinning/' + luckydraw_id);
}

function pointComputeResult(luckydraw_id) {
  return _req2.default.get('/promotion/luckydraw/luckylogic/' + luckydraw_id);
}