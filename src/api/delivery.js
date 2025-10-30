// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
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
