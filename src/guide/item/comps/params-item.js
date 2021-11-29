import React, { Component } from 'react';
import { View } from '@tarojs/components'

export default class ParamsItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: {}
  }

  render() {
    const { info } = this.props

    if (!info) {
      return null
    }

    return (
      <View className='goods-params__item'>
        <View className='goods-params__item-label'>{info.label}</View>
        <View className='goods-params__item-value'>{info.value}</View>
      </View>
    )
  }
}
