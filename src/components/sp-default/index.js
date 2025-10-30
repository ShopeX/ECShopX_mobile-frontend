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
import { View, Text, Image } from '@tarojs/components'
import { classNames } from '@/utils'
import SpImage from './../sp-image'

import './index.scss'

const TYPES = {
  cart: 'empty_cart.png'
}

function SpDefault(props) {
  const { className, message, children, type } = props
  return (
    <View
      className={classNames(
        {
          'sp-default': true
        },
        className
      )}
    >
      <View className='sp-default-hd'>
        {type && <SpImage className='default-img' src={TYPES[type]} width={350} />}
      </View>
      <View className='sp-default-bd'>{message}</View>
      <View className='sp-default-ft'>{children}</View>
    </View>
  )
}

export default SpDefault
