import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import api from '@/api'
import { pickBy } from '@/utils'
import {  AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import AlipayBtn from './comps/alipay'
import WeappBtn from './comps/weapp'

import './index.scss'

export default class Cashier extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      isOpened: false,
      pay_pay_type: '',
    }
  }
  componentDidShow () {

    this.fetch()
  }

  async fetch () {
    const { order_id } = this.$router.params
    const { orderInfo } = await api.cashier.getOrderDetail(order_id)
    const info = pickBy(orderInfo, {
      order_id: 'order_id',
      order_type: 'order_type',
      pay_type: 'pay_type',
      point: 'point',
      total_fee: ({ total_fee }) => (total_fee/100).toFixed(2)
    })
    // const list = resolveCartItems(cartlist)
    // const items = normalizeItems(list)
    this.setState({
      info: info
    })
    console.log(info, 26)

  }
  handleClickPayment = async (val) => {
    this.setState({
      isOpened: true,
      pay_pay_type: val
    })
  }
  handleClosePay = () => {
    this.setState({
      isOpened: false
    })
  }
  handleConfirmPay = async () => {
      const { info, pay_pay_type } = this.state
      const query = {
        order_id: info.order_id,
        pay_type: pay_pay_type,
        order_type: info.order_type,
      }
      let res = await api.cashier.getPayment(query)
      console.log(res)
  }
  // handleClickPayment = async (val) => {
  //   const { info } = this.state
  //   console.log(val)
  //   const query = {
  //     order_id: info.order_id,
  //     pay_type: val,
  //     order_type: info.order_type,
  //   }
  //   let res = await api.cashier.getPayment(query)
  //   console.log(res)
  // }


  render () {
    const { info, isOpened } = this.state

    return (
      <View className='page-cashier-index'>
        <View className='cashier-money'>
          {
            info.order_type
              ? <View className='cashier-money__tip'>订单提交成功，请选择支付方式</View>
              : null
          }
          <View className='cashier-money__content'>
            <View className='cashier-money__content-title'>应付总额{ info.pay_type === 'point' ? '（积分）' : '（元）'}</View>
            <View className='cashier-money__content-number'>{info.pay_type === 'point' ? info.point :info.total_fee}</View>
          </View>
        </View>

        <View className='pay-status'>
          {/*<AlipayBtn />*/}
          {/*<WeappBtn*/}
            {/*number='66'*/}
          {/*/>*/}
          <View className='pay-mode' onClick={this.handleClickPayment.bind(this, 'deposit')}>预存款支付</View>
          {/*<View className='pay-mode' onClick={this.handleClickPayment.bind(this, 'deposit')}>预存款支付</View>*/}
          <View className='pay-mode' onClick={this.handleClickPayment.bind(this, 'point')}>积分支付</View>
        </View>

        <AtModal
          isOpened={isOpened}
          cancelText='取消'
          confirmText='确认'
          onClose={this.handleClosePay}
          onCancel={this.handleClosePay}
          onConfirm={this.handleConfirmPay}
          content='请确认是否支付此订单'
        />
      </View>
    )
  }
}
