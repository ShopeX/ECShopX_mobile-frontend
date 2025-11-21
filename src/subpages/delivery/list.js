/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpImage, SpTradeItem, SpFloatLayout } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { AtButton } from 'taro-ui'
import { pickBy, showToast } from '@/utils'
import { DELIVERY_PERSONNEL_INFORMATION } from '@/consts'
import CompTradeItem from './comps/comp-tradeitem'
import CompShippingInformation from './comps/comp-shipping-information'
import btnHooks from './btn-hooks'

import './list.scss'

const initialState = {
  information: {},
  tradeStatus: [
    { tag_name: '全部订单', value: '' },
    { tag_name: '待打包', value: 'RECEIVEORDER' },
    { tag_name: '待发货', value: 'PACKAGED' },
    { tag_name: '配送中', value: 'DELIVERING' },
    { tag_name: '已送达', value: 'DONE', is_rate: 0 }
  ],
  status: '0',
  tradeList: [],
  refresherTriggered: false,
  statusDelivery: false,
  list: DELIVERY_PERSONNEL_INFORMATION()
}
function TradeList(props) {
  const [state, setState] = useImmer(initialState)
  const { tradeStatus, status, tradeList, refresherTriggered, statusDelivery, list, information } =
    state
  const { deliveryPersonnel } = useSelector((state) => state.cart)
  const tradeRef = useRef()
  const router = useRouter()
  const pageRef = useRef()

  const { popUpStatus, deliverySure } = btnHooks()

  useEffect(() => {
    const { status = '' } = router.params
    setState((draft) => {
      draft.status = status
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
    if (statusDelivery) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [statusDelivery])

  useEffect(() => {
    setState((draft) => {
      draft.tradeList = []
    })
    tradeRef.current.reset()
  }, [status])

  useDidShow(() => {
    setState((draft) => {
      draft.tradeList = []
    })
    tradeRef.current.reset()
  })

  const fetch = async ({ pageIndex, pageSize }) => {
    const { is_rate } = tradeStatus.find((item) => item.value == status)
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      self_delivery_status: status,
      is_rate,
      ...deliveryPersonnel
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

  //更新配送状态
  const updateDelivery = async (item) => {
    console.log(item, 'item')
    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })
    const { orderInfo, tradeInfo } = await api.trade.detail(item.orderId, { ...deliveryPersonnel })
    Taro.hideLoading()
    orderInfo.pay_date = tradeInfo.payDate
    orderInfo.trade_id = tradeInfo.tradeId
    const tempList = pickBy(orderInfo, doc.trade.TRADE_ITEM)
    setState((draft) => {
      draft.statusDelivery = true
      draft.information = tempList
    })
  }

  const updateDeliverySure = async () => {
    await deliverySure(information, list)
    setState((draft) => {
      draft.statusDelivery = false
      draft.tradeList = []
    })
    tradeRef.current.reset()
  }

  const deliveryItem = (item) => {
    setState((draft) => {
      draft.list = item
    })
    console.log(item, 'hhhhhhhh')
  }

  const butStatus = async (item, val) => {
    await popUpStatus(item, val)
    setState((draft) => {
      draft.tradeList = []
    })
    tradeRef.current.reset()
  }

  return (
    <SpPage scrollToTopBtn className='page-delivery-list' ref={pageRef}>
      <SpTagBar list={tradeStatus} value={status} onChange={onChangeTradeState} /> {statusDelivery}
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
          emptyMsg='没有查询到订单'
        >
          {tradeList.map((item, index) => (
            <View className='trade-item-wrap' key={index}>
              <CompTradeItem
                info={item}
                updateDelivery={updateDelivery}
                cancelDelivery={(e) => butStatus(e, 'cancelDelivery')}
                pack={(e) => butStatus(e, 'pack')}
              />
            </View>
          ))}
        </SpScrollView>
      </ScrollView>
      <SpFloatLayout
        title='更新配送状态'
        open={statusDelivery}
        onClose={() => {
          setState((draft) => {
            draft.statusDelivery = false
          })
        }}
        renderFooter={
          <AtButton circle type='primary' onClick={updateDeliverySure}>
            确定
          </AtButton>
        }
      >
        {statusDelivery && (
          <CompShippingInformation
            selector={list}
            delivery={information}
            deliveryItem={deliveryItem}
          />
        )}
      </SpFloatLayout>
    </SpPage>
  )
}

TradeList.options = {
  addGlobalClass: true
}

export default TradeList
