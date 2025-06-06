import React, { useEffect } from 'react'
import { entryLaunch } from '@/utils'
import Taro from '@tarojs/taro'
import {
  SpPage,
} from '@/components'
import { SG_ROUTER_PARAMS } from '@/consts'

/**
 * 
 * path 页面路径（必穿参数）（参数格式 path=/pages/indes）
 * 其余参数会自动携带到path后面，不用手动处理
 * scene=uid%3D884%26id%3D121%26qr%3DY%26path%3D%2Fsubpages%2Fprescription%2Fprescription-information(页面参数，可供验证)
 * @returns 
 */
function ShareIand() {

  useEffect(() => {
    fetch()
  }, [])


  const fetch = async () => {
    // const storedData = Taro.getStorageSync(SG_ROUTER_PARAMS)
    const routeParams = await entryLaunch.getRouteParams()
    let { path, ...queryParams } = routeParams;

    //可以处理特殊情况
    if(queryParams.t == 1){
      path = '/subpages/prescription/prescription-information'
      queryParams.order_id = queryParams.oi
      queryParams.prescription_order_random = queryParams.r
      delete queryParams.oi  //order_id   
      delete queryParams.r   //rd   随机默认参数
      delete queryParams.t   //type  1是处方药
    }

    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    Taro.redirectTo({ url: `${path}?${queryString}` })
  }


  return (
    <SpPage className='page-share-land'>

    </SpPage>
  )
}

export default ShareIand
