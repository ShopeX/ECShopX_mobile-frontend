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
import { View, Text, Image } from '@tarojs/components'
import { linkPage } from './helper'

import './navigation.scss'

export default class WgtNavigation extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  handleClickItem(item, index) {
    linkPage(item.linkPage, item.id)
  }

  render() {
    const { info } = this.props

    if (!info) {
      return null
    }

    const { base, data } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        <View className='wgt-body with-padding'>
          <View className='navigation'>
            {data.map((item, idx) => {
              return (
                <View
                  className='nav-item'
                  key={item.id}
                  onClick={this.handleClickItem.bind(this, item, idx)}
                >
                  <Image className='nav-img' mode='widthFix' lazyLoad src={item.imgUrl} />
                  <Text className='nav-name'>{item.content}</Text>
                </View>
              )
            })}
          </View>
        </View>
      </View>
    )
  }
}
