import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { DEFAULT_POINT_NAME } from '@/consts'

import './index.scss'

export default class SpPoint extends Component {
  static defaultProps = {
    value: 0
  }

  render () {
    const { className, value } = this.props
    const unit = Taro.getStorageInfoSync('custom_point_name') || DEFAULT_POINT_NAME

    return (
      <View className={classNames('sp-point', className)}>
        {value && <View class='point'>{value}</View>}
        <View class='unit'>{unit}</View>
      </View>
    )
  }
}
