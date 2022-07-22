import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button, Image, ScrollView } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtCountdown } from 'taro-ui'
import { Loading, SpNavBar, FloatMenuMeiQia, SpNewShopItem } from '@/components'
import {
  log,
  pickBy,
  formatDateTime,
  payPlatform,
  resolveOrderStatus,
  copyText,
  getCurrentRoute,
  isAlipay,
  classNames,
  isNavbar,
  isWeb,
  redirectUrl,
  VERSION_PLATFORM,
  VERSION_IN_PURCHASE,
  isAPP,
  isWxWeb
} from '@/utils'
import { transformTextByPoint } from '@/utils/helper'
import { PAYTYPE } from '@/consts'
import { Tracker } from '@/service'
import api from '@/api'
import { TracksPayed } from '@/utils/youshu'
import S from '@/spx'
import { usePayment } from '@/hooks'
import DetailItem from './comps/detail-item'
// 图片引入
import ErrorDaDa from '../../assets/dada0.png'
import WaitStore from '../../assets/dada1.png'
import WaitDaDa from '../../assets/dada2.png'
import OnRoad from '../../assets/dada4.png'
import Cancel from '../../assets/dada5.png'
import Success from '../../assets/dada6.png'
import DadaGoStore from '../../assets/dada7.png'

import './detail.scss'

