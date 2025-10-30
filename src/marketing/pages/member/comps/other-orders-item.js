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
import { View, Button } from '@tarojs/components'

import './other-orders-item.scss'

export default class OtherOrdersItem extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { info, onClick } = this.props

    if (!info) {
      return null
    }

    return (
      <View className='other-orders-item' onClick={onClick}>
        <View className='flex item-info'>
          <View>订单号：{info.order_id}</View>
          <View>交易金额：￥{info.n_total_fee}</View>
        </View>
        <View className='align-right'>
          <Button className='d-button' circle size='mini' onClick={onClick}>
            订单详情
          </Button>
        </View>
      </View>
    )
  }
}
