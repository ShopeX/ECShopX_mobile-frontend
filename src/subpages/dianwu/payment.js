import React, { useEffect } from 'react'
import { entryLaunch, showToast } from '@/utils'
import Taro from '@tarojs/taro'
import {
    SpPage,
} from '@/components'
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
                    Taro.redirectTo({ url: `/subpages/dianwu/index?order_id=${order_id}&path=/pages/order/detail` })
                }, 3000)
            }
        } else {
            showToast(errMsg)

        }
    }


    return (
        <SpPage className='page-share-land'>
        </SpPage>
    )
}

export default Payment
