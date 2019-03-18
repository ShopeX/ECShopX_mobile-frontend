import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import api from '@/api'
import { pickBy } from '@/utils'
import {  AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import AlipayBtn from './comps/alipay'
import WeappBtn from './comps/weapp'
import PointDepositBtn from './comps/point-deposit'

import './index.scss'

export default class Cashier extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
    }
  }
  componentDidShow () {

    this.fetch()
  }

  async fetch () {
    const { order_id } = this.$router.params
    const orderInfo = await api.cashier.getOrderDetail(order_id)
    const info = pickBy(orderInfo, {
      order_id: 'order_id',
      order_type: 'order_type',
      pay_type: 'pay_type',
      point: 'point',
      title: 'title',
      total_fee: ({ total_fee }) => (total_fee/100).toFixed(2)
    })
    // const list = resolveCartItems(cartlist)
    // const items = normalizeItems(list)
    this.setState({
      info: info
    })

  }


  render () {
    const { info } = this.state

    return (
      <View className='page-cashier-index'>
        <View className='cashier-money'>
          {
            info.order_type === 'recharge'
              ? <View className='cashier-money__tip'>订单提交成功，请选择支付方式</View>
              : null
          }
          <View className='cashier-money__content'>
            <View className='cashier-money__content-title'>订单编号： { info.order_id }</View>
            <View className='cashier-money__content-title'>订单名称：{ info.title }</View>
            <View className='cashier-money__content-title'>应付总额{ info.pay_type === 'point' ? '（积分）' : '（元）'}</View>
            <View className='cashier-money__content-number'>{ info.pay_type === 'point' ? info.point : info.total_fee }</View>
          </View>
        </View>

        <View className='pay-status'>
          {
            info.order_type === 'recharge'
              ? <View>
                  <AlipayBtn
                    orderID={info.order_id}
                    payType='alipayh5'
                    orderType={info.order_type}
                  />
                  <WeappBtn number='66' />
                </View>
              : <PointDepositBtn
                orderID={info.order_id}
                payType={info.pay_type}
                orderType={info.order_type}
              />
          }


        </View>
      </View>
    )
  }
}
