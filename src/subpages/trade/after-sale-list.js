/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Taro, { useRouter } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpPage, SpTagBar, SpScrollView, SpSearchBar } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompAfterTradeItem from './comps/comp-aftertrade-item'
import CompTrackType from './comps/comp-trade-type'
import './after-sale-list.scss'

const initialState = {
  tradeStatus: [
    { tag_name: '待处理', value: '0' },
    { tag_name: '处理中', value: '1' },
    { tag_name: '已处理', value: '2' },
    { tag_name: '已驳回', value: '3' },
    { tag_name: '已关闭', value: '4' }
  ],
  status: '0',
  typeVal: '0',
  tradeList: [],
  refresherTriggered: false,
  order_id: '',
  selectAftersn: []
}
function TradeAfterSaleList(props) {
  const [state, setState] = useImmer(initialState)
  const { tradeStatus, status, tradeList, refresherTriggered, typeVal, order_id, selectAftersn } =
    state
  const tradeRef = useRef()

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
      draft.selectAftersn = []
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

  const onSelect = (sn) => {
    let list = [...selectAftersn]
    const index = list.indexOf(sn)
    if (index > -1) {
      list.splice(index, 1)
    } else {
      list.push(sn)
    }
    setState((draft) => {
      draft.selectAftersn = list
    })
  }

  const onSubmit = () => {
    console.log(tradeList, selectAftersn)
    const fliterList = tradeList?.filter(
      (item) => selectAftersn.includes(item.aftersalesBn) && item.aftersalesAddress
    )
    debugger
    const address = fliterList[0].aftersalesAddress
    Taro.setStorageSync('moreAftersalesBn', {
      aftersalesBn: selectAftersn,
      address
    })
    Taro.navigateTo({ url: `/subpages/trade/logistics-info?type=more` })
  }

  const renderFooter = () => {
    if (status != '1') return null
    return (
      <View className='btn-wrap'>
        <AtButton circle type='primary' disabled={selectAftersn.length === 0} onClick={onSubmit}>
          批量处理
        </AtButton>
      </View>
    )
  }

  return (
    <SpPage className='page-trade-aftersale-list' renderFooter={renderFooter()}>
      <View className='search-bar-container'>
        <SpSearchBar
          keyword={order_id}
          placeholder='请输入订单号'
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
          emptyMsg='没有查询到售后单'
        >
          {tradeList.map((item, index) => (
            <View className='trade-item-wrap' key={index}>
              <CompAfterTradeItem
                info={item}
                selectAftersn={selectAftersn}
                isShowChecked={status == '1' && item.progress == 1}
                onSelect={onSelect}
              />
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
