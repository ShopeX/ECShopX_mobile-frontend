
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtBadge, AtIcon, AtAvatar } from 'taro-ui'
import { SpIconMenu, TabBar } from '@/components'

import './integral.scss'

export default class Integral extends Component {
  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  componentDidShow () {
  }

  render () {
    return (
      <View className='page-member-index'>
        <View className='member-index__hd'>
          <View className='member-info'>
            <View className='member-name'>鲜果优格果冻妹</View>
          </View>
        </View>
      </View>
    )
  }
}
