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
import Taro from '@tarojs/taro'
import { getAppId } from '@/utils'
import req from './req'

const useauth = {
  auth_type: 'alipayapp',
  user_type: 'alipay'
}

/**支付宝自动登录 */
export function login(params) {
  return req.post('/alipay/login', {
    ...params,
    ...useauth,
    appid: getAppId()
  })
}
/**支付宝手动登录（注册） */
export function newlogin(params) {
  return req.post('/alipay/new_login', {
    ...params,
    ...useauth,
    appid: getAppId()
  })
}

export function alipay_login(params) {
  return req.post(`/new_login`, {
    ...params
  })
}

export function alipay_qrcode(params) {
  return req.get(`/alipaymini/qrcode.png?${params}`)
}
