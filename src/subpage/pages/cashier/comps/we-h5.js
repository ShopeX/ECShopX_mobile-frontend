import React, { Component } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import api from '@/api'

import './we.scss'

export default class WeappBtn extends Component {
  $instance = getCurrentInstance()
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {}
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
    const { order_id } = this.$instance.router.params
    const { orderType = 'normal' } = this.props

    const params = {
      pay_type: 'wxpayh5',
      order_id,
      order_type: orderType
    }

    const res = await api.cashier.getPayment(params)
    // eslint-disable-next-line
    const loc = location
    const redirect_url = `${loc.protocol}//${loc.host}/subpage/pages/cashier/cashier-result?order_id=${order_id}`
    const form = document.createElement('form')
    const [action, search] = res.mweb_url.split('?')
    const queryPair = `${search}&redirect_url=${redirect_url}`.split('&')

    form.setAttribute('method', 'get')
    form.setAttribute('action', action)
    form.innerHTML = queryPair
      .map((p) => {
        const idx = p.indexOf('=')
        const [name, value] = [p.slice(0, idx), p.slice(idx + 1)]
        return `<input type="hidden" name="${name}" value="${value}" />`
      })
      .join('')
    document.body.appendChild(form)

    form.submit()
  }

  render () {
    return (
      <View className='weapp-btn' onClick={this.handleClickPay.bind(this)}>
        微信支付
      </View>
    )
  }
}
