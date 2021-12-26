import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Button, Image, ScrollView } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtCountdown } from 'taro-ui'
import { Loading, SpToast, SpNavBar } from '@/components'
import {
  log,
  pickBy,
  formatTime,
  resolveOrderStatus,
  copyText,
  getCurrentRoute,
  classNames,
} from "@/utils";
// import { Tracker } from '@/service'
import api from '@/api'
import S from '@/spx'
import AfterDetailItem from './comps/after-detail-item'
import './after-sale-detail.scss'

@connect(({ colors, sys }) => ({
  colors: colors.current,
  pointName: sys.pointName
}))
export default class TradeDetail extends Component {
  $instance = getCurrentInstance();
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
      selections: [],
      scrollIntoView: 'order-0'
    }
  }

  componentDidShow() {
    this.fetch()
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
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
  selectionGoods(list) {
    const selected = list.filter((v) => v.is_checked)
    let params = {}
    let refund = []
    selected.map((item) => {
      params = {
        order_id: item.orders,
        id: item.item_id,
        num: item.apply_num
      }
      refund.push(params)
    })
    return refund
  }

  handleInputNumberChange = (item, val) => {
    const { info } = this.state
    info['orders'].forEach((v) => {
      v.item_id == item.item_id && (v.apply_num = val)
    })
    const _this = this
    this.setState({
      info: _this.getParamsAboutItem(info)
    })
  }

  handleCheckChange = (item_id, checked) => {
    const { info } = this.state
    info['orders'].map((item) => {
      item.item_id == item_id && (item.is_checked = checked)
    })
    const _this = this
    this.setState({
      info: _this.getParamsAboutItem(info)
    })
  }

  /** 计算每一行总值 */
  computed = (item) => {
    const newItemTotal = item.normal_unit * item.apply_num
    if (newItemTotal > 0 && newItemTotal < 1) {
      /** 如果是分数以下的值 */
      return 0
    } else if (newItemTotal >= 1) {
      return Math.floor(newItemTotal)
    } else {
      return 0
    }
  }

  /** 计算每一行总值 */
  computedInit = (item, type) => {
    /** 如果数量相等 直接返回总值 */
    if (item.left_aftersales_num === item.apply_num) {
      return item[type]
    }
  }

  getParamsAboutItem = (oldInfo, isInit = false) => { 
    const newInfo = JSON.parse(JSON.stringify(oldInfo))
    /** 是否有积分商品 */
    let is_has_point
    /** 是否有普通商品 */
    let is_has_normal
    /** 计算新的订单 */
    let newOrders

    /** 初始化时所有数值为0 */
    if (isInit) {
      is_has_point = newInfo.orders.reduce((total, item) => total + item.remain_point, 0) > 0
      is_has_normal = newInfo.orders.reduce((total, item) => total + item.remain_fee, 0) > 0

      newOrders = newInfo.orders.map((item) => ({
        ...item,
        /** 单个商品的积分 */
        point_unit: item.remain_point / item.left_aftersales_num,
        /** 单个商品的价格 */
        normal_unit: item.remain_fee / item.left_aftersales_num,
        /** 每行选中的积分 */
        selected_point_total: this.computedInit(item, 'remain_point'),
        /** 每行选中的价格 */
        selected_normal_total: this.computedInit(item, 'remain_fee')
      }))
    } else {
      is_has_point = newInfo.is_has_point
      is_has_normal = newInfo.is_has_normal

      newOrders = newInfo.orders.map((item) => ({
        ...item,
        /** 每行选中的积分 */
        selected_point_total: Math.floor(item.point_unit * item.apply_num),
        /** 每行选中的价格 */
        selected_normal_total: this.computed(item)
      }))
    }

    let total_point_money = newOrders.reduce(
      (total, i) => total + (i.is_checked ? i.selected_point_total : 0),
      0
    )

    let total_normal_money = newOrders.reduce(
      (total, i) => total + (i.is_checked ? i.selected_normal_total : 0),
      0
    )

    return Object.assign(newInfo, {
      is_has_point,
      is_has_normal,
      total_point_money,
      total_normal_money,
      orders: newOrders
    })
  }

  async fetch() {
    const { id } = this.$instance.router.params
    const data = await api.trade.detail(id)
    let sessionFrom = ''
    const pickItem = {
      order_id: 'order_id',
      item_id: 'id',
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
      price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
      point: 'item_point',
      num: 'num',
      left_aftersales_num: 'left_aftersales_num',
      item_spec_desc: 'item_spec_desc',
      order_item_type: 'order_item_type',
      show_aftersales: 'show_aftersales',
      apply_num: 'left_aftersales_num',
      point_fee: 'point_fee',
      total_fee: 'total_fee',
      remain_fee: 'remain_fee',
      remain_point: 'remain_point'
    }
    const info = pickBy(data.orderInfo, {
      tid: 'order_id',
      created_time_str: ({ create_time }) => formatTime(create_time * 1000),
      auto_cancel_seconds: 'auto_cancel_seconds',
      receiver_name: 'receiver_name',
      receiver_mobile: 'receiver_mobile',
      receiver_state: 'receiver_state',
      estimate_get_points: 'estimate_get_points',
      discount_fee: ({ discount_fee }) => (+discount_fee / 100).toFixed(2),
      point_fee: ({ point_fee }) => (+point_fee / 100).toFixed(2),
      point_use: 'point_use',
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
      mobile: 'mobile',
      is_shopscreen: 'is_shopscreen',
      is_logistics: 'is_split',
      total_tax: ({ total_tax }) => (+total_tax / 100).toFixed(2),
      item_fee: ({ item_fee }) => (+item_fee / 100).toFixed(2),
      coupon_discount: ({ coupon_discount }) => (+coupon_discount / 100).toFixed(2),
      freight_fee: ({ freight_fee }) => (+freight_fee / 100).toFixed(2),
      payment: ({ pay_type, total_fee }) =>
        pay_type === 'point' ? Math.floor(total_fee) : (+total_fee / 100).toFixed(2), // 积分向下取整
      pay_type: 'pay_type',
      pickupcode_status: 'pickupcode_status',
      invoice_content: 'invoice.content',
      delivery_status: 'delivery_status',
      point: 'point',
      status: ({ order_status }) => resolveOrderStatus(order_status),
      can_apply_aftersales: 'can_apply_aftersales',
      orders: ({ items = [], logistics_items = [], is_split }) =>
        pickBy(is_split ? logistics_items : items, pickItem),
      log_orders: ({ items = [] }) => pickBy(items, pickItem)
    })

    const ziti = pickBy(data.distributor, {
      store_name: 'store_name',
      store_address: 'store_address',
      store_name: 'store_name',
      hour: 'hour',
      phone: 'phone'
    })

    if (info.receipt_type == 'ziti' && info.ziti_status === 'PENDING') {
      const { qrcode_url } = await api.trade.zitiCode({ order_id: id })
      this.setState(
        {
          qrcode: qrcode_url
        },
        () => {
          const interval = setInterval(async () => {
            const { qrcode_url } = await api.trade.zitiCode({ order_id: id })
            this.setState({
              qrcode: qrcode_url
            })
          }, 10000)

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
    const _this = this
    this.setState({
      info: _this.getParamsAboutItem(info, true),
      sessionFrom,
      ziti
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

    this.setState({
      payLoading: true
    })

    const { tid: order_id, order_type, pay_type } = info
    const paymentParams = {
      pay_type,
      order_id,
      order_type
    }
    const config = await api.cashier.getPayment(paymentParams)

    this.setState({
      payLoading: false
    })

    let payErr
    try {
      const payRes = await Taro.requestPayment(config)
      // 支付上报
      Tracker.dispatch('ORDER_PAY', {
        ...info,
        item_fee: parseInt(info.item_fee) * 100,
        ...config
      })
      log.debug(`[order pay]: `, payRes)
    } catch (e) {
      payErr = e
      if (e.errMsg.indexOf('cancel') < 0) {
        Taro.showToast({
          title: e.err_desc || e.errMsg || '支付失败',
          icon: 'none'
        })
      } else {
        Tracker.dispatch('CANCEL_PAY', {
          ...info,
          item_fee: parseInt(info.item_fee) * 100,
          ...config
        })
      }
    }

    if (!payErr) {
      await Taro.showToast({
        title: '支付成功',
        icon: 'success'
      })

      const { fullPath } = getCurrentRoute(this.$instance.router)
      Taro.redirectTo({
        url: fullPath
      })
    }
  }

  async handleClickBtn(type, val) {
    const { info } = this.state

    if (type === 'REFUND') {
      //仅退款
      //let { info } = this.state
      let selected = this.selectionGoods(info.orders)
      if (info.is_logistics) {
        const log_selected = this.selectionGoods(info.log_orders)
        if (log_selected.length && selected.length) {
          Taro.showToast({
            title: '线上、线下订单商品只能选择一种进行售后',
            icon: 'none'
          })
          return
        }
        if (log_selected.length) {
          selected = log_selected
        }
      }
      if (!selected.length) {
        Taro.showToast({
          title: '请选择商品～',
          icon: 'none'
        })
        return
      }
      const deliverData = JSON.stringify(selected)
      Taro.navigateTo({
        url: `/subpage/pages/trade/refund?deliverData=${deliverData}&status=${type}&order_id=${info.tid}`
      })
    }
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
            S.toast('未登录，请登录后再试')
            this.setState(
              {
                webSocketIsOpen: false
              },
              () => {
                setTimeout(() => {
                  Taro.redirectTo({
                    url: '/pages/member/index'
                  })
                }, 700)
              }
            )
          } else {
            const result = JSON.parse(res.data)
            if (result.status === 'success') {
              S.toast('核销成功')
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
    Taro.showLoading('发送中')
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

  render() {
    const { colors } = this.props
    const { info, ziti, qrcode, timer, payLoading, scrollIntoView } = this.state

    if (!info) {
      return <Loading></Loading>
    }


    return (
      <View className={classNames(`trade-detail ${info.is_logistics && 'islog'}`)}>
        <SpNavBar title='售后详情' leftIconType='chevron-left' fixed='true' />
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
        <ScrollView scroll-y className='content' scrollIntoView={scrollIntoView}>
          <View
            className='trade-detail-header'
            style={`background: ${colors.data[0].primary}`}
            id='order-0'
          >
            {info.order_class === 'drug' ? (
              <View className='trade-detail-waitdeliver'>
                {info.is_logistics && <View className='oneline'>线上订单</View>}
                {info.order_status_des === 'CANCEL' ? (
                  <View>
                    <View>订单状态：</View>
                    <View>已拒绝</View>
                  </View>
                ) : (
                  <View>
                    <View>订单状态：</View>
                    <View>{info.ziti_status === 'APPROVE' ? '审核通过' : '待审核'}</View>
                  </View>
                )}
              </View>
            ) : (
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
                  <View>
                    <View></View>
                    <View className='delivery-infos'>
                      <View className='delivery-infos__status'>
                        <Text className='delivery-infos__text text-status'>
                          {info.order_status_msg}
                        </Text>
                        <Text className='delivery-infos__text'>
                          {info.status === 'WAIT_SELLER_SEND_GOODS' ? '正在审核订单' : null}
                          {info.status === 'WAIT_BUYER_CONFIRM_GOODS' ? '正在派送中' : null}
                          {info.status === 'TRADE_CLOSED' ? '订单已取消' : null}
                          {/* {info.status === "TRADE_SUCCESS" && info.receipt_type !== 'ziti' 
                              ? `物流单号：${info.delivery_code}`
                              : null} */}
                        </Text>
                      </View>
                      {/*{
                                info.status !== 'TRADE_SUCCESS' ? <Text className='delivery-infos__text'>2019-04-30 11:30:21</Text> : null
                              }*/}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
          {info.receipt_type === 'ziti' && !info.is_logistics ? (
            <View className='ziti-content'>
              {info.status === 'WAIT_SELLER_SEND_GOODS' && info.ziti_status === 'PENDING' && (
                <View>
                  <Image className='ziti-qrcode' src={qrcode} />
                  {info.pickupcode_status && (
                    <View>
                      <View className='sendCode' onClick={this.sendCode.bind(this)}>
                        发送提货码
                      </View>
                      <View className='sendCodeTips'>提货时请出告知店员提货验证码</View>
                    </View>
                  )}
                </View>
              )}
              <View className='ziti-text'>
                <View className='ziti-text-name'>{ziti.store_name}</View>
                <View>营业时间：{ziti.hour}</View>
                <View>{ziti.store_address}</View>
              </View>
            </View>
          ) : (
            <View className='trade-detail-address'>
              <View className='address-receive'>
                <Text>收货地址：</Text>
                <View className='info-trade'>
                  <View className='user-info-trade'>
                    <Text>{info.receiver_name}</Text>
                    <Text>{info.receiver_mobile}</Text>
                  </View>
                  <Text className='address-detail'>
                    {info.receiver_state}
                    {info.receiver_city}
                    {info.receiver_district}
                    {info.receiver_address}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View className='trade-detail-goods'>
            <AfterDetailItem
              info={info}
              onInputNumberChange={this.handleInputNumberChange}
              onCheckChange={this.handleCheckChange}
            />
          </View>
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
                <AfterDetailItem info={info} showType='log_orders' />
              </View>
            </View>
          )}
          {/* <View className='trade-money'>
            {info.is_has_normal && (
              <View>
                总计金额：
                <Text className='trade-money__num'>
                  ￥{(info.total_normal_money / 100).toFixed(2)}
                </Text>
              </View>
            )}
            {info.is_has_point && (
              <View>
                {`总计${}`}：
                <Text className='trade-money__num'>￥{info.total_point_money}</Text>
              </View>
            )}
          </View> */}
        </ScrollView>

        {info.can_apply_aftersales === 1 && (
          <View className='trade-detail__footer'>
            <Button
              className='trade-detail__footer__btn trade-detail__footer_active trade-detail__footer_allWidthBtn'
              style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
              onClick={this.handleClickBtn.bind(this, 'REFUND')}
            >
              申请售后
            </Button>
          </View>
        )}

        <SpToast></SpToast>
      </View>
    )
  }
}
