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
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Taro, { useRouter } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpPage, SpScrollView } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompTradeItem from './comps/comp-tradeitem'
import CompTrackType from './comps/comp-trade-type'
import './ziti-list.scss'

const initialState = {
  tradeList: [],
  refresherTriggered: false,
  typeVal: '0'
}
function TradeZitiList(props) {
  const [state, setState] = useImmer(initialState)
  const { tradeStatus, status, tradeList, refresherTriggered, typeVal } = state
  const tradeRef = useRef()
  const router = useRouter()

  useEffect(() => {
    Taro.eventCenter.on('onEventOrderStatusChange', () => {
      setState((draft) => {
        draft.tradeList = []
      })
      tradeRef.current.reset()
    })

    return () => {
      Taro.eventCenter.off('onEventOrderStatusChange')
    }
  }, [])

  useEffect(() => {
    setState((draft) => {
      draft.tradeList = []
    })
    tradeRef.current.reset()
  }, [typeVal])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status: 4 // 自提订单
    }
    params.order_class = typeVal == '1' ? 'employee_purchase' : 'normal'
    const {
      list,
      pager: { count: total },
      rate_status
    } = await api.trade.list(params)
    const tempList = pickBy(list, doc.trade.TRADE_ITEM)
    // console.log('tempList:', tempList)
    setState((draft) => {
      draft.tradeList = [...tradeList, ...tempList]
      draft.refresherTriggered = false
    })
    return { total }
  }

  const onRefresherRefresh = () => {
    setState((draft) => {
      draft.refresherTriggered = true
      draft.tradeList = []
    })

    tradeRef.current.reset()
  }

  const onChangeTradeType = (e) => {
    setState((draft) => {
      draft.typeVal = e
    })
  }

  return (
    <SpPage scrollToTopBtn className='page-trade-ziti-list'>
      <CompTrackType value={typeVal} onChange={onChangeTradeType} />
      <ScrollView
        className='list-scroll-container'
        scrollY
        refresherEnabled
        refresherBackground='#f5f5f7'
        refresherTriggered={refresherTriggered}
        onRefresherRefresh={onRefresherRefresh}
      >
        <SpScrollView
          className='trade-list-scroll'
          ref={tradeRef}
          auto={false}
          fetch={fetch}
          emptyMsg='没有查询到订单'
        >
          {tradeList.map((item) => (
            <View className='trade-item-wrap'>
              <CompTradeItem info={item} />
            </View>
          ))}
        </SpScrollView>
      </ScrollView>
    </SpPage>
  )
}

TradeZitiList.options = {
  addGlobalClass: true
}

TradeZitiList.defaultProps = {}

export default TradeZitiList
