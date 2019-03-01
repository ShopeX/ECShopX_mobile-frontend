import req from './req'

export function pointDetail () {
  return req.get('/member.point.detail')
}

export function couponList (tid) {
  return req.get('/member.coupon.list', { tid })
}

export function addressList () {
  return req.get('/member.address.list')
}

export function addressCreate (data) {
  return req.post('/member.address.create', data)
}

export function addressUpdate (data) {
  return req.post('/member.address.update', data)
}

export function addressDelete (addr_id) {
  return req.post('/member.address.delete', { addr_id })
}

export function addressCreateOrUpdate (data) {
  const fn = data.addr_id ? addressUpdate : addressCreate
  return fn(data)
}

export function favoriteItems () {
  return req.get('/member.favorite.item.list')
}

export function getRechargeNumber () {
  return req.get('http://pjj.aixue7.com/index.php/api/weapp/deposit/rechargerules')
}
