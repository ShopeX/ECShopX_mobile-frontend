import req from './req-dianwu'

export function goodsItems(params) {
  return req.get('/goods/items/onsale', params)
}

// 商品加入收银台
export function addToCart(params) {
  return req.post('/operator/cartdataadd', params)
}

// 扫码加入收银台
export function scanAddToCart(params) {
  return req.post('/operator/scancodeAddcart', params)
}

// 收银台数据查询
export function getCartDataList(params) {
  return req.get('/operator/cartdatalist', params)
}

// 收银台更新
export function updateCartData(params) {
  return req.post('/operator/cartdataupdate', params)
}

// 删除收银台商品
export function deleteCartData(cart_id) {
  return req.delete(`/operator/cartdatadel?cart_id=${cart_id}`)
}

// 会员查询接口
export function getMembers(params) {
  return req.get('/members', params)
}

// 会员创建
export function createMember(params) {
  return req.post('/member', params)
}

// 收银台结算
export function checkout(params) {
  return req.post('/checkout', params)
}

// 订单创建
export function createOrder(params) {
  return req.post('/order/create', params)
}

// 支付
export function orderPayment(params) {
  return req.post('/order/payment', params)
}

// 支付结果查询
export function getPaymentResultByOrder(params) {
  return req.get('/order/payment/query', params)
}

// 订单详情
export function getTradeDetail(order_id) {
  return req.get(`/order/${order_id}`)
}

// 根据userid查询会员
export function getMemberByUserId(params) {
  return req.get(`/member`, params)
}

// 获取优惠券
export function getUserCardList(params) {
  return req.get('/getUserCardList', params)
}

// 挂单
export function orderPendding(params) {
  return req.post('/operator/cartdata/pending', params)
}

// 取单
export function fetchPendding(params) {
  return req.post('/operator/pending/fetch', params)
}

// 挂单列表
export function penddingList(params) {
  return req.get('/operator/pending/list', params)
}

// 删除挂单
export function penddingDelete(params) {
  return req.delete('/operator/pending/delete', params)
}
