import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCountdown,AtButton } from 'taro-ui'
import { Loading, SpToast, NavBar, FloatMenuMeiQia } from '@/components'
import { log, pickBy, formatTime, resolveOrderStatus, copyText, getCurrentRoute } from '@/utils'
import { Tracker } from "@/service";
import api from '@/api'
import S from '@/spx'
import AfterDetailItem from './comps/after-detail-item'

import './detail.scss'
import { echatConfig } from '../../../api/user'

@connect(({ colors }) => ({
  colors: colors.current
}))

// function resolveTradeOrders (info) {
//   return info.orders.map(order => {
//     const { item_id, title, pic_path: img, total_fee: price, num } = order
//     return {
//       item_id,
//       title,
//       img,
//       price,
//       num
//     }
//   })
// }

export default class TradeDetail extends Component {
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
      selections:[],
    }
  }

  componentDidShow () {
    console.log(APP_BASE_URL)
    this.fetch()
  }

  componentWillUnmount () {
    clearInterval(this.state.interval)
  }

  calcTimer (totalSec) {
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
  selectionGoods(list){
    const selected = list.filter(v=>v.is_checked)
    let params = {}
    let refund= []
    selected.map(item=>{
      params = {
        order_id:item.orders,
        id:item.item_id,
        num:item.left_aftersales_num
      }
      refund.push(params)
    })
    return refund
  }

  async fetch () {
    const { id } = this.$router.params
    const data = await api.trade.detail(id)
    let sessionFrom = ''
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
      delivery_status:'delivery_status',
      pay_status:'pay_status',
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
      total_tax: ({ total_tax }) => (+total_tax / 100).toFixed(2),
      item_fee: ({ item_fee }) => (+item_fee / 100).toFixed(2),
      coupon_discount: ({ coupon_discount }) => (+coupon_discount / 100).toFixed(2),
      freight_fee: ({ freight_fee }) => (+freight_fee / 100).toFixed(2),
      payment: ({ pay_type, total_fee }) => pay_type === 'point' ? Math.floor(total_fee) : (+total_fee / 100).toFixed(2), // 积分向下取整
      pay_type: 'pay_type',
      pickupcode_status: 'pickupcode_status',
      invoice_content: 'invoice.content',
      delivery_status: 'delivery_status',
      point: 'point',
      status: ({ order_status }) => resolveOrderStatus(order_status),
      orders: ({ items = [] }) => pickBy(items, {
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
        left_aftersales_num:'left_aftersales_num',
        left_applay_num:'left_aftersales_num',
        item_spec_desc: 'item_spec_desc',
        order_item_type: 'order_item_type'
      })
    })

    const ziti = pickBy(data.distributor, {
      store_name: 'store_name',
      store_address: 'store_address',
      store_name: 'store_name',
      hour: 'hour',
      phone: 'phone',
    })

    if (info.receipt_type == 'ziti' && info.ziti_status === 'PENDING') {
      const { qrcode_url } = await api.trade.zitiCode({ order_id: id })
      this.setState({
        qrcode: qrcode_url
      }, () => {
        const interval = setInterval(async () => {
          const { qrcode_url } = await api.trade.zitiCode({ order_id: id })
          this.setState({
            qrcode: qrcode_url
          })
        }, 10000)

        this.setState({
          interval
        }, () => {
          this.zitiWebsocket()
        })
      })
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

  async handlePay () {
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
      Tracker.dispatch("ORDER_PAY", {
        ...info,
        item_fee: parseInt(info.item_fee) * 100,
        ...config
      });
      log.debug(`[order pay]: `, payRes)
    } catch (e) {
      payErr = e
      if (e.errMsg.indexOf('cancel') < 0) {
        Taro.showToast({
          title: e.err_desc || e.errMsg || '支付失败',
          icon: 'none'
        })
      } else {
        Tracker.dispatch("CANCEL_PAY", {
          ...info,
          item_fee: parseInt(info.item_fee) * 100,
          ...config
        });
      }
    }

    if (!payErr) {
      await Taro.showToast({
        title: '支付成功',
        icon: 'success'
      })

      const { fullPath } = getCurrentRoute(this.$router)
      Taro.redirectTo({
        url: fullPath
      })
    }
  }

  async handleClickBtn (type,val) {
    const { info } = this.state

    if (type === 'REFUND') {//仅退款
      //let { info } = this.state 
      const selected = this.selectionGoods(info.orders)
      if(!selected.length){
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
    const { id } = this.$router.params
    const { webSocketIsOpen, restartOpenWebsoect } = this.state
    // websocket 开始
    if (!webSocketIsOpen) {
      const token = S.getAuthToken()
      Taro.connectSocket({
        url: APP_WEBSOCKET_URL,
        header: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`,
          'guard': 'h5api',
          'x-wxapp-sockettype': 'orderzitimsg'
        },
        method: 'GET'
      }).then(task => {
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
            this.setState({
              webSocketIsOpen: false
            }, () => {
              setTimeout(() => {
                Taro.redirectTo({
                  url: '/pages/member/index'
                })
              }, 700)
            })
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
    this.setState({
      restartOpenWebsoect: false
    }, () => {
      const token = S.getAuthToken()
      Taro.connectSocket({
        url: APP_WEBSOCKET_URL,
        header: {
          'content-type': 'application/json',
          'x-wxapp-session': token,
          'x-wxapp-sockettype': 'orderzitimsg'
        },
        method: 'GET'
      }).then(task => {
        task.onOpen(() => {
          this.setState({
            restartOpenWebsoect: true
          })
        })
      })
    })
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

  render () {
    const { colors } = this.props
    const { info, ziti, qrcode, timer, payLoading } = this.state
    if (!info) {
      return <Loading></Loading>
    }
    console.log(info,'info');
    // TODO: orders 多商铺
    // const tradeOrders = resolveTradeOrders(info)
    console.log('info', info)
    return (
      <View className="trade-detail">
        <NavBar title="售后详情" leftIconType="chevron-left" fixed="true" />
        <View
          className="trade-detail-header"
          style={`background: ${colors.data[0].primary}`}
        >
          {info.order_class === "drug" 
          ? (
            <View className="trade-detail-waitdeliver">
              {info.order_status_des === "CANCEL" ? (
                <View>
                  <View>订单状态：</View>
                  <View>已拒绝</View>
                </View>
              ) : (
                  <View>
                    <View>订单状态：</View>
                    <View>
                      {info.ziti_status === "APPROVE" ? "审核通过" : "待审核"}
                    </View>
                  </View>
                )}
            </View>
          ) : (
              <View className="trade-detail-waitdeliver">
                {info.status === "WAIT_BUYER_PAY" && (
                  <View>
                    该订单将为您保留
                    <AtCountdown
                      format={{ hours: ":", minutes: ":", seconds: "" }}
                      hours={timer.hh}
                      minutes={timer.mm}
                      seconds={timer.ss}
                      onTimeUp={this.countDownEnd.bind(this)}
                    />
                  分钟
                </View>
              )}
              {info.status !== "WAIT_BUYER_PAY" && (
                <View>
                  <View></View>
                  <View className="delivery-infos">
                    <View className="delivery-infos__status">
                      <Text className="delivery-infos__text text-status">
                        {info.order_status_msg}
                      </Text>
                      <Text className="delivery-infos__text">
                        {info.status === "WAIT_SELLER_SEND_GOODS"
                          ? "正在审核订单"
                          : null}
                        {info.status === "WAIT_BUYER_CONFIRM_GOODS"
                          ? "正在派送中"
                          : null}
                        {info.status === "TRADE_CLOSED" ? "订单已取消" : null}
                        {info.status === "TRADE_SUCCESS" && info.receipt_type !== 'ziti' 
                          ? `物流单号：${info.delivery_code}`
                          : null}
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
        {info.receipt_type === "ziti" ? (
          <View className="ziti-content">
            {info.status === "WAIT_SELLER_SEND_GOODS" &&
              info.ziti_status === "PENDING" && (
                <View>
                  <Image className="ziti-qrcode" src={qrcode} />
                  {info.pickupcode_status && (
                    <View>
                      <View
                        className="sendCode"
                        onClick={this.sendCode.bind(this)}
                      >
                        发送提货码
                      </View>
                      <View className="sendCodeTips">
                        提货时请出告知店员提货验证码
                      </View>
                    </View>
                  )}
                </View>
              )}
            <View className="ziti-text">
              <View className="ziti-text-name">{ziti.store_name}</View>
              <View>营业时间：{ziti.hour}</View>
              <View>{ziti.store_address}</View>
            </View>
          </View>
        ) : (
            <View className="trade-detail-address">
              <View className="address-receive">
                <Text>收货地址：</Text>
                <View className="info-trade">
                  <View className="user-info-trade">
                    <Text>{info.receiver_name}</Text>
                    <Text>{info.receiver_mobile}</Text>
                  </View>
                  <Text className="address-detail">
                    {info.receiver_state}
                    {info.receiver_city}
                    {info.receiver_district}
                    {info.receiver_address}
                  </Text>
                </View>
              </View>
            </View>
          )}
        <View className="trade-detail-goods">
          <AfterDetailItem 
          info={info} 
          />
        </View>
        
        <View className="trade-money">
         <View>总计：<Text className="trade-money__num">￥{info.item_fee}</Text></View>
        </View>
        <View className="trade-detail__footer">
                <Button
                  className="trade-detail__footer__btn trade-detail__footer_active trade-detail__footer_allWidthBtn"
                  style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                  onClick={this.handleClickBtn.bind(this, "REFUND")}
                >
                  退货退款
                </Button>
              
            </View>
        <SpToast></SpToast>
      </View>
    );
  }
}
