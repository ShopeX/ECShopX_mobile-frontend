import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import api from '@/api'

import './alipay.scss'

export default class AlipayBtn extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
    }
  }

  handleClickPayment = async () => {
    console.log(this.props.payType, 21)
    const query = {
      order_id: this.props.orderID,
      pay_type: this.props.payType,
      order_type: this.props.orderType,
    }
    await api.cashier.getPayment(query)
      .then(res=> {
        console.log(res, 28)
        // Taro.redirectTo({
        //   url: `/pages/cashier/cashier-result?payStatus=success&order_id=${this.props.orderID}`
        // })
      })
      .catch(error => {
        console.log(error, 34)

        Taro.redirectTo({
          url: `/pages/cashier/cashier-result?payStatus=fail&order_id=${this.props.orderID}`
        })
      })
  }

  render () {
    return (
      <View className='alipay-btn' onClick={this.handleClickPayment.bind(this)}>支付宝支付</View>
    )
  }
}
