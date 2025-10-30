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
