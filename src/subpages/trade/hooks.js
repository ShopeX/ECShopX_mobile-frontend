import Taro from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { useImmer } from 'use-immer'
import api from '@/api'

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
    PAY: {
      title: '立即支付', key: 'pay', btnStatus: 'active', action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpage/pages/trade/detail?order_id=${orderId}`
        })
      }
    },
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
    LOGISTICS: {
      title: '查看物流', key: 'logistics', btnStatus: 'normal', action: ({ orderId, isAllDelivery, ordersDeliveryId, deliveryCorpName, deliveryCode }) => {
        if (isAllDelivery) {
          Taro.navigateTo({
            url: `/subpages/trade/delivery-info?delivery_corp_name=${deliveryCorpName}&delivery_code=${deliveryCode}&delivery_id=${ordersDeliveryId}`
          })
        } else {
          Taro.navigateTo({
            url: `/subpages/trade/delivery-info?order_id=${orderId}`
          })
        }
      }
    },
    AFTER_SALES: {
      title: '申请售后', key: 'after_sales', btnStatus: 'normal', action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpages/trade/after-sale?id=${orderId}`
        })
      }
    },
    CONFIRM: {
      title: '确认收货', key: 'confirm', btnStatus: 'normal'
    },
    AFTER_DETAIL: {
      title: '售后详情',
      key: 'after_detail',
      btnStatus: 'normal',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpages/trade/after-sale-list?order_id=${orderId}`
        })
      }
    },
    EVALUATE: {
      title: '评价',
      key: 'evaluate',
      btnStatus: 'normal',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpages/trade/trade-evaluate?order_id=${orderId}`
        })
      }
    },
    WRITE_OFF: {
      title: '核销',
      key: 'writeOff',
      btnStatus: 'normal',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpages/trade/trade-evaluate?order_id=${orderId}`
        })
      }
    }
  }

  const getTradeAction = ({
    orderStatus,
    isLogistics,
    canApplyCancel,
    canApplyAftersales,
    deliveryStatus,
    receiptType,
    isRate,
    items
  }) => {
    const btns = []
    const isData = receiptType == 'dada'

    if (orderStatus == 'NOTPAY') { // 未支付
      if (canApplyCancel) {
        btns.push(tradeActionBtns.CANCEL)
      }
      btns.push(tradeActionBtns.PAY)
    } else if (orderStatus == 'PAYED') {
      if (canApplyCancel && deliveryStatus != 'PARTAIL') { // 拆单发货，不能取消订单
        btns.push(tradeActionBtns.CANCEL)
      }
      if (deliveryStatus != 'PENDING' && !isData) {
        btns.push(tradeActionBtns.LOGISTICS)
      }
      if (canApplyAftersales) {
        btns.push(tradeActionBtns.AFTER_SALES)
      }
    } else if (orderStatus == 'WAIT_BUYER_CONFIRM') {
      btns.push(tradeActionBtns.LOGISTICS)
      btns.push(tradeActionBtns.CONFIRM)
      if (canApplyAftersales) {
        btns.push(tradeActionBtns.AFTER_SALES)
      }
    } else if (orderStatus == 'DONE') {
      // btns.push(tradeActionBtns.LOGISTICS)
      if (canApplyAftersales) {
        btns.push(tradeActionBtns.AFTER_SALES)
      }
      if (!isRate) {
        btns.push(tradeActionBtns.EVALUATE)
      }
    }

    // 判断是否已经提交售后，展示售后详情入口
    const isShowAftersales = items.find(item => item.showAftersales)
    if(isShowAftersales) {
      btns.push(tradeActionBtns.AFTER_DETAIL)
    }

    return btns
  }

  const getItemAction = (item) => {
    const btns = []
    if (item.showAftersales) {
      btns.push(tradeActionBtns.AFTER_DETAIL)
    }
    // 拆单发货，商品已发货
    if (item.deliveryStatus == 'DONE') {
      tradeActionBtns.LOGISTICS.btnStatus = 'active'
      btns.push(tradeActionBtns.LOGISTICS)
    }
    return btns
  }

  return { tradeActionBtns, getTradeAction, getItemAction }
}
