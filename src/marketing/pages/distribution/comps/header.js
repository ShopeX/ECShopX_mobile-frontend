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
/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 自定义头部
 * @FilePath: /unite-vshop/src/marketing/pages/distribution/comps/header.js
 * @Date: 2021-03-08 14:08:53
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-03-08 18:34:22
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './header.scss'

export default class HeaderCustom extends Component {
  constructor(props) {
    super(props)
  }

  static options = {
    addGlobalClass: true
  }

  handleBack = (type = '') => {
    if (type) {
      Taro.redirectTo({
        url: '/pages/index'
      })
    } else {
      Taro.navigateBack()
    }
  }

  render() {
    const { isWhite = false, statusBarHeight = 44, isHome } = this.props
    return (
      <View
        className='customHeader'
        style={`padding-top: ${statusBarHeight}px; background: ${isWhite ? '#fff' : 'transparent'}`}
      >
        <View className={`menu ${!isHome && 'roate'}`}>
          {isHome ? (
            <View
              className='iconfont icon-home1'
              onClick={this.handleBack.bind(this, 'home')}
            ></View>
          ) : (
            <View className='iconfont icon-arrowUp' onClick={this.handleBack.bind(this, '')}></View>
          )}
        </View>
      </View>
    )
  }
}
