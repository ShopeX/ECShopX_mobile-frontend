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
import { isWxWeb } from '@/utils'
import './cashier-weapp.scss'

const initialState = {
  price: 0,
  order_id: '',
  create_time: '',
  params: {},
  orderInfo: {}
}
function CashierWeApp(props) {
  const $instance = getCurrentInstance()
  // const { params, orderInfo } = $instance.router.params
  // const _params = JSON.parse(decodeURIComponent(params))
  // const _orderInfo = JSON.parse(decodeURIComponent(orderInfo))
  const [state, setState] = useImmer(initialState)
  const { price, order_id, create_time, params, orderInfo } = state

  const { cashierPayment } = usePayment()

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { order_id, code  } = $instance.router.params
    if(isWxWeb && !code) {
      // 微信客户端code授权
      const loc = window.location
      // const url = `${loc.protocol}//${loc.host}/pages/cart/cashier-result?order_id=${orderId}`
      const url = `${loc.protocol}//${loc.host}/pages/cart/cashier-weapp?order_id=${orderId}`
      let { redirect_url } = await api.wx.getredirecturl({ url })
      window.location.href = redirect_url
    }

    const orderDetail = await api.cashier.getOrderDetail(order_id)
    const { activity_type, order_type, pay_type, total_fee, create_time } = orderDetail.orderInfo
    const params = {
      activityType: activity_type
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

  const handlePay = () => {
    cashierPayment(params, orderInfo)
  }
  return (
    <View className='cashier-weapp'>
      <View className='cashier-hd'>
        <Text className='iconfont icon-weixinzhifu'></Text>
        <Text className='title'>微信付款</Text>
      </View>
      <View className='pay-price'>
        <SpPrice value={price} size={60} />
      </View>
      <View className='trade-info'>
        <SpCell title='下单时间' value={create_time} />
        <SpCell title='订单号' value={order_id} />
      </View>
      <View className='btn-wrap'>
        <AtButton onClick={handlePay}>立即支付</AtButton>
      </View>
    </View>
  )
}

CashierWeApp.options = {
  addGlobalClass: true
}

export default CashierWeApp