// 订单状态和图片匹配
const statusImg = {
  // 等待商家接单
  0: WaitStore,
  // 等待骑手接单
  1: WaitDaDa,
  2: WaitDaDa,
  // 配送中
  3: OnRoad,
  // 已完成
  4: Success,
  // 订单取消
  5: Cancel,
  // 投递异常
  9: ErrorDaDa,
  10: Success,
  // 骑士到店
  100: DadaGoStore
}
@connect(({ colors, sys }) => ({
  colors: colors.current,
  pointName: sys.pointName,
  priceSetting: sys.priceSetting
}))
export default class TradeDetail extends Component {
  $instance = getCurrentInstance()
  constructor(props) {
    super(props)

    this.state = {
      info: null,
      timer: null,
      payLoading: false,
      sessionFrom: '',
      interval: null,
      webSocketIsOpen: false,
      restartOpenWebsoect: true,
      // selections:[],
      scrollIntoView: 'order-0',
      cancelData: {},
      tradeInfo: {},
      showQRcode: false,
      distributor: {}
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  componentDidShow() {
    this.fetch()
  }

  isPointitemGood() {
    const options = this.$instance.router.params
    return options.type === 'pointitem'
  }

  calcTimer(totalSec) {
    let remainingSec = totalSec
    const dd = Math.floor(totalSec / 24 / 3600)
    remainingSec -= dd * 3600 * 24
    const hh = Math.floor(remainingSec / 3600)
    remainingSec -= hh * 3600
    const mm = Math.floor(remainingSec / 60)
    remainingSec -= mm * 60
    const ss = Math.floor(remainingSec)

    return {
      dd,
      hh,
      mm,
      ss
    }
  }

  async fetch() {
    const { id } = this.$instance.router.params
    const data = await api.trade.detail(id)
    let sessionFrom = ''
    const pickItem = {
      order_id: 'order_id',
      item_id: 'id',
      good_id: 'item_id',
      // aftersales_status: ({ aftersales_status }) => AFTER_SALE_STATUS[aftersales_status],
      delivery_code: 'delivery_code',
      delivery_corp: 'delivery_corp',
      delivery_name: 'delivery_corp_name',
      delivery_status: 'delivery_status',
      delivery_type: 'delivery_type',
      delivery_time: 'delivery_time',
      aftersales_status: 'aftersales_status',
      pic_path: 'pic',
      title: 'item_name',
      type: 'type',
      delivery_status: 'delivery_status',
      origincountry_name: 'origincountry_name',
      origincountry_img_url: 'origincountry_img_url',
      price: ({ total_fee }) => (total_fee / 100).toFixed(2),
      total_fee_new: ({ total_fee_new }) => (total_fee_new / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2),
      point: 'item_point',
      item_point: 'item_point',
      num: 'num',
      left_aftersales_num: 'left_aftersales_num',
      item_spec_desc: 'item_spec_desc',
      order_item_type: 'order_item_type',
      show_aftersales: 'show_aftersales',
      distributor_id: 'distributor_id'
    }
    const info = pickBy(data.orderInfo, {
      tid: 'order_id',
      created_time_str: ({ create_time }) => formatDateTime(create_time * 1000),
      update_time_str: ({ update_time }) => formatDateTime(update_time * 1000),
      auto_cancel_seconds: 'auto_cancel_seconds',
      receiver_name: 'receiver_name',
      receiver_mobile: 'receiver_mobile',
      receiver_state: 'receiver_state',
      estimate_get_points: 'estimate_get_points',
      discount_fee: ({ discount_fee }) => (+discount_fee / 100).toFixed(2),
      point_fee: ({ point_fee }) => (+point_fee / 100).toFixed(2),
      point_use: 'point_use',
      mobile: 'mobile',
      dada: ({ dada }) => {
        console.log('dada')
        console.log(dada)
        return dada
      },
      receiver_city: 'receiver_city',
      receiver_district: 'receiver_district',
      receiver_address: 'receiver_address',
      status_desc: 'order_status_msg',
      delivery_code: 'delivery_code',
      delivery_name: 'delivery_corp_name',
      delivery_type: 'delivery_type',
      delivery_status: 'delivery_status',
      pay_status: 'pay_status',
      distributor_id: 'distributor_id',
      receipt_type: 'receipt_type',
      ziti_status: 'ziti_status',
      qrcode_url: 'qrcode_url',
      delivery_corp: 'delivery_corp',
      order_type: 'order_type',
      order_status_msg: 'order_status_msg',
      order_status_des: 'order_status_des',
      order_class: 'order_class',
      is_all_delivery: 'is_all_delivery',
      latest_aftersale_time: 'latest_aftersale_time',
      remark: 'remark',
      type: 'type',
      is_shopscreen: 'is_shopscreen',
      is_logistics: 'is_split',
      total_tax: ({ total_tax }) => (+total_tax / 100).toFixed(2),
      item_fee: ({ item_fee }) => (+item_fee / 100).toFixed(2),
      total_fee: ({ total_fee }) => (+total_fee / 100).toFixed(2),
      coupon_discount: ({ coupon_discount }) => (+coupon_discount / 100).toFixed(2),
      freight_fee: ({ freight_fee }) => (+freight_fee / 100).toFixed(2),
      freight_type: 'freight_type',
      totalpayment: ({ total_fee }) => (+Number(total_fee) / 100).toFixed(2),
      payment: ({ pay_type, total_fee }) =>
        pay_type === 'point' ? Math.floor(total_fee) : (+total_fee / 100).toFixed(2), // 积分向下取整
      pay_type: 'pay_type',
      pay_channel: 'pay_channel',
      pickupcode_status: 'pickupcode_status',
      invoice_content: 'invoice.content',
      delivery_status: 'delivery_status',
      point: 'point',
      item_point: pickItem.item_point,
      can_apply_aftersales: 'can_apply_aftersales',
      status: ({ order_status }) => resolveOrderStatus(order_status),
      orders: ({ items = [], logistics_items = [], is_split }) =>
        pickBy(is_split ? logistics_items : items, pickItem),
      log_orders: ({ items = [] }) => pickBy(items, pickItem),
      can_apply_cancel: 'can_apply_cancel',
      market_fee: ({ market_fee }) => market_fee / 100,
      item_fee_new: ({ item_fee_new }) => item_fee_new / 100,
      promotion_discount: ({ promotion_discount }) => promotion_discount / 100
    })

    const ziti = pickBy(data.distributor, {
      store_name: 'store_name',
      store_address: 'store_address',
      store_name: 'store_name',
      hour: 'hour',
      phone: 'phone'
    })

    const cancelData = data.cancelData

    const tradeInfo = data.tradeInfo

    if (info.receipt_type == 'ziti' && info.ziti_status === 'PENDING') {
      const { qrcode_url, pickup_code } = await api.trade.zitiCode({ order_id: id })
      this.setState(
        {
          qrcode: qrcode_url,
          pickup_code: pickup_code
        },
        () => {
          const interval = setInterval(async () => {
            const { qrcode_url, pickup_code } = await api.trade.zitiCode({ order_id: id })
            this.setState({
              qrcode: qrcode_url,
              pickup_code: pickup_code
            })
          }, 60000)

          this.setState(
            {
              interval
            },
            () => {
              this.zitiWebsocket()
            }
          )
        }
      )
    }

    let timer = null
    if (info.auto_cancel_seconds) {
      timer = this.calcTimer(info.auto_cancel_seconds)
      this.setState({
        timer
      })
    }

    const infoStatus = (info.status || '').toLowerCase()
    if (info.auto_cancel_seconds <= 0 && info.order_status_des === 'NOTPAY') {
      info.status = 'TRADE_CLOSED'
      info.order_status_msg = '已取消'
    }
    info.status_img = `ico_${infoStatus === 'trade_success' ? 'wait_rate' : infoStatus}.png`

    sessionFrom += '{'
    if (Taro.getStorageSync('userinfo')) {
      sessionFrom += `"nickName": "${Taro.getStorageSync('userinfo').username}", `
    }
    sessionFrom += `"商品": "${info.orders[0].title}"`
    sessionFrom += `"订单号": "${info.orders[0].order_id}"`
    sessionFrom += '}'
    this.setState({
      info,
      sessionFrom,
      ziti,
      cancelData,
      tradeInfo,
      distributor: data.distributor
    })
  }

  handleCopy = async () => {
    const { info } = this.state
    const msg = `收货人：${info.receiver_name} ${info.receiver_mobile}
收货地址：${info.receiver_state}${info.receiver_city}${info.receiver_district}${info.receiver_address}
订单编号：${info.tid}
创建时间：${info.created_time_str}
`
    await copyText(msg)
  }

  async handlePay() {
    const { info } = this.state

    // this.setState({
    //   payLoading: true
    // })

    // const { tid: order_id, order_type, pay_type } = info
    // const paymentParams = {
    //   pay_type,
    //   order_id,
    //   order_type
    // }
    // debugger

    // const config = await api.cashier.getPayment(paymentParams)

    // this.setState({
    //   payLoading: false
    // })
    const { tid: order_id, order_type, pay_type, pay_channel, activity_type } = info
    if (isWxWeb) {
      Taro.navigateTo({
        url: `/pages/cart/cashier-weapp?order_id=${order_id}`
      })
      return
    }


    let payErr
    try {
      const params = {
        activityType: activity_type,
        pay_channel: pay_channel,
        pay_type: pay_type
      }
      const orderInfo = {
        order_id,
        order_type: order_type,
        pay_type
      }
      const paymentFn = usePayment()
      paymentFn.cashierPayment(params, orderInfo)
    } catch(e) {
      console.error(e)
      payErr = e
    }
    // try {

    //   if (isAPP()) {
    //     const AppPayType = {
    //       alipayapp: 'alipay',
    //       wxpayapp: 'wxpay'
    //     }
    //     try {
    //       await Taro.SAPPPay.payment({
    //         id: AppPayType[pay_type],
    //         order_params: config.config
    //       })
    //     } catch (e) {
    //       console.error(e)
    //       debugger
    //       payErr = e
    //     }
    //   } else {
    //     // const resObj = await payPlatform(config)
    //     debugger
    //     const { cashierPayment } = usePayment()
    //     cashierPayment(params, orderInfo)
    //     payErr = resObj.payErr
    //     // 支付上报
    //     log.debug(`[order pay]: `, resObj.payRes)
    //   }
    // } catch (e) {
    //   payErr = e
    //   if (e.errMsg.indexOf('cancel') < 0) {
    //     Taro.showToast({
    //       title: e.err_desc || e.errMsg || '支付失败',
    //       icon: 'none'
    //     })
    //   } else {
    //     Tracker.dispatch('CANCEL_PAY', {
    //       ...info,
    //       item_fee: parseInt(info.item_fee) * 100,
    //       total_fee: parseInt(info.total_fee) * 100,
    //       ...config,
    //       timeStamp: config.order_info.create_time
    //     })
    //   }
    // }
    // debugger
    // if (!payErr) {
    //   await Taro.showToast({
    //     title: '支付成功',
    //     icon: 'success'
    //   })

    //   const { fullPath } = getCurrentRoute(this.$instance.router)
    //   Taro.redirectTo({
    //     url: fullPath
    //   })
    // }
  }

  async handleClickBtn(type, e) {
    e.stopPropagation()
    const { info } = this.state
    if (type === 'home') {
      if (this.isPointitemGood()) {
        Taro.redirectTo({
          url: '/pointitem/pages/list'
        })
        return
      }
      Taro.redirectTo({
        url: process.env.APP_HOME_PAGE
      })
      return
    }

    if (type === 'pay') {
      await this.handlePay()
      return
    }

    if (type === 'cancel') {
      Taro.navigateTo({
        url: `/subpage/pages/trade/cancel?order_id=${info.tid}`
      })
      return
    }

    if (type === 'confirm') {
      const { confirm } = await Taro.showModal({
        title: '确认收货？',
        content: ''
      })
      if (confirm) {
        await api.trade.confirm(info.tid)
        const { fullPath } = getCurrentRoute(this.$instance.router)
        Taro.redirectTo({
          url: fullPath
        })
      }
      return
    }
    if (type === 'aftersales') {
      Taro.navigateTo({
        url: `/subpage/pages/trade/after-sale-detail?id=${info.tid}`
      })
      return
    }
  }

  async handleClickRefund(type, item_id) {
    const {
      info: { tid: order_id }
    } = this.state

    if (type === 'refund') {
      Taro.navigateTo({
        url: `/subpage/pages/trade/refund?order_id=${order_id}&item_id=${item_id}`
      })
    } else if (type === 'refundDetail') {
      Taro.navigateTo({
        url: `/subpage/pages/trade/refund-detail?order_id=${order_id}&item_id=${item_id}`
      })
    }
  }

  handleClickDelivery = () => {
    Taro.navigateTo({
      url: `/subpage/pages/trade/delivery-info?order_type=${this.state.info.order_type}&order_id=${this.state.info.tid}&delivery_code=${this.state.info.delivery_code}&delivery_corp=${this.state.info.delivery_corp}&delivery_name=${this.state.info.delivery_name}`
    })
  }

  handleClickCopy = (val) => {
    copyText(val)
    Taro.showToast({
      title: '复制成功',
      icon: 'none'
    })
  }

  countDownEnd = () => {
    this.fetch()
  }

  zitiWebsocket = () => {
    const { id } = this.$instance.router.params
    const { webSocketIsOpen, restartOpenWebsoect } = this.state
    // websocket 开始
    if (!webSocketIsOpen) {
      const token = S.getAuthToken()
      Taro.connectSocket({
        url: process.env.APP_WEBSOCKET,
        header: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`,
          'guard': 'h5api',
          'x-wxapp-sockettype': 'orderzitimsg'
        },
        method: 'GET'
      }).then((task) => {
        task.onOpen(() => {
          this.setState({
            webSocketIsOpen: true
          })
        })
        task.onError(() => {
          this.setState({
            webSocketIsOpen: false
          })
        })
        task.onMessage((res) => {
          if (res.data === '401001') {
            Taro.showToast({
              title: '未登录，请登录后再试',
              icon: 'none'
            })
            this.setState(
              {
                webSocketIsOpen: false
              },
              () => {
                setTimeout(() => {
                  Taro.redirectTo({
                    url: '/subpages/member/index'
                  })
                }, 700)
              }
            )
          } else {
            const result = JSON.parse(res.data)
            if (result.status === 'success') {
              Taro.showToast({
                title: '核销成功',
                icon: 'none'
              })
              setTimeout(() => {
                this.fetch()
              }, 700)
            }
          }
        })
        task.onClose(() => {
          this.setState({
            webSocketIsOpen: false
          })
          if (restartOpenWebsoect) {
            this.restartOpenWebsocket()
          }
        })
      })
    }
  }
  handleLookDelivery = (value) => {
    let { info } = this.state
    Taro.navigateTo({
      url: `/subpage/pages/trade/split-bagpack?order_type=${info.order_type}&order_id=${info.tid}`
    })
  }
  restartOpenWebsocket = () => {
    const { restartOpenWebsoect } = this.state
    this.setState(
      {
        restartOpenWebsoect: false
      },
      () => {
        const token = S.getAuthToken()
        Taro.connectSocket({
          url: process.env.APP_WEBSOCKET,
          header: {
            'content-type': 'application/json',
            'x-wxapp-session': token,
            'x-wxapp-sockettype': 'orderzitimsg'
          },
          method: 'GET'
        }).then((task) => {
          task.onOpen(() => {
            this.setState({
              restartOpenWebsoect: true
            })
          })
        })
      }
    )
  }

  // 发送验证码
  sendCode = async () => {
    Taro.showLoading({
      title: '发送中',
      mask: true
    })
    const { info } = this.state
    const res = await api.trade.sendCode(info.tid)
    Taro.showToast({
      title: `${res.status ? '发送成功' : '发送失败'}`,
      icon: 'none'
    })
  }

  scrollInto = (id) => {
    this.setState({
      scrollIntoView: id
    })
  }

  // 拨打电话
  callDada = (mobile) => {
    Taro.makePhoneCall({
      phoneNumber: mobile
    })
  }

  // 复制orderid
  copyOrderId = (orderid) => {
    copyText(orderid)
    Taro.showToast({
      title: '复制成功',
      icon: 'none'
    })
  }

  handleImgClick = (val) => {
    this.setState({
      showQRcode: val
    })
  }

  computedPayType = () => {
    const {
      info: { pay_type }
    } = this.state
    if (isAlipay) {
      return '支付宝'
    } else if (pay_type === PAYTYPE.ALIH5) {
      return '支付宝'
    } else {
      return '微信'
    }
  }

  render() {
    const { colors } = this.props
    const {
      info,
      ziti,
      qrcode,
      timer,
      payLoading,
      scrollIntoView,
      cancelData,
      tradeInfo,
      showQRcode,
      pickup_code,
      distributor
    } = this.state

    if (!info) {
      return <Loading></Loading>
    }

    console.log('==tradeInfo==>', tradeInfo)

    //订单未支付
    const NOT_PAY = tradeInfo && tradeInfo.tradeState === 'NOTPAY'

    //const isDhPoint = info.point_fee!=0?'point':''
    const isDhPoint = info.pay_type === 'point'
    // 是否为余额支付
    const isDeposit = info.pay_type === 'deposit'
    // const isHf = info.pay_type === 'hfpay'

    const meiqia = Taro.getStorageSync('meiqia')
    const echat = Taro.getStorageSync('echat')
    // TODO: orders 多商铺
    // const tradeOrders = resolveTradeOrders(info)

    const { order_page } = this.props.priceSetting
    const { market_price: enMarketPrice } = order_page

    return (
      <View
        className={classNames('page-trade-detail trade-detail', {
          'islog': info.is_logistics,
          'trade-close': info.status == 'TRADE_CLOSED',
          'has-navbar': isNavbar()
        })}
      >
        <SpNavBar title='订单详情' leftIconType='chevron-left' fixed='true' />

        {info.is_logistics && (
          <View className='custabs'>
            <View
              className='online'
              style={`color: ${scrollIntoView === 'order-0' ? colors.data[0].primary : '#000'}`}
              onClick={this.scrollInto.bind(this, 'order-0')}
            >
              线上订单
            </View>
            <View
              className='offline'
              style={`color: ${scrollIntoView === 'order-1' ? colors.data[0].primary : '#000'}`}
              onClick={this.scrollInto.bind(this, 'order-1')}
            >
              线下订单
            </View>
          </View>
        )}

        <ScrollView scroll-y className='scroll-view' scrollIntoView={scrollIntoView}>
          <View className='trade-detail-header' id='order-0'>
            <View className='trade-detail-waitdeliver'>
              {info.is_logistics && <View className='oneline'>线上订单</View>}
              {info.status === 'WAIT_BUYER_PAY' && (
                <View>
                  该订单将为您保留
                  <AtCountdown
                    format={{ hours: ':', minutes: ':', seconds: '' }}
                    hours={timer.hh}
                    minutes={timer.mm}
                    seconds={timer.ss}
                    onTimeUp={this.countDownEnd.bind(this)}
                  />
                  分钟
                </View>
              )}
              {info.status !== 'WAIT_BUYER_PAY' && (
                <View className='delivery-infos'>
                  <View className='delivery-infos__status'>
                    <View
                      className={`delivery-infos__text text-status ${
                        info.receipt_type === 'dada' && info.dada.dada_status === 9 && 'red'
                      }`}
                    >
                      {info.order_status_msg}
                      {info.dada && info.dada.id && statusImg[info.dada.dada_status] && (
                        <Image
                          className='statusImg'
                          src={statusImg[info.dada.dada_status]}
                          mode='aspectFill'
                        />
                      )}
                    </View>
                    {(!info.dada || !info.dada.id) && (
                      <Text className='delivery-infos__text'>
                        {info.status === 'WAIT_SELLER_SEND_GOODS' ? '正在审核订单' : null}
                        {info.status === 'WAIT_BUYER_CONFIRM_GOODS' ? '正在派送中' : null}
                        {info.status === 'TRADE_CLOSED' ? '订单已取消' : null}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>
          {info.dada && info.dada.id && info.dada.dada_status > 1 && info.dada.dada_status !== 5 && (
            <View className='dadaInfo'>
              <View className='name'>
                <Image
                  src={require('../../assets/dada3.png')}
                  mode='aspectFill'
                  className='avatar'
                />
                <View>骑手：{info.dada.dm_name} </View>
                <View
                  className='iconfont icon-dianhua'
                  onClick={this.callDada.bind(this, info.dada.dm_mobile)}
                ></View>
              </View>
              <View className='tip'>本单由达达同城为您服务</View>
            </View>
          )}
          {info.receipt_type === 'ziti' && !info.is_logistics && (
            <View className='ziti-content'>
              {info.status === 'WAIT_SELLER_SEND_GOODS' && info.ziti_status === 'PENDING' && (
                <View
                  onClick={() => {
                    this.handleImgClick(true)
                  }}
                >
                  <Image className='ziti-qrcode' src={qrcode} />
                  {info.pickupcode_status && (
                    <View>
                      <View className='num-code'>{pickup_code}</View>
                      {/* <View
                          className='sendCode'
                          onClick={this.sendCode.bind(this)}
                        >
                          发送提货码
                        </View> */}
                      <View className='sendCodeTips'>提货时请出告知店员提货验证码</View>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
          <View className='trade-detail-address'>
            {((info.dada && info.dada.id) ||
              (info.receipt_type === 'ziti' && !info.is_logistics)) && (
              <View className={`store ${info.dada && info.dada.id ? 'border' : ''}`}>
                <Text
                  className={`iconfont ${
                    info.receipt_type === 'dada' ? 'icon-shangjiadizhi-01' : 'icon-dizhi-01'
                  }`}
                ></Text>
                <View>
                  <View className='storeName'>{ziti.store_name}</View>
                  <View className='storeAddress'>{ziti.store_address}</View>
                  <View className='storeHour'>
                    <Text className='title'>营业时间：</Text>
                    {ziti.hour}
                  </View>
                  <View className='storeMobile'>
                    <Text className='title'>门店电话：</Text>
                    {ziti.phone}
                    <View
                      className='iconfont icon-dianhua'
                      onClick={this.callDada.bind(this, ziti.phone)}
                    ></View>
                  </View>
                </View>
              </View>
            )}
            {((info.dada && info.dada.id) || info.receipt_type === 'logistics') && (
              <View className='address-receive'>
                <Text
                  className={`iconfont ${
                    info.receipt_type === 'dada' ? 'icon-shouhuodizhi-01' : 'icon-dizhi-01'
                  }`}
                ></Text>
                <View className='info-trade'>
                  <Text className='address-detail'>
                    {info.receiver_state}
                    {info.receiver_city}
                    {info.receiver_district}
                    {info.receiver_address}
                  </Text>
                  <View className='user-info-trade'>
                    <Text className='receiverName'>{info.receiver_name}</Text>
                    {!this.isPointitemGood() && <Text>{info.receiver_mobile}</Text>}
                  </View>
                </View>
              </View>
            )}
          </View>

          <View className='trade-detail-goods'>
            {VERSION_PLATFORM && (
              <SpNewShopItem info={distributor} canJump inOrderDetail hasLogo={false} />
            )}
            <View className='line'>
              <View className='left'>订单号：</View>
              <View className='right'>
                {info.tid}
                <Text className='fuzhi' onClick={this.copyOrderId.bind(this, info.tid)}>
                  复制
                </Text>
              </View>
            </View>
            <DetailItem info={info} isPointitem={this.isPointitemGood()} />
          </View>
          {info.is_logistics && (
            <View className='logConfirm'>
              {info.status === 'WAIT_BUYER_CONFIRM_GOODS' &&
                (info.is_all_delivery ||
                  (!info.is_all_delivery && info.delivery_status === 'DONE')) && (
                  <View
                    className='btn'
                    style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                    onClick={this.handleClickBtn.bind(this, 'confirm')}
                  >
                    确认收货
                  </View>
                )}
            </View>
          )}
          {info.is_logistics && (
            <View className='screenZiti' id='order-1'>
              <View className='trade-detail-header' style={`background: ${colors.data[0].primary}`}>
                <View className='trade-detail-waitdeliver column'>
                  <View className='line'>线下订单</View>
                  <View className='line'>销售门店：{ziti.store_name}</View>
                  <View className='line'>购买者：{info.mobile}</View>
                </View>
              </View>
              <View className='trade-detail-goods'>
                <DetailItem info={info} showType='log_orders' />
              </View>
            </View>
          )}

          <View className='trade-money'>
            {/* <View>
              总计：
              {this.isPointitemGood() ? (
                <Text className='trade-money__point'>
                  {info.point} {this.props.pointName}
                  {info.order_class === 'pointsmall' &&
                    info.freight_fee != 0 &&
                    info.freight_fee > 0 &&
                    info.freight_type !== 'point' && <Text class='cash'>+ {info.freight_fee}</Text>}
                </Text>
              ) : (
                <Text className='trade-money__num'>￥{info.totalpayment}</Text>
              )}
            </View> */}
            {!info.is_logistics &&
              info.can_apply_cancel != 0 &&
              (info.status === 'WAIT_BUYER_PAY' ||
                (info.status === 'WAIT_SELLER_SEND_GOODS' &&
                  info.order_status_des !== 'PAYED_WAIT_PROCESS' &&
                  info.order_status_des !== 'PAYED_PARTAIL')) &&
              (info.receipt_type !== 'dada' || (info.dada && info.dada.dada_status === 0)) && (
                <View className='cancel__btn'>
                  <View className='btn' onClick={this.handleClickBtn.bind(this, 'cancel')}>
                    取消订单
                  </View>
                </View>
              )}
          </View>
          {info.remark && (
            <View className='trade-detail-remark'>
              <View className='trade-detail-remark__header'>订单备注</View>
              <View className='trade-detail-remark__body'>{info.remark}</View>
            </View>
          )}
          <View className='trade-detail-info'>
            <View className='line'>
              <View className='left'>下单时间</View>
              <View className='right'>{info.created_time_str}</View>
            </View>
            {tradeInfo && tradeInfo.tradeState === 'SUCCESS' && (
              <View className='line'>
                <View className='left'>支付时间</View>
                <View className='right'>{tradeInfo.payDate}</View>
              </View>
            )}
            {info.status === 'TRADE_CLOSED' && (
              <View className='line'>
                <View className='left'>取消时间</View>
                <View className='right'>{info.update_time_str}</View>
              </View>
            )}
            {info.dada && info.dada.pickup_time > 0 && (
              <View className='line'>
                <View className='left'>取货时间</View>
                <View className='right'>{formatDateTime(Number(info.dada.pickup_time))}</View>
              </View>
            )}
            {info.dada && info.dada.delivered_time > 0 && (
              <View className='line'>
                <View className='left'>送达时间</View>
                <View className='right'>{formatDateTime(Number(info.dada.delivered_time))}</View>
              </View>
            )}
            {info.dada && (info.dada.dada_status === 10 || info.dada.dada_status === 4) && (
              <View className='line'>
                <View className='left'>配送时长</View>
                <View className='right red'>{info.dada.delivery_length}</View>
              </View>
            )}
            {info.invoice_content && (
              <View className='line'>
                <View className='left'>发票信息</View>
                <View className='right'>{info.invoice_content}</View>
              </View>
            )}
            {enMarketPrice && info.market_fee > 0 && (
              <View className='line'>
                <View className='left'>原价</View>
                <View className='right'>{`¥${info.market_fee}`}</View>
              </View>
            )}

            <View className='line'>
              <View className='left'>总价</View>
              <View className='right'>
                {transformTextByPoint(this.isPointitemGood(), info.item_fee_new, info.item_point)}
              </View>
            </View>
            <View className='line'>
              <View className='left'>运费</View>
              <View className='right'>
                {info.freight_type !== 'point'
                  ? `¥${info.freight_fee}`
                  : `${info.freight_fee * 100}${this.props.pointName}`}
              </View>
            </View>
            <View className='line'>
              <View className='left'>促销</View>
              <View className='right'>{`- ¥${info.promotion_discount}`}</View>
            </View>
            <View className='line'>
              <View className='left'>优惠券</View>
              <View className='right'>{`- ¥${info.coupon_discount}`}</View>
            </View>
            {info.type == '1' && (
              <View className='line'>
                <View className='left'>税费</View>
                <View className='right'>{`¥${info.total_tax}`}</View>
              </View>
            )}
            {/* {!this.isPointitemGood() && (
              <View className='line'>
                <View className='left'>优惠</View>
                <View className='right'>{`- ￥${info.discount_fee}`}</View>
              </View>
            )} */}
            {info.point_use > 0 && (
              <View className='line'>
                <View className='left'>{`${this.props.pointName}支付`}</View>
                <View className='right'>
                  {`${info.point_use} ${this.props.pointName}，抵扣: ¥${info.point_fee}`}
                </View>
              </View>
            )}
            {isDeposit && (
              <View className='line'>
                <View className='left'>支付</View>
                <View className='right'>{`¥${info.payment} 余额支付`}</View>
              </View>
            )}
            {!isDhPoint && !isDeposit && !NOT_PAY && (
              <View className='line'>
                <View className='left'>支付</View>
                <View className='right'>
                  {`¥${info.payment} ${
                    info.order_class !== 'excard' ? this.computedPayType() + '支付' : ''
                  }`}
                </View>
              </View>
            )}

            <View className='line'>
              <View className='left'>实付</View>
              <View className='right'>{`¥${info.totalpayment}`}</View>
            </View>

            {info.delivery_code && (
              <View className='line'>
                <View className='left'>物流单号</View>
                <View className='right'>
                  <Text className='info-text'>{info.delivery_code}</Text>
                  <Text className='info-text-btn' onClick={this.handleClickDelivery.bind(this)}>
                    查看物流
                  </Text>
                  <Text
                    className='iconfont icon-fuzhi info-text-btn'
                    onClick={this.handleClickCopy.bind(this, info.delivery_code)}
                  ></Text>
                </View>
              </View>
            )}
          </View>
          {cancelData.cancel_id && (
            <View className='cancelData'>
              <View className='title'>取消理由：</View>
              <View className='reason'>{cancelData.cancel_reason}</View>
            </View>
          )}
        </ScrollView>

        {info.status !== 'TRADE_CLOSED' && (
          <View className={classNames('trade-detail__footer', info.order_status_des)}>
            {
              // 立即支付
              info.status === 'WAIT_BUYER_PAY' && (
                <Button
                  className='trade-detail__footer__btn trade-detail__footer_active trade-detail__footer_allWidthBtn'
                  type='primary'
                  style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                  loading={payLoading}
                  onClick={this.handleClickBtn.bind(this, 'pay')}
                >
                  立即支付
                </Button>
              )
            }
            {
              // 申请售后
              (info.status === 'WAIT_SELLER_SEND_GOODS' ||
                (info.status === 'TRADE_SUCCESS' &&
                  (info.receipt_type !== 'dada' ||
                    info.dada.dada_status === 4 ||
                    info.dada.dada_status === 10)) ||
                (info.status === 'WAIT_BUYER_CONFIRM_GOODS' &&
                  (info.is_all_delivery || info.delivery_status == 'PARTAIL') &&
                  info.receipt_type !== 'dada')) &&
                info.can_apply_aftersales === 1 &&
                info.order_class !== 'excard' && !VERSION_IN_PURCHASE && (
                  <Button
                    className={`trade-detail__footer__btn left ${
                      info.is_logistics &&
                      'trade-detail__footer_active trade-detail__footer_allWidthBtn'
                    }`}
                    onClick={this.handleClickBtn.bind(this, 'aftersales')}
                  >
                    申请售后
                  </Button>
                )
            }
            {
              // 继续购物
              (info.status === 'WAIT_SELLER_SEND_GOODS' ||
                (info.status === 'WAIT_BUYER_CONFIRM_GOODS' &&
                  info.receipt_type === 'dada' &&
                  info.receipt_type !== 'dada') ||
                info.dada.dada_status !== 9) && (
                <View
                  className={`trade-detail__footer__btn trade-detail__footer_active right ${
                    info.order_class === 'excard' ||
                    info.can_apply_aftersales !== 1 ||
                    (info.status === 'WAIT_BUYER_CONFIRM_GOODS' && info.receipt_type === 'dada')
                      ? 'trade-detail__footer_allWidthBtn'
                      : ''
                  }`}
                  style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary};`}
                  onClick={this.handleClickBtn.bind(this, 'home')}
                >
                  继续购物
                </View>
              )
            }
            {
              // 确认收货
              info.order_class !== 'excard' &&
                info.receipt_type !== 'dada' &&
                !info.is_logistics &&
                info.status === 'WAIT_BUYER_CONFIRM_GOODS' &&
                (info.is_all_delivery ||
                  (!info.is_all_delivery && info.delivery_status === 'DONE')) && (
                  <View
                    className={`trade-detail__footer__btn trade-detail__footer_active right ${
                      info.can_apply_aftersales === 0 && 'trade-detail__footer_allWidthBtn'
                    }`}
                    style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                    onClick={this.handleClickBtn.bind(this, 'confirm')}
                  >
                    确认收货
                  </View>
                )
            }
            {
              // 联系客服
              (info.status === 'TRADE_SUCCESS' ||
                (info.receipt_type === 'dada' && info.dada.dada_status === 9)) &&
                info.order_class !== 'excard' && (
                  <View
                    className={`trade-detail__footer__btn trade-detail__footer_active right ${
                      (info.can_apply_aftersales === 0 ||
                        (info.receipt_type === 'dada' && info.dada.dada_status === 9)) &&
                      'trade-detail__footer_allWidthBtn'
                    }`}
                    style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                  >
                    {meiqia.is_open === 'true' || echat.is_open === 'true' ? (
                      <FloatMenuMeiQia
                        storeId={info.distributor_id}
                        info={{ orderId: info.order_id }}
                        isFloat={false}
                      >
                        联系客服
                      </FloatMenuMeiQia>
                    ) : (
                      <Button openType='contact' className='contact'>
                        联系客服
                      </Button>
                    )}
                  </View>
                )
            }
          </View>
        )}

        {showQRcode && (
          <View
            className='qrcode-page'
            onClick={() => {
              this.handleImgClick(false)
            }}
          >
            <View className='qrcode-bgc'>
              <Image className='qrcode' src={qrcode} />
            </View>
          </View>
        )}
      </View>
    )
  }
}
