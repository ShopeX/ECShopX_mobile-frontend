/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { getExtConfigData, isAlipay } from '@/utils'

/* 获取小程序 */
export const getAppId = () => {
  const { appid } = getExtConfigData()

  return appid
}

export const createIntersectionObserver = Taro.createIntersectionObserver

// export const copy = isWeixin
//   ? text => Taro.setClipboardData({ data: text })
//   : text => {
//       console.log("alipay支付成功");
//       my.setClipboard({
//         text,
//         success: e => console.log("粘贴成功", e),
//         fail: e => console.log("粘贴失败", e)
//       });
//     };

//平台支付
export async function payPlatform(order = {}) {
  let payRes
  let payErr = null
  if (isAlipay) {
    payRes = await my.tradePay({ tradeNO: order.trade_no })
    if (!payRes.result) {
      Taro.showToast({
        title: '用户取消支付',
        icon: 'none'
      })

      payErr = '用户取消支付'
    }
  } else {
    payRes = await Taro.requestPayment(order)
  }
  return {
    payRes,
    payErr
  }
}

// //平台模版名称
export const platformTemplateName = isAlipay ? 'onexshop' : 'yykweishop'

//平台添加字段
export const payTypeField = isAlipay ? { page_type: 'alipay' } : {}

export const transformPlatformUrl = (url) => {
  console.log('---transformPlatformUrl---', url, isWeixin)
  return isWeixin ? url.replace('/alipay', '') : url
}
