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

// 大转盘获取
export function getTurntableconfig(params) {
  return req.get('/promotion/turntableconfig', params)
}

export function getTurntable(params = {}) {
  return req.get('/promotion/turntable', params)
}

// 登陆赠送抽奖次数
export function getLoginaddtimes(params = {}) {
  return req.get('/promotion/loginaddtimes', params)
}
