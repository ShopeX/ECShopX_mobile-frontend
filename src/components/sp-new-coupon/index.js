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
import React, { useState, memo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

const SpNewCoupon = (props) => {
  const {
    receiveText = {
      unreceiveText: '领取',
      receiveText: '已领'
    },
    isReceive = false,
    text = '',
    className,
    hasStatus = true
  } = props

  //设置领取和未领取的文字
  const statusText = isReceive ? receiveText.receiveText : receiveText.unreceiveText

  return (
    <View
      className={classNames(
        'sp-component-newcoupon',
        {
          receiveed: isReceive
        },
        className
      )}
    >
      <View className='border'></View>
      <View className='radius'></View>
      <View className='text'>{text}</View>
      {hasStatus && <View className='status-text'>{statusText}</View>}
    </View>
  )
}

export default memo(SpNewCoupon)
