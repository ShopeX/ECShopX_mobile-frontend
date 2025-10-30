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
import { View, Image, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

export default class Loading extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    type: '',
    img: null,
    size: null
  }

  render() {
    const { className, type, img, size } = this.props

    return (
      <View className={classNames('loading', type && `loading__${type}`, className)}>
        {img ? (
          <Image src={img} className='loading-img' />
        ) : (
          <View className='spiner' style={`${size ? `width: ${size}, height: ${size}` : ''}`} />
        )}
        <Text className='loading-text'>{this.props.children}</Text>
      </View>
    )
  }
}
