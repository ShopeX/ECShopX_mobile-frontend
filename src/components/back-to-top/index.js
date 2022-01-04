import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

export default class BackToTop extends Component {
  static defaultProps = {
    onClick: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  render () {
    const { show, onClick, bottom } = this.props

    return (
      <View
        className={classNames('back-to-top', { 'is-show': show })}
        style={`${bottom ? `bottom: ${Taro.pxTransform(bottom)}` : ''}`}
        onClick={onClick}
      >
        <View className='iconfont icon-arrow-up'></View>
      </View>
    )
  }
}
