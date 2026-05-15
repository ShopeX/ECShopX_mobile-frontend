/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { usePayment } from '@/hooks'
import { SpPrice, SpCell } from '@/components'
import dayjs from 'dayjs'
import { isWxWeb, isWeixin } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './cashier-weapp.scss'

const initialState = {
  price: 0,
  order_id: '',
  create_time: '',
  params: {},
  orderInfo: {}
}
function CashierWeApp(props) {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  // const { params, orderInfo } = $instance?.router?.params
  // const _params = JSON.parse(decodeURIComponent(params))
  // const _orderInfo = JSON.parse(decodeURIComponent(orderInfo))
  const [state, setState] = useImmer(initialState)
  const { price, order_id, create_time, params, orderInfo } = state

  const { cashierPayment } = usePayment()
  const { source } = $instance?.router?.params
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('30644393.9cfc7d') })
    const onLang = () => Taro.setNavigationBarTitle({ title: $t('30644393.9cfc7d') })
    i18n.on('languageChanged', onLang)
    return () => i18n.off('languageChanged', onLang)
  }, [i18n])

  useEffect(() => {
    const { order_id, source } = $instance?.router?.params
    if (order_id) {
      fetch()
    }
  }, [])

  const fetch = async () => {
    const { order_id, code, source } = $instance?.router?.params
    if (isWxWeb && !code) {
      // 微信客户端code授权
      const loc = window.location
      // const url = `${loc.protocol}//${loc.host}/pages/cart/cashier-result?order_id=${orderId}`
      const url = `${loc.protocol}//${loc.host}/pages/cart/cashier-weapp?order_id=${order_id}&source=${source}`
      let { redirect_url } = await api.wx.getredirecturl({ url })
      window.location.href = redirect_url
    }
    const orderDetail = await api.cashier.getOrderDetail(order_id)
    const { activity_type, order_type, pay_type, total_fee, create_time, pay_channel } =
      orderDetail.orderInfo
    const params = {
      activityType: activity_type,
      pay_channel: isWeixin ? 'wx_lite' : pay_channel == 'wx_qr' ? 'wx_pub' : pay_channel,
      pay_type: pay_type
    }
    const orderInfo = {
      order_id,
      order_type: order_type,
      pay_type
    }

    setState((draft) => {
      draft.price = total_fee / 100
      draft.order_id = order_id
      draft.create_time = dayjs(create_time * 1000).format('YYYY-MM-DD HH:mm:ss')
      draft.params = params
      draft.orderInfo = orderInfo
    })

    // 3810663000220212
    // const { order_id } = _orderInfo
    // const { orderInfo, tradeInfo } = await api.cashier.getOrderDetail(order_id)
    // const { create_time } = orderInfo
    // setState(draft => {
    //   draft.price = total_fee / 100
    //   draft.order_id = order_id
    //   draft.create_time = dayjs(create_time).format('YYYY-MM-DD HH:mm:ss')
    // })
  }

  const handlePay = async () => {
    const { source } = $instance?.router?.params
    let _params = { ...params }
    if (source) {
      _params.source = source
    }
    cashierPayment(_params, orderInfo)
  }
  return (
    <View className='cashier-weapp'>
      <View className='cashier-hd'>
        <Text className='iconfont icon-weixinzhifu'></Text>
        <Text className='title'>{$t('30644393.9cfc7d')}</Text>
      </View>
      <View className='pay-price'>
        <SpPrice value={price} size={60} />
      </View>
      <View className='trade-info'>
        <SpCell title={$t('30644393.2240cc')} value={create_time} />
        <SpCell title={$t('30644393.1e8dc2')} value={order_id} />
      </View>
      <View className='btn-wrap'>
        <AtButton onClick={handlePay}>{$t('30644393.747349')}</AtButton>
      </View>
    </View>
  )
}

CashierWeApp.options = {
  addGlobalClass: true
}

export default CashierWeApp
