import Taro from '@tarojs/taro'

export function setPageTitle(title) {
  Taro.setNavigationBarTitle({
    title
  })
}

export const platformTemplateName = 'yykweishop'

export const transformPlatformUrl = (url) => {
  return url
}

//支付方式平台
export const payment_platform='wxMiniProgram';