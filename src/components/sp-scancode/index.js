import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class SpScancode extends Component {
  static options = {
    addGlobalClass: true
  }

  render() {
    return (
      <View className='sp-scan-code'>
        <Text className='iconfont icon-saoma-01'></Text>
      </View>
    )
  }
}
