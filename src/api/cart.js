import req from './req'

export function get (params) {
  return req.get('/cart', {
    shop_type: 'distributor',
    ...params
  })
}

export function count (params) {
  return req.get('/cartcount', {
    shop_type: 'distributor',
    ...params
  })
}

export function add (item, num = 1, isAccumulate = false) {
  const { item_id } = item
  return req.post(`/cart`, {
    item_id,
    num,
    isAccumulate,
    shop_type: 'distributor'
  })
}

export function del ({ cart_id }) {
  return req.delete('/cartdel', { cart_id })
}

export function select ({ cart_id, is_checked }) {
  return req.put('/cartupdate/checkstatus', { cart_id, is_checked })
}

export function updateNum ({ cart_id, num }) {
  return req.put('/cartupdate/num', { cart_id, num })
}

export function updatePromotion ({ cart_id, activity_id }) {
  return req.put('/cartupdate/promotion', { cart_id, activity_id })
}

export function checkout () {
  return req.get('/cart.checkout')
}

export function total (params) {
  // return req.post('/cart.total')
  return req.post('/getFreightFee', params)
}

export function coupons (params) {
  return req.get('/user/newGetCardList', params)
}
