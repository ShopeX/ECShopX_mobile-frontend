import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import './cus-no-position.scss'

@connect(({ colors }) => ({
  colors: colors.current || { data: [{}] }
}))
export default class StoreListItem extends Component {
  static defaultProps = {
    onClick: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  handleClick = () => {
    this.props.onClick && this.props.onClick()
  }

  render() {
    const { info, isStore, colors } = this.props

    return (
      <View className='cus-no-position'>
        {this.props.children}
        <View className='position-title'>未授权位置信息，请授权定位</View>
        <View className='position-btn' onClick={this.handleClick}>直接授权定位</View>
      </View>
    )
  }
}
