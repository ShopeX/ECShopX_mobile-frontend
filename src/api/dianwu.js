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
export function getCartDataList() {
  return req.get('/operator/cartdatalist')
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
