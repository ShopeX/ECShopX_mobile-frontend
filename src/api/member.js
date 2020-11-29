import req from './req'

export function memberInfo () {
  return req.get('/member')
}

export function setMemberInfo (params = {}) {
  return req.put('/member', params)
}

export function pointDetail () {
  return req.get('/member.point.detail')
}

export function favsList (params = {}) {
  return req.get('/member/collect/item', params,null, { showError: false })
}

export function addFav (item_id) {
  return req.post(`/member/collect/item/${item_id}`)
}

export function delFav (item_ids, params = {}) {
  item_ids = Array.isArray(item_ids) ? item_ids : [item_ids]
  const { is_empty = false } = params
  return req.delete('/member/collect/item', {
    item_ids,
    is_empty
  })
}


export function memberAssets () {
  return req.get(`/member/statistical`)
}

export function couponList (params = {}) {
  return req.get('/user/newGetCardList', params)
}

export function homeCouponList (params = {}) {
  return req.get('/getCardList', params)
}

export function homeCouponGet (params = {}) {
  return req.get('/user/receiveCard', params)
}

export function getCardDetail (params = {}) {
  return req.get('/user/getCardDetail', params)
}

export function userUsedCard (params = {}) {
  return req.get('/user/usedCard', params)
}

export function addressList () {
  return req.get('/member/addresslist')
}
export function crmAddressList (params = {}) {//获取crm地址
  return req.post('/member/crmaddresslist',params)
}

export function addressCreate (params = {}) {
  return req.post('/member/address', params)
}

export function addressUpdate (data) {
  return req.put(`/member/address/${data.address_id}`, data)
}

export function addressDelete (address_id) {
  return req.delete(`/member/address/${address_id}`)
}

/*export function areaList () {
  return req.get('/member/addressarea')
}*/

export function areaList () {
  return req.get('/espier/address')
}

export function addressCreateOrUpdate (data) {
  const fn = data.address_id ? addressUpdate : addressCreate
  return fn(data)
}

export function itemHistorySave (item_id) {
  return req.post('/member/browse/history/save', { item_id })
}

export function itemHistory (params) {
  return req.get('/member/browse/history/list', params)
}

export function getRechargeNumber () {
  return req.get('/deposit/rechargerules')
}

// 充值
export function rehcargePay (params) {
  return req.post('/deposit/recharge', params)
}

export function qrcodeData () {
  return req.get('/promoter/qrcode')
}

export function memberCode (params) {
  return req.get('/barcode', params)
}

export function promoter () {
  return req.post('/promoter')
}

export function h5_qrcodeData () {
  return req.get('/brokerage/qrcode')
}

export function pointList (params = {}) {
  return req.get('/member/dh/point/history', params)
}

export function pointTotal () {
  return req.get('/point/member/info')
}

export function depositList (params = {}) {
  return req.get('/deposit/list', params)
}

export function depositTotal () {
  return req.get('/deposit/info')
}

export function depositPay (params = {}) {
  return req.post('/deposit/recharge_new', params)
}

export function depositPayRule () {
  return req.get('/deposit/recharge/agreement')
}

export function formId (formid) {
  return req.post('/promotion/formid', { formid })
}

export function recommendUserInfo () {
  return req.get('/promoter/info')
}

export function recommendIndexInfo () {
  return req.get('/promoter/index')
}

export function recommendMember (params = {}) {
  return req.get('/promoter/children', params)
}

export function recommendOrder (params = {}) {
  return req.get('/promoter/brokerages', params)
}

export function depositToPoint (params = {}) {
  return req.post('/deposit/to/point', params)
}

export function pointDraw (params = {}) {
  return req.get('/promotion/luckydraw', params)
}

export function pointDrawRule () {
  return req.get('/promotion/luckyrules')
}

export function pointDrawSwiper () {
  return req.get('/promotion/luckydraw_show')
}

export function pointDrawDetail (luckydraw_id) {
  return req.get(`/promotion/luckydraw/${luckydraw_id}`)
}

