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
import { View, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { navigateTo } from '@/utils'
import './index.scss'

@connect(({ shop }) => ({
  store: shop.curStore
}))
export default class SpStorePicker extends Component {
  static options = {
    addGlobalClass: true
  }

  navigateTo = navigateTo

  render() {
    const { store } = this.props
    return (
      <View
        className='sp-store-picker'
        onClick={this.navigateTo.bind(this, '/subpages/store/list')}
      >
        {/* <Text className="iconfont icon-dizhi-01"></Text> */}
        <Text className='shop-name'>
          {store ? store.store_name : '选择店铺'}
          {store ? store.store_name : '选择店铺'}
        </Text>
        <Text className='iconfont icon-arrowRight'></Text>
      </View>
    )
  }
}
