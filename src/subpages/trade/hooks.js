/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { useImmer } from 'use-immer'
import api from '@/api'
import { useTranslation, $t } from '@/i18n'

export default (props) => {
  useTranslation()
  const [state, setState] = useImmer(props)
  const callbackRef = useRef()

  const tradeActionBtns = {
    CANCEL: {
      title: $t('60f21b16.b21b5e'),
      key: 'cancel',
      btnStatus: 'normal',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpage/pages/trade/cancel?order_id=${orderId}`
        })
      }
    },
    PAY: {
      title: $t('60f21b16.747349'),
      key: 'pay',
      btnStatus: 'active',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpage/pages/trade/detail?order_id=${orderId}`
        })
      }
    },
    DETAIL: {
      title: $t('60f21b16.8054f7'),
      key: 'detail',
      btnStatus: 'active',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpages/trade/detail?order_id=${orderId}`
        })
      }
    },
    LOGISTICS: {
      title: $t('60f21b16.edf4b2'),
      key: 'logistics',
      btnStatus: 'normal',
      action: ({ orderId, isAllDelivery, ordersDeliveryId, deliveryCorpName, deliveryCode }) => {
        if (isAllDelivery) {
          Taro.navigateTo({
            url: `/subpages/trade/delivery-info?delivery_corp_name=${encodeURIComponent(
              deliveryCorpName || ''
            )}&delivery_code=${encodeURIComponent(
              deliveryCode || ''
            )}&delivery_id=${ordersDeliveryId}`
          })
        } else {
          Taro.navigateTo({
            url: `/subpages/trade/delivery-info?order_id=${orderId}`
          })
        }
      }
    },
    AFTER_SALES: {
      title: $t('60f21b16.45eb0c'),
      key: 'after_sales',
      btnStatus: 'normal',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpages/trade/after-sale?id=${orderId}`
        })
      }
    },
    CONFIRM: {
      title: $t('60f21b16.775b01'),
      key: 'confirm',
      btnStatus: 'normal'
    },
    AFTER_DETAIL: {
      title: $t('60f21b16.70536c'),
      key: 'after_detail',
      btnStatus: 'normal',
      action: ({ orderId, orderClass }) => {
        let url = `/subpages/trade/after-sale-list?order_id=${orderId}`
        if (orderClass == 'employee_purchase') {
          url += '&is_purchase=1'
        }
        Taro.navigateTo({
          url
        })
      }
    },
    EVALUATE: {
      title: $t('60f21b16.606120'),
      key: 'evaluate',
      btnStatus: 'normal',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpages/trade/trade-evaluate?order_id=${orderId}`
        })
      }
    },
    WRITE_OFF: {
      title: $t('60f21b16.e7d31e'),
      key: 'writeOff',
      btnStatus: 'normal',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/subpages/trade/trade-evaluate?order_id=${orderId}`
        })
      }
    },
    CHANGE_OFFLINE: {
      title: $t('60f21b16.990d86'),
      key: 'changeOffline',
      btnStatus: 'normal',
      action: ({ orderId }) => {
        Taro.navigateTo({
          url: `/pages/cart/offline-transfer?isDetail=true&order_id=${orderId}&has_check=true`
        })
      }
    },
    TRACK: {
      title: $t('60f21b16.15c09f'),
      key: 'track',
      btnStatus: 'normal'
    },
    INVOICE_APPLY: {
      title: $t('60f21b16.a5f23f'),
      key: 'invoice_apply',
      btnStatus: 'normal',
      action: ({ orderId, invoice_amount }) => {
        Taro.setStorageSync('invoice_params', null)
        Taro.navigateTo({
          url: `/subpages/trade/invoice?order_id=${orderId}&invoice_amount=${invoice_amount}`
        })
      }
    },
    INVOICE_DETAIL: {
      title: $t('60f21b16.7e7830'),
      key: 'invoice_detail',
      btnStatus: 'normal',
      action: ({ invoiceId }) => {
        Taro.navigateTo({
          url: `/subpages/trade/invoice-detail?invoice_id=${invoiceId}`
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
    items,
    invoiceAble,
    invoiceId,
    offlinePayCheckStatus,
    prescriptionStatus
  }) => {
    const btns = []
    const isData = receiptType == 'dada'
    const isMerchant = receiptType == 'merchant'

    if (invoiceAble && !invoiceId) {
      btns.push(tradeActionBtns.INVOICE_APPLY)
    }

    if (invoiceId) {
      btns.push(tradeActionBtns.INVOICE_DETAIL)
    }

    if (offlinePayCheckStatus == '2' && orderStatus == 'NOTPAY') {
      //线下转账拒绝时修改付款凭证
      btns.push(tradeActionBtns.CHANGE_OFFLINE)
    }

    // offline_pay_check_status审核状态。可选值有 0 待处理;1 已审核;2 已拒绝;9 已取
    if (orderStatus == 'NOTPAY' && offlinePayCheckStatus != '0') {
      // 未支付
      if (canApplyCancel) {
        btns.push(tradeActionBtns.CANCEL)
      }
      if (prescriptionStatus == 2 || prescriptionStatus == 0) {
        // 0: 商品不是处方药
        // 2: 商品是处方药，并且已经开方
        btns.push(tradeActionBtns.PAY)
      }
    } else if (orderStatus == 'PAYED') {
      if (canApplyCancel && deliveryStatus != 'PARTAIL') {
        // 拆单发货，不能取消订单
        btns.push(tradeActionBtns.CANCEL)
      }
      if (deliveryStatus != 'PENDING' && !isData) {
        btns.push(tradeActionBtns.LOGISTICS)
      }
      if (canApplyAftersales) {
        btns.push(tradeActionBtns.AFTER_SALES)
      }
    } else if (orderStatus == 'WAIT_BUYER_CONFIRM') {
      if (!isMerchant) {
        btns.push(tradeActionBtns.LOGISTICS)
      } else {
        btns.push(tradeActionBtns.TRACK)
      }
      btns.push(tradeActionBtns.CONFIRM)
      if (canApplyAftersales) {
        btns.push(tradeActionBtns.AFTER_SALES)
      }
    } else if (orderStatus == 'DONE') {
      btns.push(tradeActionBtns.LOGISTICS)
      if (canApplyAftersales) {
        btns.push(tradeActionBtns.AFTER_SALES)
      }
      if (!isRate) {
        btns.push(tradeActionBtns.EVALUATE)
      }
    }

    // 判断是否已经提交售后，展示售后详情入口
    const isShowAftersales = items?.find((item) => item.showAftersales)
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
    // 拆单发货，商品已发货
    if (item.deliveryStatus == 'DONE') {
      tradeActionBtns.LOGISTICS.btnStatus = 'active'
      btns.push(tradeActionBtns.LOGISTICS)
    }
    return btns
  }

  return { tradeActionBtns, getTradeAction, getItemAction }
}
