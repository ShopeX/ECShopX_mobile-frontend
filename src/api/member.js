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

