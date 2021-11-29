import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtCountdown } from 'taro-ui'
import { Loading, SpToast, SpNavBar, FloatMenuMeiQia, SpImg } from '@/components'
import { pickBy, formatTime, resolveOrderStatus } from '@/utils'
import api from '@/api'

import './split-bagpack.scss'

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
  $instance = getCurrentInstance();
  constructor(props) {
    super(props)

    this.state = {
      delivery_num: '',
      list: []
    }
  }

  componentDidShow() {
    this.fetch()
  }

  async fetch() {
    const { order_id, order_type } = this.$instance.router.params
    const data = await api.trade.deliveryLists({ order_id })

    let { delivery_num, list } = data
    this.setState({
      delivery_num,
      list,
      order_id,
      order_type
    })
  }

  handleClickDelivery = (item) => {
    let { delivery_code, delivery_corp, delivery_corp_name, delivery_id } = item
    Taro.navigateTo({
      url: `/subpage/pages/trade/delivery-info?delivery_id=${delivery_id}&delivery_code=${delivery_code}&delivery_corp=${delivery_corp}&delivery_name=${delivery_corp_name}&delivery_type=new`
    })
  }

  render() {
    const { colors } = this.props
    const { list, delivery_num } = this.state
    if (list.length == 0) {
      return <Loading></Loading>
    }

    return (
      <View className='wuliu-detail'>
        <SpNavBar title='订单详情' leftIconType='chevron-left' fixed='true' />

        <View className='wuliu-detail'>
          <View className='title-status'>您有{delivery_num}个包裹已发出</View>
          {list.map((item) => (
            <View className='wuliu-detail-item'>
              <View className='wuliu-status'>
                {item.status_msg == '已发货' && (
                  <Text className='biao-icon biao-icon-yifahuo'>
                    <Text className='icon-text'>已发货</Text>
                  </Text>
                )}
                {item.status_msg == '未发货' && (
                  <Text className='biao-icon biao-icon-daifahuo'>
                    <Text className='icon-text'>待发货</Text>
                  </Text>
                )}
                <Text className='wuliu-order' onClick={this.handleClickDelivery.bind(this, item)}>
                  {item.delivery_corp_name} {item.delivery_code}
                </Text>
              </View>
              {item.delivery_info && (
                <View className='wuliu-info' onClick={this.handleClickDelivery.bind(this, item)}>
                  {item.delivery_info}
                </View>
              )}
              <View className='good-list'>
                {/* <OrderItem
                               
                                info={info.orders[0]}
                            /> */}
                <ScrollView scrollX>
                  {item.items.map((i) => (
                    <SpImg
                      img-class='order-item__img'
                      src={i.pic}
                      mode='aspectFill'
                      width='300'
                      lazyLoad
                    />
                  ))}
                </ScrollView>
              </View>
              <View className='ft-tips'>共{item.items_num}件商品</View>
            </View>
          ))}
          {/* <DetailItem info={info} /> */}
        </View>
        <SpToast></SpToast>
      </View>
    )
  }
}
