/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { useMemo } from 'react'
import { useTranslation, $t } from '@/i18n'

export default () => {
  const { i18n } = useTranslation()

  const tradeActionBtns = useMemo(
    () => ({
      CANCEL: {
        title: $t('cb889b1e.b21b5e'),
        key: 'cancel',
        btnStatus: 'normal',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpage/pages/trade/cancel?order_id=${orderId}`
          })
        }
      },
      DETAIL: {
        title: $t('cb889b1e.8054f7'),
        key: 'detail',
        btnStatus: 'active',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpages/trade/detail?order_id=${orderId}`
          })
        }
      },
      AFTER_SALES: {
        title: $t('cb889b1e.45eb0c'),
        key: 'after_sales',
        btnStatus: 'normal',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpages/delivery/after-sale?id=${orderId}`
          })
        }
      },
      AFTER_DETAIL: {
        title: $t('cb889b1e.70536c'),
        key: 'after_detail',
        btnStatus: 'normal',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpages/trade/after-sale-list?order_id=${orderId}`
          })
        }
      },
      SEND_OUT_GOODS: {
        title: $t('cb889b1e.045315'),
        key: 'send_out_goods',
        btnStatus: 'active',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpages/delivery/send-out-goods?order_id=${orderId}`
          })
        }
      },
      PACK: {
        title: $t('cb889b1e.5a9f36'),
        key: 'pack',
        btnStatus: 'active',
        action: ({ orderId }) => {
          Taro.navigateTo({
            url: `/subpages/trade/after-sale-list?order_id=${orderId}`
          })
        }
      },
      CANCEL_DELIVERY: {
        title: $t('cb889b1e.204fe4'),
        key: 'cancel_delivery',
        btnStatus: 'normal'
      },
      UPDATE_DELIVERY: {
        title: $t('cb889b1e.997b79'),
        key: 'update_delivery',
        btnStatus: 'active'
      }
    }),
    [i18n.language]
  )

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
    // const isShowAftersales = items.find((item) => item.showAftersales)
    // if (isShowAftersales) {
    //   btns.push(tradeActionBtns.AFTER_DETAIL)
    // }

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
