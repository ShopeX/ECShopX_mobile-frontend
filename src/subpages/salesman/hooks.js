/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { useRef, useMemo } from 'react'
import { useImmer } from 'use-immer'
import api from '@/api'
import { $t, useTranslation } from '@/i18n'

export default (props) => {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(props)
  const callbackRef = useRef()

  const tradeActionBtns = useMemo(
    () => ({
      CANCEL: {
        title: $t('2715dbf7.b21b5e'),
        key: 'cancel',
        btnStatus: 'normal',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpage/pages/trade/cancel?order_id=${orderId}`
          })
        }
      },
      PAY: {
        title: $t('2715dbf7.747349'),
        key: 'pay',
        btnStatus: 'active',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpage/pages/trade/detail?order_id=${orderId}`
          })
        }
      },
      DETAIL: {
        title: $t('2715dbf7.8054f7'),
        key: 'detail',
        btnStatus: 'active',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpages/trade/detail?order_id=${orderId}`
          })
        }
      },
      LOGISTICS: {
        title: $t('64c107ec.edf4b2'),
        key: 'logistics',
        btnStatus: 'normal',
        action: ({ orderId, isAllDelivery, ordersDeliveryId, deliveryCorpName, deliveryCode }) => {
          if (isAllDelivery) {
            Taro.navigateTo({
              url: `/subpages/salesman/delivery-info?delivery_corp_name=${encodeURIComponent(
                deliveryCorpName || ''
              )}&delivery_code=${encodeURIComponent(
                deliveryCode || ''
              )}&delivery_id=${ordersDeliveryId}`
            })
          } else {
            Taro.navigateTo({
              url: `/subpages/salesman/delivery-info?order_id=${orderId}`
            })
          }
        }
      },
      AFTER_SALES: {
        title: $t('2715dbf7.45eb0c'),
        key: 'after_sales',
        btnStatus: 'normal',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpages/trade/after-sale?id=${orderId}`
          })
        }
      },
      CONFIRM: {
        title: $t('2715dbf7.775b01'),
        key: 'confirm',
        btnStatus: 'normal'
      },
      AFTER_DETAIL: {
        title: $t('64c107ec.70536c'),
        key: 'after_detail',
        btnStatus: 'normal',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpages/trade/after-sale-list?order_id=${orderId}`
          })
        }
      },
      EVALUATE: {
        title: $t('2715dbf7.606120'),
        key: 'evaluate',
        btnStatus: 'normal',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpages/trade/trade-evaluate?order_id=${orderId}`
          })
        }
      },
      WRITE_OFF: {
        title: $t('2715dbf7.e7d31e'),
        key: 'writeOff',
        btnStatus: 'normal',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpages/trade/trade-evaluate?order_id=${orderId}`
          })
        }
      },
      CHANGE_OFFLINE: {
        title: $t('2715dbf7.990d86'),
        key: 'changeOffline',
        btnStatus: 'normal',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/pages/cart/offline-transfer?isDetail=true&order_id=${orderId}&has_check=true&isDianwu=1`
          })
        }
      },
      UPLOAD__OFFLINE: {
        title: $t('2715dbf7.922d32'),
        key: 'changeOffline',
        btnStatus: 'normal',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/pages/cart/offline-transfer?isDetail=true&order_id=${orderId}&has_check=false&isDianwu=1`
          })
        }
      }
    }),
    [i18n.language]
  )

  const getTradeAction = ({
    orderStatus,
    isLogistics,
    canApplyCancel,
    canApplyAftersales,
    deliveryStatus,
    receiptType,
    isRate,
    items,
    payChannel,
    offlinePayCheckStatus
  }) => {
    const btns = []
    const isData = receiptType == 'dada'

    if (payChannel == 'offline_pay' && orderStatus == 'NOTPAY') {
      if (offlinePayCheckStatus == null) {
        //上传凭证
        btns.push(tradeActionBtns.UPLOAD__OFFLINE)
      }

      if (offlinePayCheckStatus == '2') {
        //线下转账拒绝时修改付款凭证
        btns.push(tradeActionBtns.CHANGE_OFFLINE)
      }
    }

    if (orderStatus == 'NOTPAY' && offlinePayCheckStatus != '0') {
      // 未支付
      if (canApplyCancel) {
        btns.push(tradeActionBtns.CANCEL)
      }
      // btns.push(tradeActionBtns.PAY)
    } else if (orderStatus == 'PAYED') {
      if (canApplyCancel && deliveryStatus != 'PARTAIL') {
        // 拆单发货，不能取消订单
        btns.push(tradeActionBtns.CANCEL)
      }
      if (deliveryStatus != 'PENDING' && !isData) {
        btns.push(tradeActionBtns.LOGISTICS)
      }
      if (canApplyAftersales) {
        // btns.push(tradeActionBtns.AFTER_SALES)
      }
    } else if (orderStatus == 'WAIT_BUYER_CONFIRM') {
      btns.push(tradeActionBtns.LOGISTICS)
      // btns.push(tradeActionBtns.CONFIRM)
      if (canApplyAftersales) {
        // btns.push(tradeActionBtns.AFTER_SALES)
      }
    } else if (orderStatus == 'DONE') {
      // btns.push(tradeActionBtns.LOGISTICS)
      if (canApplyAftersales) {
        // btns.push(tradeActionBtns.AFTER_SALES)
      }
      if (!isRate) {
        // btns.push(tradeActionBtns.EVALUATE)
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
    // 拆单发货，商品已发货
    if (item.deliveryStatus == 'DONE') {
      tradeActionBtns.LOGISTICS.btnStatus = 'active'
      btns.push(tradeActionBtns.LOGISTICS)
    }
    return btns
  }

  return { tradeActionBtns, getTradeAction, getItemAction }
}
