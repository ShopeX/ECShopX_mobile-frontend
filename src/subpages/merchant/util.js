import Taro from '@tarojs/taro'
import { MERCHANT_TYPE, BUSINESS_SCOPE } from './consts'
import S from '@/spx'

//跳转到入驻协议
export function navigateToAgreement () {
  const url = `/subpages/merchant/agreement`
  Taro.navigateTo({
    url
  })
}

//存储merchant相关字段信息
export function setMerchant ({ key, id, name, parent_id }) {
  S.set(key, { id, name, parent_id }, true)
}

//获取merchant存储相关字段
export function getMerchant (key) {
  if (!key) {
    return {
      [MERCHANT_TYPE]: S.get(MERCHANT_TYPE, true),
      [BUSINESS_SCOPE]: S.get(BUSINESS_SCOPE, true)
    }
  }
  return S.get(key, true)
}

//清除merchant缓存相关字段
export function clearMerchant () {
  S.delete(MERCHANT_TYPE, true)
  S.delete(BUSINESS_SCOPE, true)
}
