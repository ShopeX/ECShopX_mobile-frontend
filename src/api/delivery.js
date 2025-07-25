import req from './req'

// 配送员首页统计
export function datacubeDeliverystaffdata(params = {}) {
  return req.get('/datacube/Deliverystaffdata', params)
}

// 配送员店铺列表
export function getDistributorList(params = {}) {
  return req.get('/selfdelivery/getDistributorList', params)
}

// 配送员店铺列表
export function datacubeDeliverystaffdataDetail(params = {}) {
  return req.get('/datacube/DeliverystaffdataDetail', params)
}

// 配送员我的
export function selfdeliveryList(params = {}) {
  return req.get('/selfdelivery/list', params)
}

//打包
export function deliverypackagConfirm(params) {
  return req.post('/order/deliverypackag/confirm', params)
}

//取消配送
export function cancelDeliverystaff(params) {
  return req.post('/order/cancel/deliverystaff', params)
}

//发货
export function orderDelivery(params) {
  return req.post('/order/delivery', params)
}

//更新配送状态
export function orderUpdateDelivery(delivery_id, params) {
  return req.post(`/order/updateDelivery/${delivery_id}`, params)
}

//购物车批量删除
export function cartdelbat(params) {
  return req.delete('/cartdelbat', params)
}
