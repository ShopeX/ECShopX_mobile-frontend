/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpPage, SpScrollView, SpSearchBar } from '@/components'
import { SpTagBar } from '@/subpages/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import { useTranslation, $t, i18n } from '@/i18n'
import { useNavigation } from '@/hooks'
import CompAfterTradeItem from './comps/comp-aftertrade-item'
import CompTrackType from './comps/comp-trade-type'
import './after-sale-list.scss'

const initialState = {
  status: '0',
  typeVal: '0',
  tradeList: [],
  refresherTriggered: false,
  order_id: ''
}
function TradeAfterSaleList(props) {
  useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const [state, setState] = useImmer(initialState)
  const { status, tradeList, refresherTriggered, typeVal, order_id } = state
  const tradeRef = useRef()
  const needRefreshRef = useRef(false)

  const refreshList = useCallback(() => {
    setState((draft) => {
      draft.tradeList = []
    })
    tradeRef.current?.reset()
  }, [setState])

  const tradeStatus = useMemo(
    () => [
      { tag_name: $t('b1e93f22.047109'), value: '0' },
      { tag_name: $t('b1e93f22.5d459d'), value: '1' },
      { tag_name: $t('b1e93f22.5ad605'), value: '2' },
      { tag_name: $t('b1e93f22.dbf36d'), value: '3' },
      { tag_name: $t('b1e93f22.9c5850'), value: '4' }
    ],
    [i18n.language]
  )

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('75114955.75bfab'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle])

  useEffect(() => {
    const handleRefresh = () => {
      needRefreshRef.current = true
    }
    // 撤销售后 / 填写物流回寄成功后刷新列表
    Taro.eventCenter.on('onEventAfterSalesCancel', handleRefresh)
    Taro.eventCenter.on('onEventAfterSalesSendback', handleRefresh)

    return () => {
      Taro.eventCenter.off('onEventAfterSalesCancel', handleRefresh)
      Taro.eventCenter.off('onEventAfterSalesSendback', handleRefresh)
    }
  }, [])

  useDidShow(() => {
    if (needRefreshRef.current) {
      needRefreshRef.current = false
      refreshList()
    }
  })

  useEffect(() => {
    setState((draft) => {
      draft.tradeList = []
    })
    tradeRef.current.reset()
  }, [status, typeVal])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      aftersales_status: status,
      order_id
    }
    // params.order_class = typeVal == '1' ? 'employee_purchase' : 'normal'
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

  const onChangeTradeType = (e) => {
    setState((draft) => {
      draft.typeVal = e
    })
  }

  const handleOnChange = (val) => {
    setState((v) => {
      v.order_id = val
    })
  }

  const handleOnClear = () => {
    setState((v) => {
      v.order_id = ''
      v.tradeList = []
    })
    tradeRef.current.reset()
  }

  const handleConfirm = async (val) => {
    setState((v) => {
      v.tradeList = []
      v.order_id = val
    })
    await tradeRef.current.reset()
  }

  return (
    <SpPage className='page-trade-aftersale-list'>
      <View className='search-bar-container'>
        <SpSearchBar
          keyword={order_id}
          placeholder={$t('b1e93f22.e9e836')}
          showDailog={false}
          onChange={handleOnChange}
          onClear={handleOnClear}
          onCancel={handleOnClear}
          onConfirm={handleConfirm}
        />
      </View>
      <CompTrackType value={typeVal} onChange={onChangeTradeType} />
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
          emptyMsg={$t('b1e93f22.8e0d26')}
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
