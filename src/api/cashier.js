import req from './req'

export function getOrderDetail (order_id) {
  return req.get(`/order_new/${order_id}`)
}

export function getPayment (parmas = {}) {
  return req.post('/payment', parmas)
}
