import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import AlipayBtn from './comps/alipay'
import WeappBtn from './comps/weapp'
import api from '@/api'

import './index.scss'

export default class Cashier extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }



  render () {
    // const { list, pluralType, imgType, currentIndex } = this.state

    return (
      <View className='page-cashier-index'>
        <View className='cashier-money'>
          <View className='cashier-money__tip'>订单提交成功，请选择支付方式</View>
          <View className='cashier-money__content'>
            <View className='cashier-money__content-title'>应付总额（元）</View>
            <View className='cashier-money__content-number'>1843.00</View>
          </View>
        </View>

        <View className='pay-status'>
          <AlipayBtn />
          <WeappBtn
            number='66'
          />
        </View>
      </View>
    )
  }
}
