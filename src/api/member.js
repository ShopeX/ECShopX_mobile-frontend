import req from './req'

export function pointDetail () {
  return req.get('/member.point.detail')
}

export function couponList (params = {}) {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/user/newGetCardList', params)
}

export function addressList () {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/addresslist')
}

export function addressCreate (params = {}) {
  return req.post('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/address', params)
}

export function addressUpdate (data) {
  return req.put(`http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/address/${data.address_id}`,data)
}

export function addressDelete (address_id) {
  return req.delete(`http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/address/${address_id}`)
}

export function areaList () {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/member/addressarea')
}

export function addressCreateOrUpdate (data) {
  const fn = data.address_id ? addressUpdate : addressCreate
  return fn(data)
}

export function favoriteItems () {
  return req.get('/member.favorite.item.list')
}

export function getRechargeNumber () {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/weapp/deposit/rechargerules')
}

export function qrcodeData () {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/promoter/qrcode')
}

export function h5_qrcodeData () {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/brokerage/qrcode')
}

export function pointList (params = {}) {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/point/member', params)
}

export function pointTotal () {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/point/member/info')
}

export function depositList (params = {}) {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/weapp/deposit/list', params)
}

export function depositTotal () {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/weapp/deposit/info')
}

export function recommendUserInfo () {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/promoter/info')
}

export function recommendIndexInfo () {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/promoter/index')
}

export function recommendMember (params = {}) {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/promoter/children', params)
}

export function recommendOrder (params = {}) {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/promoter/brokerages', params)
}

export function depositToPoint (params = {}) {
  return req.post('http://pjj.aixue7.com/index.php/api/h5app/weapp/deposit/to/point', params)
}

export function pointDraw (params = {}) {
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/promotion/luckydraw', params)
}
