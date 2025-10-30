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
import qs from 'qs'
import { SG_GUIDE_PARAMS, SG_ROUTER_PARAMS } from '@/consts'
import { isObject } from '@/utils'

export function requestIntercept() {
  const interceptor = (chain) => {
    let requestParams = chain.requestParams
    const { method, data, url } = requestParams
    // console.log('getCurrentInstance:', getCurrentInstance())
    if (isObject(getCurrentInstance().router)) {
      const { path } = getCurrentInstance()?.router
      // console.log('getCurrentInstance params:', path)
      if (
        path === '/pages/cart/espier-checkout' &&
        [
          `${process.env.APP_BASE_URL}/order_new`,
          `${process.env.APP_BASE_URL}/getFreightFee`
        ].indexOf(url) > -1
      ) {
        let smid = ''
        const { gu, gu_user_id, smid: smid_1 } = Taro.getStorageSync(SG_GUIDE_PARAMS) || {}
        const { smid: smid_2 } = Taro.getStorageSync(SG_ROUTER_PARAMS) || {}
        smid = smid_1 || smid_2

        let _data = qs.parse(data)
        let work_userid = gu_user_id
        if (gu) {
          work_userid = gu.split('_')[0]
        }
        _data['work_userid'] = work_userid
        if (smid) {
          _data['salesman_id'] = smid
        }
        if (_data) {
          requestParams.data = qs.stringify(_data)
        }
        console.log('requestIntercept:', requestParams)
      }
    }

    return chain.proceed(requestParams).then((res) => {
      // console.log(`http <-- ${url} request:`, res)
      return res
    })
  }
  Taro.addInterceptor(interceptor)
}
// export function requestIntercept() {
//   const hookMethods = ['request']
//   hookMethods.forEach((hook) => {
//     const originRequest = wx[hook]
//     console.log('Taro:', wx)
//     Object.defineProperty(wx, hook, {
//       writable: true,
//       enumerable: true,
//       configurable: true,
//       value:  (...args) => {
//         const options = args[0]
//         const { url, method } = options
//         console.log(`requestIntercept:`, options)
//         // 成功回调
//         const successHandler = (res) => {
//           console.log(`successHandler:`, res)
//           // return res
//         }
//         // 失败回调
//         const failHandler = () => {
//         }
//         const actOptions = {
//           ...options,
//           success: successHandler,
//           fail: failHandler
//         }
//         return originRequest.call(this, actOptions)
//       }
//     })
//   })
// }
