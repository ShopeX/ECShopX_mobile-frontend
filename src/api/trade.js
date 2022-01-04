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
  return req.post('/order', data)
}

export function confirm (tid) {
  return req.post('/order/confirmReceipt', { order_id: tid })
}

export function cancel (data) {
  return req.post('/order/cancel', data)
}

export function getCount (params = { order_type: 'normal' }) {
  return req.get('/orderscount', params)
}

export function deliveryInfo (order_type, order_id) {
  return req.get(`/trackerpull?order_type=${order_type}&order_id=${order_id}`)
}
export function deliveryInfoNew (params) {
  return req.get(`/delivery/trackerpull`, params)
}
export function tradeQuery (trade_id) {
  return req.get(`/tradequery`, { trade_id })
}

export function imgUpload (params = {}) {
  return req.get(`/espier/upload`, params)
}

export function involiceList (params = {}) {
  return req.get(`/orders/invoice`, params)
}

export function zitiCode (params = {}) {
  return req.get(`/ziticode`, params)
}

export function createOrderRate (params = {}) {
  return req.post(`/order/rate/create`, params)
}

export function h5create (data) {
  return req.post('/order_new', data)
}
export function tradeSetting (data) {
  return req.get('/trade/setting', data)
}

export function deliveryLists (data) {
  return req.get('/delivery/lists', data)
}

// 发送验证码
export function sendCode (orderId) {
  return req.get(`/pickupcode/${orderId}`)
}

// 绑定订单
export function bindOrder (data) {
  return req.post(`/order/bind/${data.order_id}`, data)
}
