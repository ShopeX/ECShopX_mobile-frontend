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
    const refMeta = document.querySelector('meta[name="referrer"]')
    refMeta.setAttribute('content', 'always')
  }

  componentWillUnmount () {
    const refMeta = document.querySelector('meta[name="referrer"]')
    refMeta.setAttribute('content', 'never')
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
    const form = document.createElement('form')
    const [action, search] = res.payment.mweb_url.split('?')
    const queryPair = `${search}&redirect_url=${redirect_url}`.split('&')

    form.setAttribute('method', 'get')
    form.setAttribute('action', action)
    form.innerHTML = queryPair.map(p => {
      const [name, value] = p.split('=')
      return `<input type="hidden" name="${name}" value="${value}" />`
    }).join('')
    document.body.appendChild(form)

    form.submit()
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
