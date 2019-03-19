import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { Loading, SpCell, SpToast, Price, NavBar } from '@/components'
import { classNames, pickBy, formatTime, resolveOrderStatus, copyText } from '@/utils'
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
    console.log(data.orderInfo)

    const info = pickBy(data.orderInfo, {
      tid: 'order_id',
      created_time_str: ({ created_time }) => formatTime(created_time, 'YYYY-MM-DD hh:mm:ss'),
      receiver_name: 'receiver_name',
      receiver_mobile: 'receiver_mobile',
      receiver_state: 'receiver_state',
      receiver_city: 'receiver_city',
      receiver_district: 'receiver_district',
      receiver_address: 'receiver_address',
      status_desc: 'order_status_msg',
      post_fee: ({ freight_fee }) => (+freight_fee / 100).toFixed(2),
      payment: ({ total_fee }) => (+total_fee / 100).toFixed(2),
      status: ({ order_status }) => resolveOrderStatus(order_status),
      orders: ({ items }) => pickBy(items, {
        order_id: 'order_id',
        item_id: 'item_id',
        pic_path: 'pic',
        title: 'item_name',
        price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
        num: 'num'
      })
    })

    const infoStatus = (info.status || '').toLowerCase()
    info.status_img = `ico_${infoStatus === 'trade_success' ? 'wait_rate' : infoStatus}.png`

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
    if (type === 'pay') {
      Taro.navigateTo({
        url: `/pages/cashier/index?order_id=${trade.tid}`
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
                  <OrderItem
                    key={idx}
                    info={item}
                  />
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
              {info.points_fee && (
                <SpCell
                  className='trade-detail__total-item'
                  title='积分'
                  border={false}
                >
                  <Price value={`-${info.points_fee}`} />
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
