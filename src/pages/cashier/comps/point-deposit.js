import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import {  AtModal } from 'taro-ui'

import api from '@/api'

import './point-deposit.scss'

export default class PointDepositBtn extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      isOpened: false,
      pay_pay_type: '',
    }
  }

  handleClickPayment = async (type) => {
    this.setState({
      isOpened: true,
      pay_pay_type: type
    })
  }
  handleClosePay = () => {
    this.setState({
      isOpened: false
    })
  }
  handleConfirmPay = async () => {
    const {  pay_pay_type } = this.state

    const query = {
      order_id: this.props.orderID,
      pay_type: pay_pay_type,
      order_type: this.props.orderType,
    }
    try {
      await api.cashier.getPayment(query)
      Taro.redirectTo({
        url: `/pages/cashier/cashier-result?payStatus=success&order_id=${this.props.orderID}`
      })
    } catch(e) {
      console.log(e)
      this.setState({
        isOpened: false
      })
    }

      // .then(()=> {
      //   Taro.redirectTo({
      //     url: `/pages/cashier/cashier-result?payStatus=success&order_id=${this.props.orderID}`
      //   })
      // })
      // .catch(() => {
      //   Taro.redirectTo({
      //     url: `/pages/cashier/cashier-result?payStatus=fail&order_id=${this.props.orderID}`
      //   })
      // })
  }

  render () {
    const { payType } = this.props
    const { isOpened } = this.state

    return (
      <View className='point-deposit-index'>
        <View
          className='pay-mode'
          onClick={this.handleClickPayment.bind(this, payType)}
        >{payType === 'deposit' ? '预存款支付' : '积分支付'}</View>

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
