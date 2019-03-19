import req from './req'

export function get (params) {
  // return req.get('/cart.get')
  return req.get('/cart', {
    shop_type: 'distributor',
    ...params
  })
}

export function getBasic (params) {
  // return req.get('/cart.get.basic')
  return req.get('/cart', {
    shop_type: 'distributor',
    ...params
  })
}

export function add (item, num = 1) {
  // return req.post('/cart.add', { sku_id, quantity })
  const { item_id, shop_id } = item
  return req.post(`/cart`, {
    item_id,
    shop_id,
    num,
    shop_type: 'distributor'
  })
}

export function update ({ cart_params }) {
  return req.post('/cart.update', { cart_params })
}

export function del ({ cart_id }) {
  return req.post('/cart.del', { cart_id })
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
