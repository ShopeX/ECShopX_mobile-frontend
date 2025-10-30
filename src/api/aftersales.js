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
  return req.get('/aftersales', params)
}

export function info(params) {
  return req.get('/aftersales/info', params)
}

export function apply(params) {
  return req.post('/aftersales', params)
}

export function modify(params) {
  return req.post('/aftersales/modify', params)
}

export function sendback(params) {
  return req.post('/aftersales/sendback', params)
}

export function close(params) {
  return req.post('/aftersales/close', params)
}

export function reasonList(params = {}) {
  return req.get('/aftersales/reason/list', params)
}
export function remindDetail(params = {}) {
  return req.get('/aftersales/remind/detail', params)
}

/**
 * @param {*} params
 * distributor_id 下单门店
 * lng 经度
 * lat 纬度
 * @returns
 */
export function getAfterSaleStoreList(params) {
  return req.get('/distributor/aftersaleslocation', params)
}
