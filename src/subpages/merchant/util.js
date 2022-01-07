import Taro from '@tarojs/taro'
import { MERCHANT_TYPE, BUSINESS_SCOPE, BANG_NAME } from './consts'
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
      [BUSINESS_SCOPE]: S.get(BUSINESS_SCOPE, true),
      [BANG_NAME]: S.get(BANG_NAME, true)
    }
  }
  return S.get(key, true)
}

//清除merchant缓存相关字段
export function clearMerchant () {
  S.delete(MERCHANT_TYPE, true)
  S.delete(BUSINESS_SCOPE, true)
  S.delete(BANG_NAME, true)
}

//截取高亮字符串方法
//使用indexOf找到是否存在关键字，找到关键字之后进行存储，将带有关键字的部分全部删掉，继续匹配，直到匹配结束
export function splitMatch (label, keyword) {
  let matchingKeys = []
  let isHasRepeat = true
  while (isHasRepeat) {
    let position = label.indexOf(keyword)
    if (position == -1) {
      isHasRepeat = false
      //未找到关键词
      matchingKeys.push({ label: label.substring(0, label.length) })
    } else {
      //匹配位置+关键字长度
      let matchEnd = position + keyword.length
      //非匹配中的关键字
      matchingKeys.push({ label: label.substring(0, position) })
      //匹配中的关键字
      matchingKeys.push({ label: label.substring(position, matchEnd), checked: true })
      //去掉匹配的文字。重新进行筛选
      label = label.substring(matchEnd, label.length)
      //匹配到了末尾 不能继续批评
      if (!label && label.length < 1) {
        isHasRepeat = false
      }
    }
  }
  return matchingKeys
}