export function pointDrawIntro (item_id) {
  return req.get(`/goods/itemintro/${item_id}`)
}

export function pointDrawPay (params = {}) {
  return req.post('/promotion/luckydraworder', params)
}

export function pointDrawPayList (params = {}) {
  return req.get('/promotion/luckydraw/joinactivitys', params)
}

export function pointDrawLuck (params = {}) {
  return req.get('/promotion/luckydrawmember', params)
}

export function pointOrderDetail (luckydraw_trade_id) {
  return req.get(`/promotion/member/luckydraworder/${luckydraw_trade_id}`)
}

export function pointOrderAddress (params = {}) {
  return req.post('/promotion/member/luckyaddress', params)
}

export function pointOrderConfirm (params = {}) {
  return req.post('/promotion/member/luckyorderfinish', params)
}

export function pointDrawLuckAll () {
  return req.get(`/promotion/luckydrawmember`)
}

export function pointMyOrder (params = {}) {
  return req.get(`/promotion/luckydrawjoinlist`, params)
}

export function pointAllOrder (luckydraw_id, params = {}) {
  return req.get(`/promotion/luckydraw/alljoinlist/${luckydraw_id}`, params)
}

export function pointCompute (luckydraw_id) {
  return req.get(`/promotion/luckydraw/winning/${luckydraw_id}`)
}

export function pointCheckLucky (luckydraw_id) {
  return req.get(`/promotion/luckydraw/checkwinning/${luckydraw_id}`)
}

export function pointComputeResult (luckydraw_id) {
  return req.get(`/promotion/luckydraw/luckylogic/${luckydraw_id}`)
}

export function storeFav (id) {
  return req.post(`/member/collect/distribution/${id}`)
}

export function storeFavDel (id) {
  return req.delete('/member/collect/distribution', {distributor_id: id})
}

export function storeFavList () {
  return req.get('/member/collect/distribution')
}

export function storeFavCount (params = {}) {
  return req.get('/member/collect/distribution/num', params)
}

export function storeIsFav (id) {
  return req.get('/member/collect/distribution/check', {distributor_id: id})
}

export function receiveVip () {
  return req.get('/promotion/getMemberCard')
}

// 获取导购信息
export function getSalesperson (params = {}) {
  return req.get('/salesperson', params)
}

// 获取导购投诉列表
export function getComplaintsList (params = {}) {
  return req.get('/salesperson/complaintsList', params)
}

// 导购投诉
export function setComplaints (params = {}) {
  return req.post('/salesperson/complaints', params)
}

// 获取导购投诉详情
export function getComplaintsDetail (id,params = {}) {
  return req.get(`/salesperson/complaintsDetail/${id}`, params)
}

// 获取导购
export function getUsersalespersonrel (params = {}) {
  return req.get('/usersalespersonrel', params)
}

// 绑定导购
export function setUsersalespersonrel (params = {}) {
  return req.post('/usersalespersonrel', params)
}

// 获取积分列表
export function getPointList (params = {}) {
  return req.get('/member/pointLogList', params)
}


//
export function getSalespersonNologin (params = {}) {
  return req.get('/salesperson/nologin', params)
}

//
export function getUserNewGetCardDetail (params = {}) {
  return req.get('/user/newGetCardDetail', params)
}
// 经销商入驻申请
export function hfpayApplySave (params = {}) {
  return req.post('/hfpay/applysave', params)
}
// 经销商入驻详情
export function hfpayUserApply (params = {}) {
  return req.get('/hfpay/userapply', params)
}
// 绑定银行卡
export function hfpayBankSave (params = {}) {
  return req.post('/hfpay/banksave', params)
}
// 获取绑定银行卡
export function hfpayBankInfo (params = {}) {
  return req.get('/hfpay/bankinfo', params)
}
// 获取获取支付方式
export function getTradePaymentList (params = {}) {
  return req.get('/trade/payment/list', params)
}

//获取是否开启获取crm地址
export function getCrmsetting () {
  return req.get('/member/crmsetting')
}