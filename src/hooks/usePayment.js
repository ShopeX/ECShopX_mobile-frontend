import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import api from '@/api'

const initialState = {
  params: '',
  orderInfo: ''
}

export default (props = {}) => {
  // const [state, setState] = useImmer(initialState)
  // const { params, orderInfo } = state
  const cashierResultUrl = `/pages/cart/cashier-result`

  const cashierPayment = (params, orderInfo) => {
    const { pay_type } = params
    switch (pay_type) {
      case 'wxpay':
        weappPay(params, orderInfo)
        break
      case 'wxpayh5':
        wxpayh5Pay(params, orderInfo)
        break
      case 'alipayh5':
        alipayh5Pay(params, orderInfo)
        break
      case 'wxpayjs':
        wxpayjsPay(params, orderInfo)
        break
    }
  }

  // 微信小程序支付
  const weappPay = async (params, orderInfo) => {
    const { order_id } = orderInfo.trade_info
    try {
      await Taro.requestPayment(orderInfo)
      const { activityType } = params
      if (activityType == 'group') {
        Taro.redirectTo({ url: `/marketing/pages/item/group-detail?team_id=${orderInfo.team_id}` })
      } else {
        Taro.redirectTo({ url: `${cashierResultUrl}?order_id=${order_id}` })
      }
    } catch (e) {
      Taro.redirectTo({ url: `/subpage/pages/trade/detail?id=${order_id}` })
    }
  }

  // 微信H5 JSDK
  const wxpayjsPay = async (params) => {
    const $instance = getCurrentInstance()
    const { order_id, code } = $instance.router.params
    const { open_id } = await api.wx.getOpenid({ code })
    const { pay_type, order_type = 'normal' } = params
    const config = await api.cashier.getPayment({
      pay_type,
      order_id,
      order_type,
      open_id
    })
    const { appId, timeStamp, nonceStr, signType, paySign } = config
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        appId, //公众号名称，由商户传入
        timeStamp, //时间戳，自1970年以来的秒数
        nonceStr, //随机串
        package: config.package,
        signType, //微信签名方式：
        paySign //微信签名
      },
      function (res) {
        console.log(res)
        const loc = window.location
        window.location.href = `${loc.protocol}//${loc.host}${cashierResultUrl}?order_id=${order_id}`
      }
    )
  }

  // 微信H5
  const wxpayh5Pay = async (params, orderInfo) => {
    const refMeta = document.querySelector('meta[name="referrer"]')
    refMeta.setAttribute('content', 'always')
    const { pay_type } = params
    const { order_id, orderType = 'normal' } = orderInfo
    const res = await api.cashier.getPayment({
      pay_type,
      order_id,
      order_type: orderType
    })
    console.log(`wxpayh5Pay res:`, res)
    const loc = window.location
    const redirect_url = `${loc.protocol}//${loc.host}${cashierResultUrl}?order_id=${order_id}`
    window.location.href = `${res.mweb_url}&redirect_url=${encodeURIComponent(redirect_url)}`
  }

  // 微信APP

  // 支付宝H5
  const alipayh5Pay = async (params, orderInfo) => {
    const { pay_type } = params
    const { order_id, orderType = 'normal' } = orderInfo
    const { protocol, host } = window.location
    const { payment } = await api.cashier.getPayment({
      order_id,
      pay_type,
      order_type: orderType,
      return_url: `${protocol}//${host}${cashierResultUrl}?order_id=${order_id}`
    })
    const el = document.createElement('div')
    el.setAttribute('class', 'alipay_submit_div')
    //el.innerHTML='<form id="a" name="test"></form>'
    el.innerHTML = payment.replace(/<script>(.*)?<\/script>/, '')
    document.body.appendChild(el)
    document.getElementById('alipay_submit').submit()
  }

  // 支付宝APP

  return {
    cashierPayment
  }
}
