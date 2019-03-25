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

  componentDidMount () {
    const refMeta = document.querySelector('meta[name="referrer"]')
    refMeta.setAttribute('content', 'always')
  }

  componentWillUnmount () {
    const refMeta = document.querySelector('meta[name="referrer"]')
    refMeta.setAttribute('content', 'never')
  }

  handleClickPayment = async () => {
    const query = {
      order_id: this.props.orderID,
      pay_type: this.props.payType,
      order_type: this.props.orderType,
    }
    try {
      const { payment } = await api.cashier.getPayment(query)
      const el = document.createElement('div')
      el.innerHTML = payment.replace(/<script>(.*)?<\/script>/, '')
      document.body.appendChild(el)
      document.getElementById('alipaysubmit').submit()
    } catch (error) {
      console.log(error)
      Taro.redirectTo({
        url: `/pages/cashier/cashier-result?payStatus=fail&order_id=${this.props.orderID}`
      })
    }
      // .then(res=> {
      //   console.log(res, 28)
      //   // Taro.redirectTo({
      //   //   url: `/pages/cashier/cashier-result?payStatus=success&order_id=${this.props.orderID}`
      //   // })
      // })
      // .catch(error => {
      //   console.log(error, 34)
      //
      //   Taro.redirectTo({
      //     url: `/pages/cashier/cashier-result?payStatus=fail&order_id=${this.props.orderID}`
      //   })
      // })
  }

  render () {
    return (
      <View>
        <View className='alipay-btn' onClick={this.handleClickPayment.bind(this)}>支付宝支付</View>
      </View>

    )
  }
}
