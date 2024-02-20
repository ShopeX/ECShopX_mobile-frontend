import Taro from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { useImmer } from 'use-immer'

export default (props) => {
  const [state, setState] = useImmer(props)
  const callbackRef = useRef()

  const tradeActionBtns = {
    CANCEL: {
      title: '取消订单', key: 'cancel', btnStatus: 'normal', action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpage/pages/trade/cancel?order_id=${orderId}`
        })
      }
    },
    PAY: { title: '立即支付', key: 'pay', btnStatus: 'active' },
    DETAIL: {
      title: '订单详情',
      key: 'detail',
      btnStatus: 'active',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpages/trade/detail?order_id=${orderId}`
        })
      }
    },
    LOGISTICS: { title: '查看物流', key: 'logistics', btnStatus: 'normal' }
  }

  const getTradeAction = ({
    orderStatus,
    isLogistics,
    canApplyCancel,
    deliveryStatus,
    receiptType
  }) => {
    const btns = []
    const isData = receiptType == 'dada'
    if (orderStatus == 'NOTPAY') {
      if (canApplyCancel) {
        btns.push(tradeActionBtns.CANCEL)
      }
      btns.push(tradeActionBtns.PAY)
    } else if (orderStatus == 'PAYED') {
      if (canApplyCancel) {
        btns.push(tradeActionBtns.CANCEL)
      }
      if (deliveryStatus != 'PENDING' && !isData) {
        btns.push(tradeActionBtns.LOGISTICS)
      }
    }

    // btns.push(tradeActionBtns.DETAIL)
    return btns
  }

  return { tradeActionBtns, getTradeAction }
}
