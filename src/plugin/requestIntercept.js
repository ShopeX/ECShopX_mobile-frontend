import Taro, { getCurrentInstance } from '@tarojs/taro'
import qs from 'qs'
import { SG_GUIDE_PARAMS } from '@/consts'
import { isObject } from '@/utils'

export function requestIntercept() {
  const interceptor = (chain) => {
    let requestParams = chain.requestParams
    const { method, data, url } = requestParams
    // console.log('getCurrentInstance:', getCurrentInstance())
    if (isObject(getCurrentInstance().router)) {
      const { path } = getCurrentInstance()?.router
      // console.log('getCurrentInstance params:', path)
      if (path === '/pages/cart/espier-checkout' && url === `${process.env.APP_BASE_URL}/order`) {
        const { gu, gu_user_id } = Taro.getStorageSync(SG_GUIDE_PARAMS) || {}
        let work_userid = gu_user_id
        if (gu) {
          work_userid = gu.split('_')[0]
        }
        if (work_userid) {
          const _data = qs.parse(data)
          _data['work_userid'] = work_userid
          requestParams.data = qs.stringify(_data)
        }
      }
    }
    // console.log('requestIntercept:', $instance)
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
//           debugger
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
