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
