/*
 * @Author: your name
 * @Date: 2021-02-25 14:40:11
 * @LastEditTime: 2021-02-25 19:27:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/ecshopx-vshop/src/api/pointitem.js
 */
import req from './req'

export function search (params = {}) {
  // return req.get('/item.search', params)
  return req.get('/pointsmall/goods/items', params)
}
//获取积分配置
export function getPointSetting (params = {}) {
  // return req.get('/item.search', params)
  return req.get('/point/rule', params)
}

//获取商城配置
export function getPointitemSetting (params = {}) {
  // return req.get('/item.search', params)
  return req.get('/pointsmall/setting', params)
}
//获取分类
export function getPointitemCategory (params = {}) {
  // return req.get('/item.search', params)
  return req.get('/pointsmall/goods/category', params)
}

//获取我的积分
export function getMypoint (params = {}) {
  // return req.get('/item.search', params)
  return req.get('/point/member/info', params)
}

//商品详情
export function detail (item_id, params = {}) {
  return req.get(`/pointsmall/goods/items/${item_id}`, params)
}
//猜你喜欢
export function likeList (params) {
  return req.get(`/pointsmall/lovely/goods/items`, params)
}
