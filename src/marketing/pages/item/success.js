import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './success.scss'

export default class TradeRateSuccess extends Component {
  config = {
    navigationBarTitleText: '评价成功'
  }
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {}

  handleClick = () => {
    Taro.redirectTo({
      url: '/pages/index'
    })
  }

  render() {
    return (
      <View className='trade-rate-success'>
        <View className='in-icon in-icon-icon-test'></View>
        <Text className='text'>评价成功～ </Text>
        <View className='btn-wrap' onClick={this.handleClick}>
          返回首页
        </View>
      </View>
    )
  }
}
