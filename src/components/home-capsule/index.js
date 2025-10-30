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
import { classNames } from '@/utils'

import './index.scss'

export default class HomeCapsule extends Component {
  static defaultProps = {
    url: ''
  }

  componentDidMount() {
    if (process.env.TARO_ENV === 'weapp') {
    }
  }

  handleClick() {
    const { url } = this.props
    Taro.navigateTo({
      url: url || '/pages/index'
    })
  }

  render() {
    const { className, style } = this.props
    const classes = classNames('home-capsule', className)

    return (
      <View className={classes} style={style} onClick={this.handleClick}>
        <View className='iconfont icon-home'></View>
      </View>
    )
  }
}
