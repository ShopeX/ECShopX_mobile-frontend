import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import loadingImg from './loading.gif'
import './index.scss'

export default class Loading extends Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    const { className } = this.props
    return (
      <View className={classNames('loading', className)}>
        <Image src={loadingImg} className='loading-img' />
        <Text className='loading-text'>{this.props.children}</Text>
      </View>
    )
  }
}
