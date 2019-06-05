import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtButton, AtCountdown} from 'taro-ui'
import { Loading, SpCell, SpToast, Price, NavBar } from '@/components'
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
      payLoading: false
    }
  }

  componentDidMount () {
    this.fetch()
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

    const info = pickBy(data.orderInfo, {
      tid: 'order_id',
      created_time_str: ({ create_time }) => formatTime(create_time*1000),
      auto_cancel_seconds: 'auto_cancel_seconds',
      receiver_name: 'receiver_name',
      receiver_mobile: 'receiver_mobile',
      receiver_state: 'receiver_state',
      receiver_city: 'receiver_city',
      receiver_district: 'receiver_district',
      receiver_address: 'receiver_address',
      status_desc: 'order_status_msg',
      delivery_code: 'delivery_code',
      delivery_corp: 'delivery_corp',
      order_type: 'order_type',
      order_status_msg: 'order_status_msg',
      item_fee: ({ item_fee }) => (+item_fee / 100).toFixed(2),
      coupon_discount: ({ coupon_discount }) => (+coupon_discount / 100).toFixed(2),
      post_fee: ({ freight_fee }) => (+freight_fee / 100).toFixed(2),
      payment: ({ total_fee }) => (+total_fee / 100).toFixed(2),
      pay_type: 'pay_type',
      point: 'point',
      status: ({ order_status }) => resolveOrderStatus(order_status),
      orders: ({ items }) => pickBy(items, {
        order_id: 'order_id',
        item_id: 'item_id',
        aftersales_status: ({ aftersales_status }) => AFTER_SALE_STATUS[aftersales_status],
        pic_path: 'pic',
        title: 'item_name',
        delivery_status: 'delivery_status',
        price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
        point: 'item_point',
        num: 'num'
      })
    })

    let timer = null
    if(info.auto_cancel_seconds){
      timer = this.calcTimer(info.auto_cancel_seconds)
      this.setState({
        timer
      })
    }

    const infoStatus = (info.status || '').toLowerCase()
    info.status_img = `ico_${infoStatus === 'trade_success' ? 'wait_rate' : infoStatus}.png`

    log.debug('[trade info] info: ', info)

    this.setState({
      info
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

    // 爱茉pay流程
    const { tid: order_id, order_type } = info
    const paymentParams = {
      pay_type: 'amorepay',
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
      try {
        api.trade.tradeQuery(config.trade_info.trade_id)
      } catch (e) {
        console.info(e)
      }

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
        url: '/pages/home/index'
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
    /*Taro.navigateTo({
      url: '/pages/trade/delivery-info?order_id='+this.state.info.tid
    })*/
  }

  // handleClickAfterSale= () => {
  //   const { info: { tid: order_id } } = this.state
  //   Taro.navigateTo({
  //     url: `/pages/trade/refund?order_id=${order_id}`
  //   })
  // }

  handleClickToDelivery = () => {

  }

  handleClickCopy = (val) => {
    copyText(val)
    S.toast('复制成功')
  }

  render () {
    const { info, timer, payLoading } = this.state
    if (!info) {
      return <Loading></Loading>
    }

    // TODO: orders 多商铺
    // const tradeOrders = resolveTradeOrders(info)

    return (
      <View className='trade-detail'>
        <NavBar
          title='订单详情'
          leftIconType='chevron-left'
          fixed='true'
        />
        {
          info.status === 'WAIT_BUYER_PAY' && <View className={classNames('trade-detail-header', `trade-detail-header__waitpay`)}>
            <View>该订单将为您保留
              <AtCountdown
                format={{ minutes: ':', seconds: '' }}
                minutes={timer.mm}
                seconds={timer.ss}
              />
              分钟
            </View>

          </View>
        }
        {
          info.status !== 'WAIT_BUYER_PAY' && <View className={classNames('trade-detail-header')}>
            <View className='trade-detail-waitdeliver'>
              <View></View>
              <View className='delivery-infos'>
                <View className='delivery-infos__status'>
                  <Text className='delivery-infos__text text-status'>{info.order_status_msg}</Text>
                  <Text className='delivery-infos__text'>
                    { info.status === 'WAIT_SELLER_SEND_GOODS' ? '物流信息：正在审核订单' : null}
                    { info.status === 'WAIT_BUYER_CONFIRM_GOODS' ? '物流信息：正在派送中' : null }
                    { info.status === 'TRADE_CLOSED' ? '订单已取消' : null }
                    { info.status === 'TRADE_SUCCESS' ? `物流单号：${info.delivery_code}` : null }
                  </Text>
                </View>
                {/*{
                  info.status !== 'TRADE_SUCCESS' ? <Text className='delivery-infos__text'>2019-04-30 11:30:21</Text> : null
                }*/}
              </View>
            </View>
          </View>
        }

        <View className='trade-detail-address' onClick={this.handleClickDelivery.bind(this)}>
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
        <View className='trade-detail-goods'>
          <DetailItem
            info={info}
          />
        </View>
        <View className='trade-money'>总计：<Text className='trade-money__num'>￥{info.payment}</Text></View>
        <View className='trade-detail-info'>
          <Text className='info-text'>订单号：{info.tid}</Text>
          <Text className='info-text'>下单时间：{info.created_time_str}</Text>
          <Text className='info-text'>发票信息：上海xxx有限公司上海xx有</Text>
          <Text className='info-text'>商品金额：￥{info.item_fee}</Text>
          {/*<Text className='info-text'>积分抵扣：-￥XX</Text>*/}
          <Text className='info-text'>免运费：-￥{info.freight_fee}</Text>
          <Text className='info-text'>优惠：-￥{info.coupon_discount}</Text>
          <Text className='info-text'>支付：{info.payment}（微信支付）</Text>
          {
            info.delivery_code
              ? <View className='delivery_code_copy'>
                  <Text className='info-text'>物流单号：{info.delivery_code}</Text>
                  <Text className='info-text' onClick={this.handleClickCopy.bind(this, info.delivery_code)}>复制</Text>
                </View>
              : null
          }
        </View>
        {
          info.status === 'WAIT_BUYER_PAY' && <View className='trade-detail__footer'>
            <Text className='trade-detail__footer__btn' onClick={this.handleClickBtn.bind(this, 'cancel')}>取消订单</Text>
            <AtButton className='trade-detail__footer__btn trade-detail__footer_active' type='primary' loading={payLoading} onClick={this.handleClickBtn.bind(this, 'pay')}>立即支付</AtButton>
          </View>
        }
        {
          info.status === 'WAIT_SELLER_SEND_GOODS' && <View className='trade-detail__footer'>
            <Text className='trade-detail__footer__btn' onClick={this.handleClickBtn.bind(this, 'cancel')}>取消订单</Text>
            <Text className='trade-detail__footer__btn trade-detail__footer_active' onClick={this.handleClickBtn.bind(this, 'home')}>继续购物</Text>
          </View>
        }
        {
          info.status === 'WAIT_BUYER_CONFIRM_GOODS' && <View className='trade-detail__footer'>
            <Button openType='contact' className='trade-detail__footer__btn'>联系客服</Button>
            {/*<Text className='trade-detail__footer__btn'>联系客服</Text>*/}
            <Text className='trade-detail__footer__btn trade-detail__footer_active' onClick={this.handleClickBtn.bind(this, 'confirm')}>确认收货</Text>
          </View>
        }
        {
          info.status === 'TRADE_SUCCESS' && <View className='trade-detail__footer'>
            <Button openType='contact' className='trade-detail__footer__btn trade-detail__footer_active trade-detail__footer_allWidthBtn'>联系客服</Button>
          </View>
        }

        <SpToast></SpToast>
      </View>
    )
  }
}
