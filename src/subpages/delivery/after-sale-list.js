/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpPage, SpScrollView } from '@/components'
import { SpTagBar } from '@/subpages/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import CompAfterTradeItem from './comps/comp-aftertrade-item'
import './after-sale-list.scss'

const initialState = {
  status: '0',
  tradeList: [],
  refresherTriggered: false
}
function TradeAfterSaleList(props) {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { status, tradeList, refresherTriggered } = state
  const { deliveryPersonnel } = useSelector((state) => state.cart)
  const tradeRef = useRef()

  const tradeStatus = useMemo(
    () => [
      { tag_name: $t('5e73a6ff.047109'), value: '0' },
      { tag_name: $t('5e73a6ff.5d459d'), value: '1' },
      { tag_name: $t('5e73a6ff.5ad605'), value: '2' },
      { tag_name: $t('5e73a6ff.dbf36d'), value: '3' },
      { tag_name: $t('5e73a6ff.9c5850'), value: '4' }
    ],
    [i18n.language]
  )

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('5e73a6ff.75bfab') })
  }, [i18n.language])

  useEffect(() => {
    // 撤销售后事件
    Taro.eventCenter.on('onEventAfterSalesCancel', () => {
      setState((draft) => {
        draft.tradeList = []
      })
      tradeRef.current.reset()
    })

    return () => {
      Taro.eventCenter.off('onEventAfterSalesCancel')
    }
  }, [])

  useDidShow(() => {
    setState((draft) => {
      draft.tradeList = []
    })
    tradeRef.current.reset()
  })

  useEffect(() => {
    setState((draft) => {
      draft.tradeList = []
    })
    tradeRef.current.reset()
  }, [status])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      aftersales_status: status,
      ...deliveryPersonnel
    }
    const { list, total_count } = await api.aftersales.list(params)
    const tempList = pickBy(list, doc.trade.AFTER_TRADE)
    setState((draft) => {
      draft.tradeList = [...tradeList, ...tempList]
      draft.refresherTriggered = false
    })
    return { total: total_count }
  }

  const onChangeTradeState = (e) => {
    setState((draft) => {
      draft.status = tradeStatus[e].value
    })
  }

  const onRefresherRefresh = () => {
    setState((draft) => {
      draft.refresherTriggered = true
      draft.tradeList = []
    })

    tradeRef.current.reset()
  }

  return (
    <SpPage className='page-trade-aftersale-list'>
      <SpTagBar list={tradeStatus} value={status} onChange={onChangeTradeState} />
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
          auto={false}
          ref={tradeRef}
          fetch={fetch}
          emptyMsg={$t('5e73a6ff.8e0d26')}
        >
          {tradeList.map((item, index) => (
            <View className='trade-item-wrap' key={index}>
              <CompAfterTradeItem info={item} />
            </View>
          ))}
        </SpScrollView>
      </ScrollView>
    </SpPage>
  )
}

TradeAfterSaleList.options = {
  addGlobalClass: true
}

TradeAfterSaleList.defaultProps = {}

export default TradeAfterSaleList
