import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TRANSFORM_PAYTYPE } from '@/consts'
import { isWeixin, isWeb, isWxWeb } from '@/utils'
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
    console.log(`cashierPayment:`, params, orderInfo)
    const { pay_type, pay_channel } = params
    switch (pay_type) {
      case 'wxpay':
        weappPay(params, orderInfo)
        break
      case 'adapay':
        if (pay_channel == 'wx_lite') {
          weappPay(params, orderInfo)
        } else if (pay_channel == 'wx_pub') {
          if (isWxWeb) {
            wxpayjsPay(params, orderInfo)
          } else if (isWeb) {
            // H5非微信浏览器，跳转小程序发起支付
            adapayH5Pay(params, orderInfo)
          }
        } else if (pay_channel == 'alipay_wap') {
          adapayAliH5Pay(params, orderInfo)
        }
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
      case 'wxpayapp':
      case 'alipayapp':
        AppPay(params, orderInfo)
        break
    }
  }

  // 微信小程序支付
  const weappPay = async (params, orderInfo) => {
    const { pay_channel, pay_type } = params
    const { order_id, trade_source_type, order_type } = orderInfo
    try {
      const weappOrderInfo = await api.cashier.getPayment({
        pay_type,
        pay_channel,
        order_id,
        order_type: order_type || trade_source_type
      })
      await Taro.requestPayment(weappOrderInfo)
      const { activityType } = params
      if (activityType == 'group') {
        Taro.redirectTo({ url: `/marketing/pages/item/group-detail?team_id=${orderInfo.team_id}` })
      } else {
        Taro.redirectTo({ url: `${cashierResultUrl}?order_id=${order_id}` })
      }
    } catch (e) {
      // 社区拼团订单
      const $instance = getCurrentInstance()
      const { path } = $instance.router
      if (path != '/subpage/pages/trade/detail' && path != '/subpages/community/order') {
        if (trade_source_type == 'normal_community') {
          Taro.redirectTo({ url: `/subpages/community/order` })
        } else {
          Taro.redirectTo({ url: `/subpage/pages/trade/detail?id=${order_id}` })
        }
      }
    }
  }

  // 微信H5 JSDK
  const wxpayjsPay = async (params, orderInfo) => {
    const $instance = getCurrentInstance()
    const { order_id, code } = $instance.router.params
    const { open_id } = await api.wx.getOpenid({ code })
    const { pay_channel } = params
    const { pay_type, order_type = 'normal' } = orderInfo
    const config = await api.cashier.getPayment({
      pay_type,
      pay_channel,
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

  // APP(微信、支付宝)
  const AppPay = async (params, orderInfo) => {
    console.log('AppPay:', params, orderInfo)
    const { order_id, orderType = 'normal', pay_type } = orderInfo
    const query = {
      order_id,
      pay_type,
      order_type: orderType
    }
    const { config: appPayConfig } = await api.cashier.getPayment(query)
    try {
      await Taro.SAPPPay.payment({
        id: TRANSFORM_PAYTYPE[pay_type],
        order_params: appPayConfig
      })
      Taro.redirectTo({ url: `${cashierResultUrl}?order_id=${order_id}` })
    } catch (e) {
      console.error(e)
      Taro.redirectTo({ url: `/subpage/pages/trade/detail?id=${order_id}` })
    }
  }

  // 支付宝H5
  const alipayh5Pay = async (params, orderInfo) => {
    const { pay_type, pay_channel } = params
    const { order_id, orderType = 'normal' } = orderInfo
    const { protocol, host } = window.location
    let query = {
      order_id,
      pay_type,
      order_type: orderType,
      return_url: `${protocol}//${host}${cashierResultUrl}?order_id=${order_id}`
    }
    if (pay_type == 'adapay' && pay_channel == 'alipay_wap') {
      query['pay_channel'] = pay_channel
    }

    const { payment } = await api.cashier.getPayment(query)
    const el = document.createElement('div')
    el.setAttribute('class', 'alipay_submit_div')
    //el.innerHTML='<form id="a" name="test"></form>'
    el.innerHTML = payment.replace(/<script>(.*)?<\/script>/, '')
    document.body.appendChild(el)
    document.getElementById('alipay_submit').submit()
  }

  const adapayH5Pay = async (params, orderInfo) => {
    const { order_id, orderType = 'normal' } = orderInfo
    const { openlink } = await api.cashier.getWeappUrlSchema({
      path: '/pages/cart/cashier-weapp',
      query: {
        // params: JSON.stringify(params),
        // orderInfo: JSON.stringify(orderInfo)
        order_id
      },
      env_version: 'release'
    })
    console.log('url_link:', openlink)
    Taro.redirectTo({ url: `${cashierResultUrl}?order_id=${order_id}` })
    setTimeout(() => {
      window.location.href = openlink
    }, 1000)
  }

  const adapayAliH5Pay = async (params, orderInfo) => {
    const { pay_type, pay_channel } = params
    const { order_id, orderType = 'normal' } = orderInfo
    const { protocol, host } = window.location
    let query = {
      order_id,
      pay_type,
      order_type: orderType,
      return_url: `${protocol}//${host}${cashierResultUrl}?order_id=${order_id}`
    }
    if (pay_type == 'adapay' && pay_channel == 'alipay_wap') {
      query['pay_channel'] = pay_channel
    }

    const { payment } = await api.cashier.getPayment(query)
    Taro.redirectTo({ url: `${cashierResultUrl}?order_id=${order_id}` })
    setTimeout(() => {
      // window.location.href = payment
      window.location.replace(`alipays://platformapi/startapp?saId=10000007&qrcode=${payment}`)
    }, 1000)
  }

  return {
    cashierPayment
  }
}
