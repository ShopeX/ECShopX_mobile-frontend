// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import Taro from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { pickBy, showToast } from '@/utils'
import { useImmer } from 'use-immer'
import api from '@/api'

const initialConfigState = {
  list: []
}

export default (props) => {
  const [state, setState] = useImmer(initialConfigState)

  const popUpStatus = (item, val) => {
    return new Promise((resolve, reject) => {
      Taro.showModal({
        title: '提示',
        content: `你确认要${val == 'pack' ? '打包' : '取消配送'}订单编号为${
          item.orderId
        }的订单吗？`,
        async success(res) {
          if (res.confirm) {
            if (val == 'pack') {
              await api.delivery.deliverypackagConfirm({ order_id: item.orderId })
              showToast('打包成功')
              resolve(true)
            } else {
              await api.delivery.cancelDeliverystaff({ order_id: item.orderId })
              showToast('取消配送成功')
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
      return '已接单待打包'
    } else if (delivery.orderStatus == 'PAYED' && delivery.selfDeliveryStatus == 'PACKAGED') {
      return '已接单待发货'
    } else if (
      delivery.orderStatus == 'WAIT_BUYER_CONFIRM' &&
      delivery.selfDeliveryStatus == 'DELIVERING'
    ) {
      return '已发货配送中'
    } else if (
      delivery.orderStatus == 'WAIT_BUYER_CONFIRM' &&
      delivery.selfDeliveryStatus == 'DONE'
    ) {
      return '已送达'
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
        await api.delivery.orderUpdateDelivery(information.ordersDeliveryId, params)
        showToast('更新配送状态成功')
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }

  return { popUpStatus, orderState, deliverySure }
}
