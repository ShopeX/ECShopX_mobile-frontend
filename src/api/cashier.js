import req from './req'

export function getOrderDetail (order_id) {
  return req.get(`/order_new/${order_id}`)
}

export function getPayment (params = {}) {
  // TODO: openid获取
  params = {
    ...params,
    open_id: 'olp694lNHedXSGa3HPrqj6nPILOU'
  }
  return req.post('/payment', params)
}
