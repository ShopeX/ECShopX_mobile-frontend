/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { showToast } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import * as deliveryApi from '@/api/delivery'

export default (props) => {
  useTranslation()

  const popUpStatus = (item, val) => {
    return new Promise((resolve, reject) => {
      Taro.showModal({
        title: $t('297bf473.02d981'),
        content:
          val == 'pack'
            ? ti('297bf473.618479', [item.orderId])
            : ti('297bf473.b581e0', [item.orderId]),
        async success(res) {
          if (res.confirm) {
            if (val == 'pack') {
              await deliveryApi.deliverypackagConfirm({ order_id: item.orderId })
              showToast($t('297bf473.9a94fc'))
              resolve(true)
            } else {
              await deliveryApi.cancelDeliverystaff({ order_id: item.orderId })
              showToast($t('297bf473.b21de1'))
              resolve(true)
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
            reject(false)
          }
        }
      })
    })
  }

  const orderState = (delivery) => {
    if (delivery.orderStatus == 'PAYED' && delivery.selfDeliveryStatus == 'RECEIVEORDER') {
      return $t('297bf473.9c684b')
    } else if (delivery.orderStatus == 'PAYED' && delivery.selfDeliveryStatus == 'PACKAGED') {
      return $t('297bf473.8710a7')
    } else if (
      delivery.orderStatus == 'WAIT_BUYER_CONFIRM' &&
      delivery.selfDeliveryStatus == 'DELIVERING'
    ) {
      return $t('297bf473.b9cc03')
    } else if (
      delivery.orderStatus == 'WAIT_BUYER_CONFIRM' &&
      delivery.selfDeliveryStatus == 'DONE'
    ) {
      return $t('297bf473.f87f48')
    }
  }

  const buildParams = (information, list) => {
    let params = {
      order_id: information.orderId,
      self_delivery_operator_id: information.selfDeliveryOperatorId,
      self_delivery_status: 'DONE',
      delivery_type: 'batch',
      delivery_corp: 'SELF_DELIVERY',
      delivery_code: information.deliveryCode
    }
    list.forEach((item) => {
      if (item.status !== 'select') {
        params[item.value] = item.selector
      }
      if (item.value == 'self_delivery_status' && item.selector[0].status) {
        params.self_delivery_status = 'DELIVERING'
      }
    })

    return params
  }

  const deliverySure = (information, list) => {
    return new Promise(async (resolve, reject) => {
      try {
        const params = buildParams(information, list)
        await deliveryApi.orderUpdateDelivery(information.ordersDeliveryId, params)
        showToast($t('297bf473.8589f2'))
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }

  return { popUpStatus, orderState, deliverySure }
}
