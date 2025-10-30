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

export function list(params) {
  // return req.get('/trade.list', params)
  return req.get('/orders', params)
}

export function detail(tid, params) {
  // return req.get('/trade.get', { tid })
  return req.get(`/order/${tid}`, params)
}

export function create(data) {
  // return req.post('/trade.create', data)
  return req.post('/order', data)
}

export function confirm(tid) {
  return req.post('/order/confirmReceipt', { order_id: tid })
}

export function cancel(data) {
  return req.post('/order/cancel', data)
}

export function getCount(params = { order_type: 'normal' }) {
  return req.get('/orderscount', params)
}

export function deliveryInfo(order_type, order_id) {
  return req.get(`/trackerpull?order_type=${order_type}&order_id=${order_id}`)
}
export function deliveryInfoNew(params) {
  return req.get(`/delivery/trackerpull`, params)
}

export function getTrackerpull(params) {
  return req.get(`/trackerpull`, params)
}

export function tradeQuery(trade_id) {
  return req.get(`/tradequery`, { trade_id })
}

export function imgUpload(params = {}) {
  return req.get(`/espier/upload`, params)
}

export function involiceList(params = {}) {
  return req.get(`/orders/invoice`, params)
}

export function zitiCode(params = {}) {
  return req.get(`/ziticode`, params)
}

export function createOrderRate(params = {}) {
  return req.post(`/order/rate/create`, params)
}

export function h5create(data) {
  return req.post('/order_new', data)
}
export function tradeSetting(data) {
  return req.get('/trade/setting', data)
}

export function deliveryLists(data) {
  return req.get('/delivery/lists', data)
}

// 发送验证码
export function sendCode(orderId) {
  return req.get(`/pickupcode/${orderId}`)
}

// 绑定订单
export function bindOrder(data) {
  return req.post(`/order/bind/${data.order_id}`, data)
}

export function getAackaccountList() {
  return req.get('/order/offline/backaccount')
}

//上传线下转账凭证
export function uploadVoucher(data) {
  return req.post(`/order/offline/upload/voucher`, data)
}

//更新线下转账凭证
export function updateVoucher(data) {
  return req.post(`/order/offline/update/voucher`, data)
}

//获取线下转账凭证
export function getVoucher(data) {
  return req.get(`/order/offline/get/voucher`, data)
}

// 申请发票
export function applyInvoice(data) {
  return req.post(`/order/invoice/apply`, data)
}

// 修改发票
export function updateInvoice(data) {
  return req.post(`/order/invoice/update`, data)
}

// 获取用户发票详情
export function getInvoiceDetail(id) {
  return req.get(`/order/invoice/info/${id}`)
}

// 重发发票到邮箱
export function resendInvoice(data) {
  return req.post(`/order/invoice/resend`, data)
}

// 获取发票设置
export function getInvoiceSetting() {
  return req.get(`/order/invoice/setting`)
}

// 获取发票协议
export function getInvoiceProtocol() {
  return req.get(`/order/invoice/protocol`)
}
