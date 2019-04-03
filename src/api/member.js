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

export function couponList (params = {}) {
  return req.get('/user/newGetCardList', params)
}

export function homeCouponList (params = {}) {
  return req.get('/getCardList', params)
}

export function homeCouponGet (params = {}) {
  return req.get('/user/receiveCard', params)
}

export function addressList () {
  return req.get('/member/addresslist')
}

export function addressCreate (params = {}) {
  return req.post('/member/address', params)
}

export function addressUpdate (data) {
  return req.put(`/member/address/${data.address_id}`,data)
}

export function addressDelete (address_id) {
  return req.delete(`/member/address/${address_id}`)
}

export function areaList () {
  return req.get('/member/addressarea')
}

export function addressCreateOrUpdate (data) {
  const fn = data.address_id ? addressUpdate : addressCreate
  return fn(data)
}

export function favoriteItems () {
  return req.get('/member.favorite.item.list')
}

export function getRechargeNumber () {
  return req.get('/deposit/rechargerules')
}

export function qrcodeData () {
  return req.get('/promoter/qrcode')
}

export function promoter () {
  return req.post('/promoter')
}

export function h5_qrcodeData () {
  return req.get('/brokerage/qrcode')
}

export function pointList (params = {}) {
  return req.get('/point/member', params)
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
