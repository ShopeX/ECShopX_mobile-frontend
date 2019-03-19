import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'

import './weapp.scss'

export default class WeappBtn extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
    }
  }

  componentDidMount () {
  }

  handleClickPay = async () => {
    const { order_id, order_type = 'normal' } = this.$router.params
    const params = {
      pay_type: 'wxpayh5',
      order_id,
      order_type
    }
    const res = await api.cashier.getPayment(params)
    // eslint-disable-next-line
    const loc = location
    const redirect_url = encodeURIComponent(`${loc.procotol}://${loc.host}/trade/list`)
    window.open = `${res.payment.mweb_url}`
    console.log(res)
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
