import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
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

  render () {
    return (
      <View className='alipay-btn'>支付宝支付</View>
    )
  }
}
