import req from './req'

export function list (params) {
  // return req.get('/trade.list', params)
  return req.get('/orders', params)
}

export function detail (tid) {
  // return req.get('/trade.get', { tid })
  return req.get(`/order/${tid}`)
}

export function create (data) {
  // return req.post('/trade.create', data)
  return req.post('/order_new', data)
}

export function confirm (tid) {
  return req.get('/trade.confirm', { tid })
}

export function cancel (data) {
  return req.post('/order/cancel', data)
}

export function getCount (params = { order_type: 'normal' }) {
  return req.get('/orderscount', params)
}
