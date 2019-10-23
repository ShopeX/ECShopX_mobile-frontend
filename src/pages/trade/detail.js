import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtButton, AtCountdown} from 'taro-ui'
import { Loading, SpCell, SpToast, FloatMenus, FloatMenuItem, Price, NavBar } from '@/components'
import { classNames, log, pickBy, formatTime, resolveOrderStatus, copyText, getCurrentRoute } from '@/utils'
import api from '@/api'
import S from '@/spx'
import { AFTER_SALE_STATUS } from '@/consts'
import DetailItem from './comps/detail-item'

import './detail.scss'

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
  constructor (props) {
    super(props)

    this.state = {
      info: null,
      timer: null,
      payLoading: false,
      sessionFrom: '',
      interval: null,
      webSocketIsOpen: false,
      restartOpenWebsoect: true
    }
  }

  componentDidMount () {
    console.log(APP_BASE_URL)
    this.fetch()
  }

  componentWillUnmount() {
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

  async fetch () {
    const { id } = this.$router.params
    const data = await api.trade.detail(id)
    let sessionFrom = ''

    const info = pickBy(data.orderInfo, {
      tid: 'order_id',
      created_time_str: ({ create_time }) => formatTime(create_time*1000),
      auto_cancel_seconds: 'auto_cancel_seconds',
      receiver_name: 'receiver_name',
      receiver_mobile: 'receiver_mobile',
      receiver_state: 'receiver_state',
      discount_fee: ({ discount_fee }) => (+discount_fee / 100).toFixed(2),
      receiver_city: 'receiver_city',
      receiver_district: 'receiver_district',
      receiver_address: 'receiver_address',
      status_desc: 'order_status_msg',
      delivery_code: 'delivery_code',
      receipt_type: 'receipt_type',
      ziti_status: 'ziti_status',
      qrcode_url: 'qrcode_url',
      delivery_corp: 'delivery_corp',
      order_type: 'order_type',
      order_status_msg: 'order_status_msg',
      order_status_des: 'order_status_des',
      order_class: 'order_class',
      item_fee: ({ item_fee }) => (+item_fee / 100).toFixed(2),
      coupon_discount: ({ coupon_discount }) => (+coupon_discount / 100).toFixed(2),
      freight_fee: ({ freight_fee }) => (+freight_fee / 100).toFixed(2),
      payment: ({ pay_type, total_fee }) => pay_type === 'dhpoint' ? Math.floor(total_fee) : (+total_fee / 100).toFixed(2), // 积分向下取整
      pay_type: 'pay_type',
      invoice_content: 'invoice.content',
      point: 'point',
      status: ({ order_status }) => resolveOrderStatus(order_status),
      orders: ({ items }) => pickBy(items, {
        order_id: 'order_id',
        item_id: 'item_id',
        // aftersales_status: ({ aftersales_status }) => AFTER_SALE_STATUS[aftersales_status],
        aftersales_status: 'aftersales_status',
        pic_path: 'pic',
        title: 'item_name',
        delivery_status: 'delivery_status',
        price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
        point: 'item_point',
        num: 'num'
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
        const interval = setInterval(async() => {
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
    if(info.auto_cancel_seconds){
      timer = this.calcTimer(info.auto_cancel_seconds)
      this.setState({
        timer
      })
    }

    const infoStatus = (info.status || '').toLowerCase()
    if(info.auto_cancel_seconds <= 0 && info.order_status_des === 'NOTPAY') {
      info.status = 'TRADE_CLOSED'
      info.order_status_msg = '已取消'
    }
    info.status_img = `ico_${infoStatus === 'trade_success' ? 'wait_rate' : infoStatus}.png`

    log.debug('[trade info] info: ', info)

    sessionFrom += '{'
    if(Taro.getStorageSync('userinfo')){
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

    const { tid: order_id, order_type } = info
    const paymentParams = {
      pay_type: 'wxpay',
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
      log.debug(`[order pay]: `, payRes)
    } catch (e) {
      payErr = e
      if (e.errMsg.indexOf('cancel') < 0) {
        Taro.showToast({
          title: e.err_desc || e.errMsg || '支付失败',
          icon: 'none'
        })
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

  async handleClickBtn (type) {
    const { info } = this.state

    if (type === 'home') {
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
        url: `/pages/trade/cancel?order_id=${info.tid}`
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
  }

  async handleClickRefund (type, item_id) {
    const { info: { tid: order_id } } = this.state

    if (type === 'refund') {
      Taro.navigateTo({
        url: `/pages/trade/refund?order_id=${order_id}&item_id=${item_id}`
      })
    } else if (type === 'refundDetail') {
      Taro.navigateTo({
        url: `/pages/trade/refund-detail?order_id=${order_id}&item_id=${item_id}`
      })
    }
  }

  handleClickDelivery = () => {
    Taro.navigateTo({
      url: `/pages/trade/delivery-info?order_type=${this.state.info.order_type}&order_id=${this.state.info.tid}&delivery_code=${this.state.info.delivery_code}&delivery_corp=${this.state.info.delivery_corp}`
    })
  }

  handleClickCopy = (val) => {
    copyText(val)
    S.toast('复制成功')
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
              setTimeout(()=>{
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

  render () {
    const { info, ziti, qrcode, timer, payLoading } = this.state
    if (!info) {
      return <Loading></Loading>
    }

    const isDhPoint = info.pay_type === 'dhpoint'

    // TODO: orders 多商铺
    // const tradeOrders = resolveTradeOrders(info)

    return (
      <View className='trade-detail'>
        <NavBar
          title='订单详情'
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className={classNames('trade-detail-header', info.status === 'WAIT_BUYER_PAY' ? 'trade-detail-header__waitpay' : '')}>
          {
            info.order_class === 'drug'
              ? <View>
                  {
                    info.order_status_des === 'CANCEL'
                      ? <View>已取消</View>
                      : <View>
                          订单状态：
                          {info.ziti_status === 'APPROVE' ? '审核通过' : '待审核'}
                        </View>
                  }
                </View>
              : <View>
                  {
                    info.status === 'WAIT_BUYER_PAY'
                      && <View>该订单将为您保留
                          <AtCountdown
                            format={{ hours: ':', minutes: ':', seconds: '' }}
                            hours={timer.hh}
                            minutes={timer.mm}
                            seconds={timer.ss}
                            onTimeUp={this.countDownEnd.bind(this)}
                          />
                          分钟
                        </View>
                  }
                  {
                    info.status !== 'WAIT_BUYER_PAY' &&
                      <View className='trade-detail-waitdeliver'>
                        <View></View>
                        <View className='delivery-infos'>
                          <View className='delivery-infos__status'>
                            <Text className='delivery-infos__text text-status'>{info.order_status_msg}</Text>
                            <Text className='delivery-infos__text'>
                              { info.status === 'WAIT_SELLER_SEND_GOODS' ? '正在审核订单' : null}
                              { info.status === 'WAIT_BUYER_CONFIRM_GOODS' ? '正在派送中' : null }
                              { info.status === 'TRADE_CLOSED' ? '订单已取消' : null }
                              { info.status === 'TRADE_SUCCESS' ? `物流单号：${info.delivery_code}` : null }
                            </Text>
                          </View>
                          {/*{
                            info.status !== 'TRADE_SUCCESS' ? <Text className='delivery-infos__text'>2019-04-30 11:30:21</Text> : null
                          }*/}
                        </View>
                      </View>
                  }
                </View>
          }
        </View>
        {
          info.receipt_type === 'ziti'
            ? <View className='ziti-content'>
                {
                  info.status === 'WAIT_SELLER_SEND_GOODS' && info.ziti_status === 'PENDING' &&
                    <Image className='ziti-qrcode' src={qrcode} />
                }
                <View className='ziti-text'>
                  <View className='ziti-text-name'>{ ziti.store_name }</View>
                  <View>营业时间：{ ziti.hour }</View>
                  <View>{ ziti.store_address }</View>
                </View>
              </View>
            : <View className='trade-detail-address'>
                <View className='address-receive'>
                  <Text>收货地址：</Text>
                  <View className='info-trade'>
                    <View className='user-info-trade'>
                      <Text>{info.receiver_name}</Text>
                      <Text>{info.receiver_mobile}</Text>
                    </View>
                    <Text className='address-detail'>{info.receiver_state}{info.receiver_city}{info.receiver_district}{info.receiver_address}</Text>
                  </View>
                </View>
              </View>
        }
        <View className='trade-detail-goods'>
          <DetailItem
            info={info}
          />
        </View>
        <View className='trade-money'>总计：<Text className='trade-money__num'>￥{info.item_fee}</Text></View>
        <View className='trade-detail-info'>
          <Text className='info-text'>订单号：{info.tid}</Text>
          <Text className='info-text'>下单时间：{info.created_time_str}</Text>
          {
            info.invoice_content
              ? <Text className='info-text'>发票信息：{info.invoice_content}</Text>
              : null
          }

          <Text className='info-text'>商品金额：￥{info.item_fee}</Text>
          {/*<Text className='info-text'>积分抵扣：-￥XX</Text>*/}
          <Text className='info-text'>运费：￥{info.freight_fee}</Text>
          <Text className='info-text'>优惠：-￥{info.discount_fee}</Text>
          {isDhPoint
            ? (<Text className='info-text' space>支付：{info.payment} {' 积分支付'}</Text>)
            : (<Text className='info-text' space>支付：￥{info.payment} {' 微信支付'}</Text>)}

          {
            info.delivery_code
              ? <View className='delivery_code_copy'>
                  <Text className='info-text'>物流单号：{info.delivery_code}</Text>
                  <Text className='info-text-btn' onClick={this.handleClickDelivery.bind(this)}>查看物流</Text>
                  <Text className='info-text-btn' onClick={this.handleClickCopy.bind(this, info.delivery_code)}>复制</Text>
                </View>
              : null
          }
        </View>
        {
          info.order_class !== 'drug'
            && <View>
                {
                  !isDhPoint && info.status === 'WAIT_BUYER_PAY' && <View className='trade-detail__footer'>
                    <Text className='trade-detail__footer__btn' onClick={this.handleClickBtn.bind(this, 'cancel')}>取消订单</Text>
                    <AtButton className='trade-detail__footer__btn trade-detail__footer_active' type='primary' loading={payLoading} onClick={this.handleClickBtn.bind(this, 'pay')}>立即支付</AtButton>
                  </View>
                }
                {
                  isDhPoint && info.status === 'WAIT_BUYER_PAY' && <View className='trade-detail__footer'>
                    <AtButton className='trade-detail__footer__btn trade-detail__footer__btn-inline trade-detail__footer_active' type='primary' loading={payLoading} onClick={this.handleClickBtn.bind(this, 'pay')}>立即支付</AtButton>
                  </View>
                }
                {
                  !isDhPoint && info.status === 'WAIT_SELLER_SEND_GOODS' && <View className='trade-detail__footer'>
                    {
                      info.order_status_des !== 'PAYED_WAIT_PROCESS' && <Text className='trade-detail__footer__btn' onClick={this.handleClickBtn.bind(this, 'cancel')}>取消订单</Text>
                    }
                    <Text
                      className={`trade-detail__footer__btn trade-detail__footer_active ${info.order_status_des === 'PAYED_WAIT_PROCESS' ? 'trade-detail__footer_allWidthBtn' : ''} `}
                      onClick={this.handleClickBtn.bind(this, 'home')}
                    >继续购物</Text>
                  </View>
                }
                {
                  isDhPoint && info.status === 'WAIT_SELLER_SEND_GOODS' && <View className='trade-detail__footer'>
                    <Text className='trade-detail__footer__btn trade-detail__footer__btn-inline trade-detail__footer_active' onClick={this.handleClickBtn.bind(this, 'home')}>继续购物</Text>
                  </View>
                }
                {
                  info.status === 'WAIT_BUYER_CONFIRM_GOODS' && <View className='trade-detail__footer'>
                    <Text className='trade-detail__footer__btn trade-detail__footer__btn-inline trade-detail__footer_active' onClick={this.handleClickBtn.bind(this, 'confirm')}>确认收货</Text>
                  </View>
                }
                {
                  info.status === 'TRADE_SUCCESS' && <View className='trade-detail__footer'>
                    <Button openType='contact' className='trade-detail__footer__btn trade-detail__footer_active trade-detail__footer_allWidthBtn'>联系客服</Button>
                  </View>
                }
              </View>
        }
        {/*{
          info.order_status_des === 'PAYED_WAIT_PROCESS' && <View className='trade-detail__footer'>
            <Text className='trade-detail__footer__btn trade-detail__footer_active' onClick={this.handleClickBtn.bind(this, 'home')}>继续购物</Text>
          </View>
        }*/}
        <FloatMenus>
          <FloatMenuItem
            iconPrefixClass='icon'
            icon='headphones'
            openType='contact'
          />
        </FloatMenus>
        <SpToast></SpToast>
      </View>
    )
  }
}
