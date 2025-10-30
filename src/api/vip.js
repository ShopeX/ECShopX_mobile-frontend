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

export function getList(params) {
  return req.get('/vipgrades/newlist', params)
}

export function charge(params) {
  return req.post('/vipgrades/buy', params)
}

export function getUserVipInfo(params) {
  return req.get('/vipgrades/uservip', params)
}

/** 券包api */
export function getBindCardList(params) {
  return req.get('/user/getBindCardList', params)
}

export function getShowCardPackage(params) {
  return req.get('/user/showCardPackage', params)
}

export function getReceiveCardPackage(params) {
  return req.post('/user/receiveCardPackage', params)
}

export function getCurrentGradList() {
  return req.post('/user/currentGardCardPackage')
}

// export function getMemberCard(){
//   return req.get('/membercard')
// }
