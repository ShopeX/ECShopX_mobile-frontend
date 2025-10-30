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

import './index.scss'

export default class BaOrderItem extends Component {
  static defaultProps = {
    onClick: () => {},
    payType: '',
    showExtra: true,
    info: null,
    isChangenNum: false
  }

  static options = {
    addGlobalClass: true
  }

  render() {
    const { info, onClick, payType, showExtra, customFooter, isChangenNum, aftersaleOrder } =
      this.props
    if (!info) return null

    const img = info.pic_path
      ? info.pic_path
      : Array.isArray(info.pics)
      ? info.pics[0]
      : info.pics || info.pic

    return (
      <View className='order-main' onClick={onClick}>
        <View className='order-item'>
          <View className='order-item__hd'>
            <Image mode='aspectFill' className='order-item__img' src={img} />
          </View>
          <View className='order-item__bd'>
            <Text className='order-item__title'>{info.title || info.item_name || ''}</Text>
            {info.item_spec_desc && <Text className='order-item__spec'>{info.item_spec_desc}</Text>}
            {this.props.renderDesc}

            {this.props.renderFooter}
            {this.props.renderActLimit}
          </View>
        </View>
        {this.props.renderAdvanceSale}
      </View>
    )
  }
}
