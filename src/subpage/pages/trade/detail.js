import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCountdown } from 'taro-ui'
import { Loading, NavBar, FloatMenuMeiQia } from '@/components'
import { log, pickBy, formatDataTime, resolveOrderStatus, copyText, getCurrentRoute } from '@/utils'
import { transformTextByPoint } from '@/utils/helper'
import { Tracker } from "@/service"
import api from '@/api'
import { TracksPayed } from '@/utils/youshu'
import S from '@/spx'
import { customName } from '@/utils/point'
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
  100: DadaGoStore,
}
@connect(({ colors }) => ({
  colors: colors.current
}))

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
      // selections:[],
      scrollIntoView: 'order-0',
      cancelData: {},
      tradeInfo: {}
    }
  }

  componentWillUnmount () {
    clearInterval(this.state.interval)
  }

  componentDidShow () {
    console.log(APP_BASE_URL)
    this.fetch()
  }

  isPointitemGood() { 
    const options = this.$router.params;
    return options.type === 'pointitem';
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

  async fetch () {
    const { id } = this.$router.params
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
      item_point:'item_point',
      num: 'num',
      left_aftersales_num:'left_aftersales_num',
      item_spec_desc: 'item_spec_desc',
      order_item_type: 'order_item_type',
      show_aftersales:'show_aftersales'
    }
    const info = pickBy(data.orderInfo, {
      tid: 'order_id',
      created_time_str: ({ create_time }) => formatDataTime(create_time * 1000, ),
      update_time_str: ({ update_time }) => formatDataTime(update_time * 1000, ),
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
      is_shopscreen: 'is_shopscreen',
      is_logistics: 'is_split',
      total_tax: ({ total_tax }) => (+total_tax / 100).toFixed(2),
      item_fee: ({ item_fee }) => (+item_fee / 100).toFixed(2),
      total_fee: ({ total_fee }) => (+total_fee / 100).toFixed(2),
      coupon_discount: ({ coupon_discount }) => (+coupon_discount / 100).toFixed(2),
      freight_fee: ({ freight_fee }) => (+freight_fee / 100).toFixed(2),
      freight_type:'freight_type',
      totalpayment:({ total_fee}) =>   ((+Number(total_fee)) / 100).toFixed(2),
      payment: ({ pay_type, total_fee }) => pay_type === 'point' ? Math.floor(total_fee) : (+total_fee / 100).toFixed(2), // 积分向下取整
      pay_type: 'pay_type',
      pickupcode_status: 'pickupcode_status',
      invoice_content: 'invoice.content',
      delivery_status: 'delivery_status',
      point: 'point',
      item_point:pickItem.item_point,
      can_apply_aftersales:'can_apply_aftersales',
      status: ({ order_status }) => resolveOrderStatus(order_status),
      orders: ({ items = [], logistics_items = [], is_split  }) => pickBy((is_split ? logistics_items : items), pickItem),
      log_orders: ({ items = [] }) => pickBy(items, pickItem)
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
      ziti,
      cancelData,
      tradeInfo
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
      Tracker.dispatch("ORDER_PAY", {
        ...info,
        item_fee: info.item_fee * 100,
        total_fee: info.total_fee * 100,
        ...config,
        timeStamp:config.order_info.create_time,
      }); 
      const payRes = await Taro.requestPayment(config)
      // 支付上报
     
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
          total_fee: parseInt(info.total_fee) * 100,
          ...config,
          timeStamp:config.order_info.create_time
        });
      }
    }

    if (!payErr) {

      TracksPayed(info,{...config,timeStamp:config.order_info.create_time})

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

  async handleClickBtn (type, e) {
    e.stopPropagation()
    const { info } = this.state
    if (type === 'home') {
      if(this.isPointitemGood()){
        Taro.redirectTo({
          url: "/pointitem/pages/list"
        });
        return ;
      }
      Taro.redirectTo({
        url: APP_HOME_PAGE
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
        const { fullPath } = getCurrentRoute(this.$router)
        Taro.redirectTo({
          url: fullPath
        })
      }
      return
    }
    if(type==="aftersales"){
        Taro.navigateTo({
          url: `/subpage/pages/trade/after-sale-detail?id=${info.tid}`
        })
        return
    }
  }

  async handleClickRefund (type, item_id) {
    const { info: { tid: order_id } } = this.state

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
            Taro.showToast({
              title: '未登录，请登录后再试',
              icon: 'none'
            })
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
    Taro.setClipboardData({
      data: orderid
    })
  }

  render () {
    const { colors } = this.props
    const { info, ziti, qrcode, timer, payLoading, scrollIntoView, cancelData, tradeInfo } = this.state

    console.log("----Tradedetail---",info);
    console.log("----isPointitemGood---",this.isPointitemGood());

    if (!info) {
      return <Loading></Loading>
    }
    
    //const isDhPoint = info.point_fee!=0?'point':''
    const isDhPoint = info.pay_type === 'point'
    // 是否为余额支付
    const isDeposit = info.pay_type === 'deposit'
    // const isHf = info.pay_type === 'hfpay'

    const meiqia = Taro.getStorageSync('meiqia')
    const echat = Taro.getStorageSync('echat')
    // TODO: orders 多商铺
    // const tradeOrders = resolveTradeOrders(info)

    return (
      <View className={`trade-detail ${info.is_logistics && 'islog'} ${info.status !== 'TRADE_CLOSED' && 'paddingBottom'}`}>
        <NavBar title='订单详情' leftIconType='chevron-left' fixed='true' />
        {
          info.is_logistics && <View className='custabs'>
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
        }
        <ScrollView
          scroll-y
          className='content'
          scrollIntoView={scrollIntoView}
        >
          <View className='trade-detail-header' id='order-0'>
            <View className='trade-detail-waitdeliver'>
              {info.is_logistics && <View className='oneline'>线上订单</View>}
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
                <View className='delivery-infos'>
                  <View className='delivery-infos__status'>
                    <View className={`delivery-infos__text text-status ${(info.receipt_type === 'dada' && info.dada.dada_status === 9) && 'red'}`}>
                      {info.order_status_msg}
                      {
                        (info.dada && info.dada.id && statusImg[info.dada.dada_status]) && <Image
                          className='statusImg'
                          src={statusImg[info.dada.dada_status]}
                          mode='aspectFill'
                        />
                      }
                    </View>
                    {
                      (!info.dada || !info.dada.id) &&  <Text className='delivery-infos__text'>
                        {info.status === "WAIT_SELLER_SEND_GOODS"
                          ? "正在审核订单"
                          : null}
                        {info.status === "WAIT_BUYER_CONFIRM_GOODS"
                          ? "正在派送中"
                          : null}
                        {info.status === "TRADE_CLOSED" ? "订单已取消" : null}
                      </Text>
                    }
                  </View>
                </View>
              )}
            </View>
          </View>
          {
            (info.dada && info.dada.id && (info.dada.dada_status > 1 && info.dada.dada_status !==5)) && <View className='dadaInfo'>
              <View className='name'>
                <Image src={require('../../assets/dada3.png')} mode='aspectFill' className='avatar' />
                <View>骑手：{ info.dada.dm_name } </View>
                <View className='iconfont icon-dianhua' onClick={this.callDada.bind(this, info.dada.dm_mobile)}></View>
              </View>
              <View className='tip'>本单由达达同城为您服务</View>
            </View>
          }
          {info.receipt_type === "ziti" && !info.is_logistics && (
            <View className='ziti-content'>
              {info.status === "WAIT_SELLER_SEND_GOODS" &&
                info.ziti_status === "PENDING" && (
                  <View>
                    <Image className='ziti-qrcode' src={qrcode} />
                    {info.pickupcode_status && (
                      <View>
                        <View
                          className='sendCode'
                          onClick={this.sendCode.bind(this)}
                        >
                          发送提货码
                        </View>
                        <View className='sendCodeTips'>
                          提货时请出告知店员提货验证码
                        </View>
                      </View>
                    )}
                  </View>
                )}
            </View>
          )}
          <View className='trade-detail-address'>
            {
              ((info.dada && info.dada.id) || (info.receipt_type === "ziti" && !info.is_logistics)) && <View className={`store ${info.dada && info.dada.id ? 'border' : ''}`}>
                <Text className={`iconfont ${info.receipt_type === 'dada' ? 'icon-shangjiadizhi-01' : 'icon-dizhi-01'}`}></Text>
                <View>
                  <View className='storeName'>{ziti.store_name}</View>
                  <View className='storeAddress'>{ziti.store_address}</View>                    
                  <View className='storeHour'><Text className='title'>营业时间：</Text>{ziti.hour}</View>
                  <View className='storeMobile'>
                    <Text className='title'>门店电话：</Text>
                    {ziti.phone}
                    <View className='iconfont icon-dianhua' onClick={this.callDada.bind(this, ziti.phone)}></View>
                    </View>
                </View>
              </View>
            }
            {
              ((info.dada && info.dada.id) || (info.receipt_type === "logistics")) && <View className='address-receive'>
                <Text className={`iconfont ${info.receipt_type === 'dada' ? 'icon-shouhuodizhi-01' : 'icon-dizhi-01'}`}></Text>
                <View className='info-trade'>
                  <Text className='address-detail'>
                    {info.receiver_state}{info.receiver_city}{info.receiver_district}{info.receiver_address}
                  </Text>                    
                  <View className='user-info-trade'>
                    <Text className='receiverName'>{ info.receiver_name }</Text>
                    {!this.isPointitemGood() && <Text>{info.receiver_mobile}</Text>}
                  </View>
                </View>
              </View>
            }
          </View>

          <View className='trade-detail-goods'>
            <View className='line'>
              <View className='left'>订单号：</View>
              <View className='right'>
                { info.tid }
                <Text className='fuzhi' onClick={this.copyOrderId.bind(this, info.tid)}>复制</Text>
              </View>
            </View>
            <DetailItem 
              info={info}
              isPointitem={this.isPointitemGood()}
            />
          </View>
          {
            info.is_logistics && <View className='logConfirm'>
              {info.status === "WAIT_BUYER_CONFIRM_GOODS" && (info.is_all_delivery || (!info.is_all_delivery && info.delivery_status === 'DONE')) && (
                  <View
                    className='btn'
                    style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                    onClick={this.handleClickBtn.bind(this, "confirm")}
                  >
                    确认收货
                  </View>
              )}
            </View>
          }
          {
            info.is_logistics && <View className='screenZiti' id='order-1'>
              <View
                className='trade-detail-header'
                style={`background: ${colors.data[0].primary}`}
              >
                <View className='trade-detail-waitdeliver column'>
                  <View className='line'>线下订单</View>
                  <View className='line'>销售门店：{ ziti.store_name }</View>
                  <View className='line'>购买者：{ info.mobile }</View>
                </View>
              </View>
              <View className='trade-detail-goods'>
                <DetailItem 
                  info={info}
                  showType='log_orders'
                />
              </View>
            </View>
          }

          <View className='trade-money'>
            <View>
              总计：
              {
                this.isPointitemGood() ?
                  <Text className='trade-money__point'>
                    { info.point } { customName("积分") } 
                    {
                      (info.order_class==='pointsmall') &&
                      info.freight_fee!=0 &&
                      info.freight_fee > 0 &&
                      info.freight_type!=="point" &&
                      <Text class='cash'>+ {info.freight_fee}</Text>
                    }
                  </Text> : 
                  <Text className='trade-money__num'>￥{ info.totalpayment }</Text>
              }
            </View>
            {
              !info.is_logistics &&
              (info.status === "WAIT_BUYER_PAY" ||
              (info.status === "WAIT_SELLER_SEND_GOODS" && 
              info.order_status_des !== "PAYED_WAIT_PROCESS" && info.order_status_des !== "PAYED_PARTAIL")) &&
              (info.receipt_type !== 'dada' || (info.dada && info.dada.dada_status === 0)) && <View
                className='cancel__btn'
              >
                <View className='btn' onClick={this.handleClickBtn.bind(this, "cancel")}>
                  取消订单
                </View>
              </View>
            }
          </View>
          {info.remark && (
            <View className='trade-detail-remark'>
              <View className='trade-detail-remark__header'>订单备注</View>
              <View className='trade-detail-remark__body'>{ info.remark }</View>
            </View>
          )}
          <View className='trade-detail-info'>
            <View className='line'>
              <View className='left'>下单时间</View>
              <View className='right'>
                { info.created_time_str }
              </View>
            </View>
            {
              (tradeInfo && tradeInfo.tradeState === 'SUCCESS') && <View className='line'>
                <View className='left'>支付时间</View>
                <View className='right'>
                  { tradeInfo.payDate }
                </View>
              </View>
            }
            {
              info.status === 'TRADE_CLOSED' && <View className='line'>
                <View className='left'>取消时间</View>
                <View className='right'>
                  { info.update_time_str }
                </View>
              </View>
            }
            {
              (info.dada && info.dada.pickup_time) && <View className='line'>
                <View className='left'>取货时间</View>
                <View className='right'>
                  { formatDataTime(Number(info.dada.pickup_time)) }
                </View>
              </View> 
            }
            {
              (info.dada && info.dada.delivered_time) && <View className='line'>
                <View className='left'>送达时间</View>
                <View className='right'>
                  { formatDataTime(Number(info.dada.delivered_time)) }
                </View>
              </View>            
            }
            {
              (info.dada && (info.dada.dada_status === 10 || info.dada.dada_status === 4)) && <View className='line'>
                <View className='left'>配送时长</View>
                <View className='right red'>
                  { info.dada.delivery_length }
                </View>
              </View>            
            }
            {
              info.invoice_content && <View className='line'>
                <View className='left'>发票信息</View>
                <View className='right'>
                  { info.invoice_content }
                </View>
              </View>
            }
            <View className='line'>
              <View className='left'>商品金额</View>
              <View className='right'>
                { transformTextByPoint(this.isPointitemGood(),info.item_fee,info.item_point) }
              </View>
            </View>
            <View className='line'>
              <View className='left'>运费</View>
              <View className='right'>
                { info.freight_type!=="point"?`¥ ${info.freight_fee}`:`${info.freight_fee*100}${customName("积分")}` }
              </View>
            </View>
            {
              info.type == '1' && <View className='line'>
                <View className='left'>税费</View>
                <View className='right'>
                  ￥{ info.total_tax }
                </View>
              </View>
            }            
            {
              !this.isPointitemGood() && <View className='line'>
                <View className='left'>优惠</View>
                <View className='right'>
                  -￥{ info.discount_fee }
                </View>
              </View>
            }            
            {
              info.point_use > 0 && <View className='line'>
                <View className='left'>{ customName("积分支付") }</View>
                <View className='right'>
                  { info.point_use}{customName("积分")}，抵扣：¥{info.point_fee }
                </View>
              </View>
            }
            {
              isDeposit && <View className='line'>
                <View className='left'>支付</View>
                <View className='right'>
                  ¥{info.payment} {' 余额支付'}
                </View>
              </View>
            }
            {
              !isDhPoint && !isDeposit && <View className='line'>
                <View className='left'>支付</View>
                <View className='right'>
                  ¥{info.payment} {'微信支付'}
                </View>
              </View>
            }
            {
              info.delivery_code && <View className='line'>
                <View className='left'>物流单号</View>
                <View className='right'>
                  <Text className='info-text'>{info.delivery_code}</Text>
                  <Text className='info-text-btn' onClick={this.handleClickDelivery.bind(this)}>查看物流</Text>
                  <Text className='iconfont icon-fuzhi info-text-btn' onClick={this.handleClickCopy.bind(this, info.delivery_code)}></Text>
                </View>
              </View>
            }
          </View>
          {
            cancelData.cancel_id && <View className='cancelData'>
              <View className='title'>取消理由：</View>
              <View className='reason'>
                { cancelData.cancel_reason }
              </View>
            </View>
          }
        </ScrollView>
        {
          info.status !== 'TRADE_CLOSED' && <View className='trade-detail__footer'>
            {
              // 立即支付
              info.status === 'WAIT_BUYER_PAY' && <Button
                className='trade-detail__footer__btn trade-detail__footer_active trade-detail__footer_allWidthBtn'
                type='primary'
                style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                loading={payLoading}
                onClick={this.handleClickBtn.bind(this, "pay")}
              >
              立即支付
            </Button>
            }
            {
              // 申请售后
              (((info.status === 'WAIT_SELLER_SEND_GOODS')||
              (info.status === "TRADE_SUCCESS" && (info.receipt_type !== 'dada' || info.dada.dada_status === 4 || info.dada.dada_status === 10)) ||
              (info.status === "WAIT_BUYER_CONFIRM_GOODS" && (info.is_all_delivery || (!info.is_all_delivery && info.delivery_status === 'DONE')) && info.receipt_type !== 'dada')) &&
              info.can_apply_aftersales === 1) && <Button
                className={`trade-detail__footer__btn left ${info.is_logistics && 'trade-detail__footer_active trade-detail__footer_allWidthBtn'}`}
                onClick={this.handleClickBtn.bind(this, "aftersales")}
              >
                申请售后
              </Button>
            }
            {
              // 继续购物
              (info.status === "WAIT_SELLER_SEND_GOODS" || 
              (info.status === 'WAIT_BUYER_CONFIRM_GOODS' && info.receipt_type === 'dada') &&
              info.receipt_type !== 'dada' || info.dada.dada_status !== 9) && <View
                className={`trade-detail__footer__btn trade-detail__footer_active right ${(info.can_apply_aftersales !== 1 || (info.status === 'WAIT_BUYER_CONFIRM_GOODS' && info.receipt_type === 'dada')) ? 'trade-detail__footer_allWidthBtn' : ''
                  }`}
                style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary};`}
                onClick={this.handleClickBtn.bind(this, "home")}
              >
                继续购物
              </View>
            }
            {
              // 确认收货
              (info.receipt_type !== 'dada' && !info.is_logistics && info.status === "WAIT_BUYER_CONFIRM_GOODS" && (info.is_all_delivery || (!info.is_all_delivery && info.delivery_status === 'DONE'))) && <View
                className={`trade-detail__footer__btn trade-detail__footer_active right ${info.can_apply_aftersales === 0 && 'trade-detail__footer_allWidthBtn'}`}
                style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
                onClick={this.handleClickBtn.bind(this, "confirm")}
              >
                确认收货
              </View>
            }
            {
              // 联系客服
              (info.status === "TRADE_SUCCESS" ||
              (info.receipt_type === 'dada' && info.dada.dada_status === 9)) && <View 
                className={`trade-detail__footer__btn trade-detail__footer_active right ${(info.can_apply_aftersales === 0 || (info.receipt_type === 'dada' && info.dada.dada_status === 9)) && 'trade-detail__footer_allWidthBtn'}`}
                style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
              >
                {
                  meiqia.is_open === "true" || echat.is_open === 'true' ?
                  <FloatMenuMeiQia
                    storeId={info.distributor_id}
                    info={{ orderId: info.order_id }}
                    isFloat={false}
                  >
                    联系客服
                  </FloatMenuMeiQia> :
                  <Button openType='contact' className='contact'>
                    联系客服
                  </Button>
                }
              </View>
            }
          </View>
        }
      </View>
    );
  }
}
