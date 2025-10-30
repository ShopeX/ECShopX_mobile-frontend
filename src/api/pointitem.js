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
/*
 * @Author: your name
 * @Date: 2021-02-25 14:40:11
 * @LastEditTime: 2021-02-25 19:27:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/ecshopx-vshop/src/api/pointitem.js
 */
import req from './req'

export function search(params = {}) {
  // return req.get('/item.search', params)
  return req.get('/pointsmall/goods/items', params)
}

//获取商城配置
export function getPointitemSetting(params = {}) {
  // return req.get('/item.search', params)
  return req.get('/pointsmall/setting', params)
}
//获取分类
export function getPointitemCategory(params = {}) {
  // return req.get('/item.search', params)
  return req.get('/pointsmall/goods/category', params)
}

//商品详情
export function detail(item_id, params = {}) {
  return req.get(`/pointsmall/goods/items/${item_id}`, params)
}
//猜你喜欢
export function likeList(params) {
  return req.get(`/pointsmall/lovely/goods/items`, params)
}

// 获取积分规则
export function getPointSetting(params = {}) {
  return req.get('/point/rule', params)
}

// 获取会员积分信息
export function getMypoint(params = {}) {
  return req.get('/point/member/info', params)
}

// 获取会员积分记录列表
export function getMemberPointList(params = {}) {
  return req.get('/point/member', params)
}
