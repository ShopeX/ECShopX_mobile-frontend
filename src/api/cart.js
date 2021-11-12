import req from './req'
import { getDistributorId } from '@/utils/helper'

export function get (params) {
  return req.get('/cart/list', params)
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

export function fastBuy (params, isPointitem) {
  const { item_id, num = 1, bargain_id, distributor_id } = params
  const query = {
    cart_type: 'fastbuy',
    item_id,
    num,
    distributor_id,
    isAccumulate: false,
    shop_type: isPointitem ? 'pointsmall' : 'distributor'
  }
  if (bargain_id) {
    query.bargain_id = bargain_id
  }
  return req.post('/cart', query)
}

export function del ({ cart_id }) {
  return req.delete('/cartdel', { cart_id })
}

export function select ({ cart_id, is_checked }) {
  return req.put('/cartupdate/checkstatus', { cart_id, is_checked })
}

export function updateNum (shop_id, cart_id, num, shop_type) {
  return req.put(`/cartupdate/num`, {
    shop_id,
    cart_id,
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
  const distributor_id = getDistributorId()

  return req.get('/promotions/recommendlike', {
    distributor_id,
    ...params
  })
}

export function selectedPlusitem (params) {
  return req.post('/cart/check/plusitem', params)
}

// 消息通知
export function getCartRemind (params) {
  return req.get('/cartremind/setting', params)
}

// 兑换商品
export function exchangeGood (params) {
  return req.post('user/exchangeCard', params)
}
