import Taro from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { useImmer } from 'use-immer'
import api from '@/api'

export default (props) => {
  const [state, setState] = useImmer(props)

  const tradeActionBtns = {
    CANCEL: {
      title: '取消订单',
      key: 'cancel',
      btnStatus: 'normal',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpage/pages/trade/cancel?order_id=${orderId}`
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
    AFTER_SALES: {
      title: '申请售后',
      key: 'after_sales',
      btnStatus: 'normal',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpages/trade/after-sale?id=${orderId}`
        })
      }
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
    SEND_OUT_GOODS: {
      title: '发货',
      key: 'send_out_goods',
      btnStatus: 'active',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpages/delivery/send-out-goods?order_id=${orderId}`
        })
      }
    },
    PACK: {
      title: '打包',
      key: 'pack',
      btnStatus: 'active',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpages/trade/after-sale-list?order_id=${orderId}`
        })
      }
    },
    CANCEL_DELIVERY: {
      title: '取消配送',
      key: 'cancel_delivery',
      btnStatus: 'normal'
    },
    UPDATE_DELIVERY: {
      title: '更新配送状态',
      key: 'update_delivery',
      btnStatus: 'active'
    }
  }

  // 一级是 订单状态 order_status
  // 二级是配送状态  self_delivery_status
  //
  // PAYED  待发货
  //            RECEIVEORDER  已接单（确认打包，取消配送）
  //            PACKAGED  已打包（发货，取消配送）
  //            CONFIRMING  配送取消
  //
  // WAIT_BUYER_CONFIRM  已发货
  //            DELIVERING  配送中（更新状态）
  //            DONE  已送达 （申请售后）

  //取消配送（弹框暂时不写原因）

  const getTradeAction = ({ orderStatus, items, selfDeliveryStatus }) => {
    const btns = []
    console.log('orderStatus111', orderStatus, selfDeliveryStatus)
    if (orderStatus == 'PAYED') {
      if (selfDeliveryStatus == 'RECEIVEORDER') {
        btns.push(tradeActionBtns.PACK)
        btns.push(tradeActionBtns.CANCEL_DELIVERY)
      } else if (selfDeliveryStatus == 'PACKAGED') {
        btns.push(tradeActionBtns.SEND_OUT_GOODS)
        btns.push(tradeActionBtns.CANCEL_DELIVERY)
      }
    } else if (orderStatus == 'WAIT_BUYER_CONFIRM') {
      if (selfDeliveryStatus == 'DELIVERING') {
        btns.push(tradeActionBtns.UPDATE_DELIVERY)
      } else if (selfDeliveryStatus == 'DONE') {
        btns.push(tradeActionBtns.AFTER_SALES)
      }
    }

    // 判断是否已经提交售后，展示售后详情入口
    const isShowAftersales = items.find((item) => item.showAftersales)
    if (isShowAftersales) {
      btns.push(tradeActionBtns.AFTER_DETAIL)
    }

    return btns
  }

  const getItemAction = (item) => {
    const btns = []
    if (item.showAftersales) {
      btns.push(tradeActionBtns.AFTER_DETAIL)
    }
    return btns
  }

  return { tradeActionBtns, getTradeAction, getItemAction }
}
