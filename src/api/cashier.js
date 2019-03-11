import req from './req'

export function getOrderDetail (order_id) {
  return req.get(`http://pjj.aixue7.com/index.php/api/h5app/wxapp/order/${order_id}`)
}

export function getPayment (parmas = {}) {
  return req.post('http://pjj.aixue7.com/index.php/api/h5app/wxapp/payment', parmas)
}

