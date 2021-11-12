/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/cashier/comps/alipay.js
 * @Date: 2020-05-06 16:01:41
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-19 15:00:36
 */

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import api from '@/api'

import './alipay.scss'

export default class AlipayBtn extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const refMeta = document.querySelector('meta[name="referrer"]')
    refMeta.setAttribute('content', 'always')
  }

  componentWillUnmount() {
    const refMeta = document.querySelector('meta[name="referrer"]')
    refMeta.setAttribute('content', 'never')
  }

  handleClickPayment = async () => {
    const { protocol, host } = window.location
    const query = {
      order_id: this.props.orderID,
      pay_type: this.props.payType,
      order_type: this.props.orderType,
      return_url: `${protocol}//${host}/subpage/pages/cashier/cashier-result?payStatus=fail&order_id=${this.props.orderID}`
    }
    try {
      const { payment } = await api.cashier.getPayment(query)
      const el = document.createElement('div')
      el.innerHTML = payment.replace(/<script>(.*)?<\/script>/, '')

      document.body.appendChild(el)

      document.getElementById('alipay_submit').submit()
    } catch (error) {
      console.log(error)
      Taro.redirectTo({
        url: `/subpage/pages/cashier/cashier-result?payStatus=fail&order_id=${this.props.orderID}`
      })
    }
  }

  render() {
    return (
      <View>
        <View className='alipay-btn' onClick={this.handleClickPayment.bind(this)}>
          支付宝支付
        </View>
      </View>
    )
  }
}
