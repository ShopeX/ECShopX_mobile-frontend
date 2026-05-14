/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { SpPage, SpScrollView } from '@/components'
import { SpTagBar } from '@/subpages/components'
import { useTranslation, $t } from '@/i18n'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompTradeItem from './comps/comp-tradeitem'
import './list.scss'

const initialState = {
  status: '0',
  tradeList: [],
  refresherTriggered: false
}

function TradeList(props) {
  useTranslation()
  const tradeStatus = useMemo(
    () => [
      { tag_name: $t('11f15792.dbb4d8'), value: '0' },
      { tag_name: $t('11f15792.9246fe'), value: '5' },
      { tag_name: $t('11f15792.4933ca'), value: '1' },
      {
        tag_name: $t('11f15792.fad522'),
        value: '7',
        is_rate: 0
      }
    ],
    []
  )

  const [state, setState] = useImmer(initialState)
  const { status, tradeList, refresherTriggered } = state
  const tradeRef = useRef()
  const router = useRouter()

  useDidShow(() => {
    Taro.setNavigationBarTitle({
      title: $t('b1d321d6.a73872')
    })
  })

  useEffect(() => {
    const { status = 0 } = router?.params
    setState((draft) => {
      draft.status = String(status)
    })

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
  }, [status])

  const fetch = async ({ pageIndex, pageSize }) => {
    const { is_rate } = tradeStatus.find((item) => item.value == status)
    const { userId } = Taro.getStorageSync('userinfo')
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status,
      is_rate,
      isSalesmanPage: 1,
      promoter_user_id: userId
    }
    const {
      list,
      pager: { count: total },
      rate_status
    } = await api.trade.list(params)
    const tempList = pickBy(list, doc.trade.TRADE_ITEM)
    setState((draft) => {
      draft.tradeList = [...tradeList, ...tempList]
      draft.refresherTriggered = false
    })
    return { total }
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
    <SpPage scrollToTopBtn className='page-trade-list'>
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
          emptyMsg={$t('11f15792.082a19')}
        >
          {tradeList.map((item, index) => (
            <View className='trade-item-wrap' key={index}>
              <CompTradeItem info={item} />
            </View>
          ))}
        </SpScrollView>
      </ScrollView>
    </SpPage>
  )
}

TradeList.options = {
  addGlobalClass: true
}

export default TradeList
