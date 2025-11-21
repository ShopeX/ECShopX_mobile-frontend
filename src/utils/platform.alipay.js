/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { getCurrentInstance } from '@tarojs/taro'

export function setPageTitle(title) {
  Taro.setNavigationBarTitle({
    title
  })
}

export const platformTemplateName = 'yykweishop'

export const transformPlatformUrl = (url) => {
  return `/alipay${url}`
}

export function dealTextAreaValue(value) {
  return value
}

export const payment_platform = 'alipaymini'
