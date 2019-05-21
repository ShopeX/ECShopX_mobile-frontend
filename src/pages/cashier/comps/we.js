import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import api from '@/api'

import './we.scss'

export default class WeappBtn extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  componentDidMount () {
  }

  handleClickPay = async () => {
    const { info } = this.props
    const { order_id, order_type } = info
    const params = {
      pay_type: 'wxpay',
      order_id,
      order_type
    }

    const config = await api.cashier.getPayment(params)
    const payRes = await Taro.requestPayment({
      ...config
    })
    console.log(payRes)
  }

  render () {
    return (
      <View
        className='weapp-btn'
        onClick={this.handleClickPay.bind(this)}
      >
        微信支付
      </View>
    )
  }
}
