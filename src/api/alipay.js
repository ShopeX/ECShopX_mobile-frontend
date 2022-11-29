import Taro from '@tarojs/taro'
import req from './req'
import { getAppId } from '@/utils'

const useauth = {
  auth_type: 'alipayapp',
  user_type: 'alipay'
}

/**支付宝自动登录 */
export function login (params) {
  return req.post('/alipay/login', {
    ...params,
    ...useauth,
    appid: getAppId()
  })
}
/**支付宝手动登录（注册） */
export function newlogin (params) {
  return req.post('/alipay/new_login', {
    ...params,
    ...useauth,
    appid: getAppId()
  })
}

export function alipay_login (params) {
  return req.post(`/new_login`, {
    ...params
  })
}

export function alipay_qrcode (params) {
  return req.get(`/alipaymini/qrcode.png?${params}`)
}