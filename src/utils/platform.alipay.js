import Taro from '@tarojs/taro'

export function setPageTitle (title) {
  Taro.setNavigationBarTitle({
    title
  })
}

export const platformTemplateName = 'yykweishop'

export const transformPlatformUrl = (url) => {
  return `/alipay${url}`
}
