import req from './req'

export function get (params) {
  return req.get('/cart', params)
}

export function count (params) {
  const { shop_type = 'distributor' } = params
  return req.get('/cartcount', {
    shop_type,
    ...params
  })
}

export function add (params) {
  return req.post(`/cart`, params)
}

export function fastBuy (params) {
  const { item_id, num = 1 } = params
  return req.post('/cart', {
    cart_type: 'fastbuy',
    item_id,
    num,
    isAccumulate: false,
    shop_type: 'distributor'
  })
}

export function del ({ cart_id }) {
  return req.delete('/cartdel', { cart_id })
}

export function select ({ cart_id, is_checked }) {
  return req.put('/cartupdate/checkstatus', { cart_id, is_checked })
}

export function updateNum (item_id, num, shop_type) {
  return req.post(`/cart`, {
    item_id,
    num,
    isAccumulate: false,
    shop_type
  })

  // return req.put('/cartupdate/num', { cart_id, num })
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

export function likeList (params) {
  return req.get('/promotions/recommendlike', params)
}
