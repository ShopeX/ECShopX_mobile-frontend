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
import React, { useEffect } from 'react'
import { entryLaunch, showToast } from '@/utils'
import Taro from '@tarojs/taro'
import { SpPage } from '@/components'
import api from '@/api'

import { SG_ROUTER_PARAMS } from '@/consts'

function Payment() {
  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    // const storedData = Taro.getStorageSync(SG_ROUTER_PARAMS)
    const { order_id } = await entryLaunch.getRouteParams()
    const { errMsg, result } = await Taro.scanCode()
    if (errMsg == 'scanCode:ok') {
      try {
        console.log(`handleClickScanCode:`, result)
        const { trade_info } = await api.dianwu.orderPayment({
          order_id,
          auth_code: result
        })
        Taro.redirectTo({
          url: `/subpages/dianwu/collection-result?order_id=${order_id}&trade_id=${trade_info.trade_id}`
        })
      } catch (error) {
        setTimeout(() => {
          // Taro.navigateBack()
          Taro.redirectTo({
            url: `/subpages/dianwu/index?order_id=${order_id}&path=/pages/order/detail`
          })
        }, 3000)
      }
    } else {
      showToast(errMsg)
    }
  }

  return <SpPage className='page-share-land'></SpPage>
}

export default Payment
