import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, requirePlugin, useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TRANSFORM_PAYTYPE } from '@/consts'
import { isWeixin, isWeb, isWxWeb, requestAlipayminiPayment, isAPP, showToast } from '@/utils'
import api from '@/api'



const initialState = {
  params: '',
  orderInfo: ''
}

export default (props = {}) => {
  // const [state, setState] = useImmer(initialState)
  // const { params, orderInfo } = state
  const cashierResultUrl = `/pages/cart/cashier-result`
  const $instance = getCurrentInstance()
  const currentPath = $instance?.router?.path
  const router = useRouter()
  const callbackRef = useRef()

  const cashierPayment = (params, orderInfo, callbackSuccess) => {
    console.log(`cashierPayment:`, params, orderInfo)
    callbackRef.current = callbackSuccess
    const { pay_type, pay_channel } = params
    switch (pay_type) {
      case 'wxpay':
        weappPay(params, orderInfo)
        break
      case 'adapay':
        if (pay_channel == 'wx_lite') {
          if (isWeixin) {
            weappPay(params, orderInfo)
          } else if (isAPP() || isWeb) {
            // H5非微信浏览器，跳转小程序发起支付
            adapayH5Pay(params, orderInfo)
          }
        } else if (pay_channel == 'wx_pub') {
          wxpayjsPay(params, orderInfo)
        } else if (pay_channel == 'alipay_wap' || pay_channel == 'alipay') {
          adapayAliH5Pay(params, orderInfo)
        }
        break
      case 'bspay':
        if (pay_channel == 'wx_lite') {
          if (isWeixin) {
            weappPay(params, orderInfo)
          } else if (isWeb) {
            // H5非微信浏览器，跳转小程序发起支付
            adapayH5Pay(params, orderInfo)
          }
        } else if (pay_channel == 'wx_pub') {
          wxpayjsPay(params, orderInfo)
        } else if (pay_channel == 'alipay_wap') {
          bspayAliH5Pay(params, orderInfo)
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
      case 'deposit':
      case 'point':
        depositPay(params, orderInfo)
        break
      case 'alipaymini':
        alipaymini(params, orderInfo)
      case 'offline_pay':
        offlinePay(params, orderInfo)
    }
  }

  // 当前路由是订单详情页
  const isTradeDetaiPage = () => {
    return router.path?.split('?')[0] == '/subpages/trade/detail'
  }

  // 当前路由是内购
  const isPurchasePage = () => {
    return router.path?.split('?')[0] == '/subpages/purchase/espier-checkout'
  }

  const paySuccess = (params, orderInfo) => {
    const { activityType } = params
    const { order_id } = orderInfo
    if (isTradeDetaiPage()) {
      callbackRef.current()
    } else {
      if (activityType == 'group') {
        Taro.redirectTo({ url: `/marketing/pages/item/group-detail?team_id=${orderInfo.team_id}` })
      } else {
        Taro.redirectTo({ url: `${cashierResultUrl}?order_id=${order_id}` })
      }
    }
  }

  const payError = (orderInfo) => {
    const { order_id, trade_source_type } = orderInfo
    // if(isPurchasePage()){
    //   Taro.redirectTo({ url: `/subpage/pages/trade/detail?id=${order_id}` })
    //   return
    // }
    // 社区拼团订单
    if (!isTradeDetaiPage() && router.path != '/subpages/community/order') {
      if (trade_source_type == 'normal_community') {
        Taro.redirectTo({ url: `/subpages/community/order` })
      } else {
        Taro.redirectTo({ url: `/subpages/trade/detail?order_id=${order_id}` })
      }
    }
  }

  // 微信小程序支付
  const weappPay = async (params, orderInfo) => {
    const { pay_channel, pay_type } = params
    const { order_id, trade_source_type, order_type } = orderInfo
    try {
      Taro.showLoading({ mask: true })
      const weappOrderInfo = await api.cashier.getPayment({
        pay_type,
        pay_channel,
        order_id,
        order_type: order_type || trade_source_type
      })

      // 是否开启adapay小程序插件
      // if (process.env.APP_ADAPAY == 'true') {
      //   const adapayPlugin = requirePlugin("Adapay");
      //   adapayPlugin.requestPay(weappOrderInfo.expend, () => {
      //     paySuccess(params, orderInfo)
      //   }, (e) => {
      //     console.error('adapayPlugin:', e)
      //     payError(orderInfo)
      //   });
      // } else {
      await Taro.requestPayment(weappOrderInfo)
      paySuccess(params, orderInfo)
      // }
    } catch (e) {
      Taro.hideLoading()
      payError(orderInfo)
    }
  }

  // 支付宝小程序支付
  const alipaymini = async (params, orderInfo) => {
    const { pay_channel, pay_type } = params
    const { order_id, trade_source_type, order_type } = orderInfo
    try {
      const { trade_no } = await api.cashier.getPayment({
        pay_type,
        pay_channel,
        order_id,
        order_type: order_type || trade_source_type
      })
      await requestAlipayminiPayment(trade_no)
      paySuccess(params, orderInfo)
    } catch (e) {
      payError(orderInfo)
    }
  }

  // 微信H5 JSDK
  const wxpayjsPay = async (params, orderInfo) => {
    // const $instance = getCurrentInstance()
    const { order_id, code,source} = router.params
    if (!code) {
      // 微信客户端code授权
      const loc = window.location
      // const url = `${loc.protocol}//${loc.host}/pages/cart/cashier-result?order_id=${orderId}`
      const url = `${loc.protocol}//${loc.host}/pages/cart/cashier-weapp?order_id=${orderId}&source=${source}`
      let { redirect_url } = await api.wx.getredirecturl({ url })
      window.location.href = redirect_url
    }
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
    const { order_id, order_type = 'normal' } = orderInfo
    const res = await api.cashier.getPayment({
      pay_type,
      order_id,
      order_type: order_type
    })
    console.log(`wxpayh5Pay res:`, res)
    const loc = window.location
    const redirect_url = `${loc.protocol}//${loc.host}${cashierResultUrl}?order_id=${order_id}`
    if (!res.mweb_url) {
      //积分抵扣了所有金额，订单直接支付完成了
      window.location.href = redirect_url
    } else {
      window.location.href = `${res.mweb_url}&redirect_url=${encodeURIComponent(redirect_url)}`
    }

  }

  // APP(微信、支付宝)
  const AppPay = async (params, orderInfo) => {
    console.log('AppPay:', params, orderInfo)
    const { order_id, order_type = 'normal', pay_type } = orderInfo
    const query = {
      order_id,
      pay_type,
      order_type: order_type
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
      Taro.redirectTo({ url: `/subpages/trade/detail?order_id=${order_id}` })
    }
  }

  // 支付宝H5
  const alipayh5Pay = async (params, orderInfo) => {
    const { pay_type, pay_channel } = params
    const { order_id, order_type = 'normal' } = orderInfo
    const { protocol, host } = window.location
    let query = {
      order_id,
      pay_type,
      order_type: order_type,
      return_url: `${protocol}//${host}${cashierResultUrl}?order_id=${order_id}`
    }
    if (pay_type == 'adapay' && pay_channel == 'alipay_wap') {
      query['pay_channel'] = pay_channel
    }

    const { payment } = await api.cashier.getPayment(query)
    const el = document.createElement('div')
    el.setAttribute('class', 'alipay_submit_div')
    //el.innerHTML='<form id="a" name="test"></form>'
    el.innerHTML = payment.replace(/<form/, '<form target="_blank"').replace(/<script>(.*)?<\/script>/, '')
    document.body.appendChild(el)
    document.getElementById('alipay_submit').submit()
  }

  const adapayH5Pay = async (params, orderInfo) => {
    const { order_id } = orderInfo
    const { openlink } = await api.cashier.getWeappUrlSchema({
      path: '/pages/cart/cashier-weapp',
      query: {
        // params: JSON.stringify(params),
        // orderInfo: JSON.stringify(orderInfo)
        order_id
      },
      env_version: 'release'
    })
    if (!openlink) {
      return showToast('小程序URL Scheme生成失败')
    }
    console.log('url_link:', openlink)
    Taro.redirectTo({ url: `${cashierResultUrl}?order_id=${order_id}` })
    setTimeout(() => {
      window.location.href = openlink
    }, 1000)
  }

  // 汇付斗拱，支付宝H5
  const bspayAliH5Pay = async (params, orderInfo) => {
    const { pay_type, pay_channel } = params
    const { order_id, orderType = 'normal' } = orderInfo
    const { protocol, host } = window.location
    let query = {
      order_id,
      pay_type,
      order_type: orderType,
      return_url: `${protocol}//${host}${cashierResultUrl}?order_id=${order_id}`
    }
    if (pay_type == 'bspay' && pay_channel == 'alipay_wap') {
      query['pay_channel'] = pay_channel
    }

    const { payment } = await api.cashier.getPayment(query)
    Taro.redirectTo({ url: `${cashierResultUrl}?order_id=${order_id}` })
    setTimeout(() => {
      window.location.replace(`alipays://platformapi/startapp?saId=10000007&qrcode=${payment}`)
    }, 1000)
  }

  const adapayAliH5Pay = async (params, orderInfo) => {
    const { pay_type, pay_channel } = params
    const { order_id, order_type = 'normal' } = orderInfo
    const { protocol, host } = window.location
    let query = {
      order_id,
      pay_type,
      order_type
    }
    if (pay_type == 'adapay') {
      query['pay_channel'] = pay_channel
    }
    if (!isAPP()) {
      query['return_url'] = `${protocol}//${host}${cashierResultUrl}?order_id=${order_id}`
    }

    const { payment } = await api.cashier.getPayment(query)
    Taro.redirectTo({ url: `${cashierResultUrl}?order_id=${order_id}` })
    setTimeout(() => {
      // window.location.href = payment
      window.location.replace(`alipays://platformapi/startapp?saId=10000007&qrcode=${payment}`)
    }, 1000)
  }

  // 余额/积分支付
  const depositPay = async (params, orderInfo) => {

    const { activityType, pay_type } = params
    const { order_id, team_id, order_type } = orderInfo
    if (pay_type == 'deposit') {
      try {
        await api.cashier.getPayment({
          pay_type,
          order_id,
          order_type: order_type
        })
        paySuccess(params, orderInfo)
      } catch (e) {
        payError(orderInfo)
      }
    }
    if (pay_type == 'point') {
      isTradeDetaiPage() ? orderPoints(params, orderInfo) : paySuccess(params, orderInfo)
    }
  }

  const orderPoints = async (params, orderInfo) => {
    const { activityType, pay_type } = params
    const { order_id, team_id, order_type } = orderInfo
    try {
      await api.cashier.getPayment({
        pay_type,
        order_id,
        order_type: order_type
      })
      paySuccess(params, orderInfo)
    } catch (e) {
      payError(orderInfo)
    }
  }

  const offlinePay = async (params, orderInfo) => {
    console.log('offlinePay', params, orderInfo, isTradeDetaiPage())
    const { pay_channel, pay_type } = params
    const { order_id, order_type, has_check } = orderInfo
    await api.cashier.getPayment({
      pay_type,
      pay_channel,
      order_id,
      order_type: order_type
    })
    if (isTradeDetaiPage()) {
      Taro.navigateTo({ url: `/pages/cart/offline-transfer?isDetail=true&order_id=${order_id}&has_check=${has_check}` })
    } else {
      Taro.redirectTo({ url: '/pages/cart/offline-transfer?order_id=' + order_id })
    }


  }


  return {
    cashierPayment
  }
}
