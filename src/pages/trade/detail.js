import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { Loading, SpCell, SpToast, Price, NavBar } from '@/components'
import { classNames, log, pickBy, formatTime, resolveOrderStatus, copyText } from '@/utils'
import api from '@/api'
import OrderItem from './comps/order-item'

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
      info: null
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { id } = this.$router.params
    const data = await api.trade.detail(id)

    const info = pickBy(data.orderInfo, {
      tid: 'order_id',
      created_time_str: ({ created_time }) => formatTime(created_time, 'YYYY-MM-DD HH:MM:SS'),
      receiver_name: 'receiver_name',
      receiver_mobile: 'receiver_mobile',
      receiver_state: 'receiver_state',
      receiver_city: 'receiver_city',
      receiver_district: 'receiver_district',
      receiver_address: 'receiver_address',
      status_desc: 'order_status_msg',
      post_fee: ({ freight_fee }) => (+freight_fee / 100).toFixed(2),
      payment: ({ total_fee }) => (+total_fee / 100).toFixed(2),
      pay_type: 'pay_type',
      point: 'point',
      status: ({ order_status }) => resolveOrderStatus(order_status),
      orders: ({ items }) => pickBy(items, {
        order_id: 'order_id',
        item_id: 'item_id',
        aftersales_status: 'aftersales_status',
        pic_path: 'pic',
        title: 'item_name',
        delivery_status: 'delivery_status',
        price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
        point: 'item_point',
        num: 'num'
      })
    })

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

  async handleClickBtn (type) {
    const { info } = this.state

    if (type === 'pay') {
      Taro.navigateTo({
        url: `/pages/cashier/index?order_id=${info.tid}`
      })
      return
    }

    if (type === 'confirm') {
      await api.trade.confirm(info.tid)
      Taro.redirectTo({
        url: this.$router.path
      })
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

  render () {
    const { info } = this.state
    if (!info) {
      return <Loading></Loading>
    }

    // TODO: orders 多商铺
    // const tradeOrders = resolveTradeOrders(info)

    return (
      <View className={classNames('trade-detail', `trade-detail__status-${info.status}`)}>
        <NavBar
          title='订单详情'
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='trade-detail__status'>
          <Text className='trade-detail__status-text'>{info.status_desc}</Text>
          <Image
            mode='aspectFill'
            className='trade-detail__status-ico'
            src={`/assets/imgs/trade/${info.status_img}`}
          />
        </View>
        <View className='trade-detail__addr'>
          <SpCell
            icon='map-pin'
          >
            {
              <View className='address-info__bd'>
                <Text className='address-info__receiver'>
                  收货人：{info.receiver_name} {info.receiver_mobile}
                </Text>
                <Text className='address-info__addr'>
                  收货地址：{info.receiver_state}{info.receiver_city}{info.receiver_district}{info.receiver_address}
                </Text>
              </View>
            }
          </SpCell>
          {info.shipping_type_name && (
            <View className='trade-detail__express'>配送方式：{info.shipping_type_name}</View>
          )}
        </View>

        <View className='sec sec-orders'>
          {info.shop_name && (
            <View className='sec-orders__hd'>
              <Text>{info.shop_name}</Text>
            </View>
          )}
          <View className='sec-orders__bd'>
            {
              info.orders.map((item, idx) => {
                return (
                  <View key={idx}>
                    <OrderItem
                      payType={info.pay_type}
                      info={item}
                    />
                    {info.status === 'TRADE_SUCCESS' && item.delivery_status === 'DONE' && (
                      <SpCell className='trade-opts'>
                        {(!item.aftersales_status || item.aftersales_status == 'SELLER_REFUSE_BUYER') && (
                          <AtButton type='primary' size='small' onClick={this.handleClickRefund.bind(this, 'refund', item.item_id)}>申请售后</AtButton>
                        )}
                        {item.aftersales_status && (
                          <AtButton size='small' onClick={this.handleClickRefund.bind(this, 'refundDetail', item.item_id)}>售后详情</AtButton>
                        )}
                      </SpCell>
                    )}
                  </View>
                )
              })
            }
            <View className='trade-detail__total'>
              <SpCell
                className='trade-detail__total-item'
                title='运费'
                border={false}
              >
                <Price value={info.post_fee} />
              </SpCell>
              {info.point && (
                <SpCell
                  className='trade-detail__total-item'
                  title='积分'
                  border={false}
                >
                  <Price noSymbol noDecimal value={`-${info.point}`} />
                </SpCell>
              )}
              <SpCell
                className='trade-detail__total-item'
                title='实付款(含运费)'
                border={false}
              >
                <Price primary value={info.payment} />
              </SpCell>
            </View>
          </View>
        </View>

        <View className='sec trade-extra'>
          <View className='trade-extra__bd'>
            <Text>订单编号：{info.tid}</Text>
            <Text>创建时间：{info.created_time_str}</Text>
          </View>
          <View className='trade-extra__ft'>
            <AtButton size='small' onClick={this.handleCopy}>复制</AtButton>
          </View>
        </View>

        {info.status === 'WAIT_BUYER_PAY' && (<View className='toolbar toolbar-actions'>
          <AtButton
            circle
            type='secondary'
            onClick={this.handleClickBtn.bind(this, 'pay')}
          >立即支付</AtButton>
        </View>)}

        {info.status === 'WAIT_BUYER_CONFIRM_GOODS' && (<View className='toolbar toolbar-actions'>
          <AtButton
            circle
            type='secondary'
            onClick={this.handleClickBtn.bind(this, 'confirm')}
          >确认收货</AtButton>
        </View>)}

        {info.status === 'WAIT_RATE' && (<View className='toolbar toolbar-actions'>
          <AtButton
            circle
            type='secondary'
            onClick={this.handleClickBtn.bind(this, 'rate')}
          >评价</AtButton>
        </View>)}

        <SpToast></SpToast>
      </View>
    )
  }
}
