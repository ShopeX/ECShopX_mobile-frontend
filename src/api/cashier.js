import req from './req'

export function getOrderDetail (order_id) {
  return req.get(`/order/${order_id}`)
}

export function getPayment (params = {}) {
  // params = {
  //   ...params,
  //   open_id: 'olp694lNHedXSGa3HPrqj6nPILOU'
  // }
  return req.post('/payment', params)
}

export function getWeappUrlLink(params = {}) {
 return req.post('/urllink', params)
}

export function getWeappUrlSchema(params = {}) {
  return req.post('/urlschema', params)
 }


