// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { linkPage } from './helper'

import './writing.scss'

export default class WgtHeading extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)

    this.state = {
      curIdx: 0
    }
  }

  handleClickItem = linkPage

  handleSwiperChange = (e) => {
    const { current } = e.detail

    this.setState({
      curIdx: current
    })
  }

  render() {
    const { info } = this.props
    const { curIdx } = this.state

    if (!info) {
      return null
    }

    const { config, base, data } = info
    const curContent = (data[curIdx] || {}).content
    let stringStyle = ''
    if (config) {
      if (config.align) {
        stringStyle = `text-align: ${config.align};`
      }
      if (config.italic === true) {
        stringStyle = stringStyle.concat('font-style: italic;')
      }
      if (config.bold === true) {
        stringStyle = stringStyle.concat('font-weight: 700;')
      }
      if (config.size) {
        stringStyle = stringStyle.concat(`font-size: ${Taro.pxTransform(config.size * 2)};`)
      }
    }

    return (
      <View className={`wgt  ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>{base.title}</View>
            <View className='wgt__subtitle'>{base.subtitle}</View>
          </View>
        )}
        <View className={`slider-wra ${config.padded ? 'padded' : ''}`} style={stringStyle}>
          <View className='heading-view'>{curContent}</View>
        </View>
      </View>
    )
  }
}
