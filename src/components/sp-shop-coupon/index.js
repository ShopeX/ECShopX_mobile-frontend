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
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import React, { useState, useCallback, useEffect } from 'react'
import { classNames } from '@/utils'
import { SpImage, SpNewPrice } from '@/components'
import api from '@/api'
import './index.scss'

function SpShopCoupon(props) {
  const { className, info, fromStoreIndex = false, onClick = () => {} } = props
  const { card_type, discount, least_cost, title } = info
  let couponText = ''
  // 折扣券
  if (card_type == 'discount') {
    couponText = `${(100 - info.discount) / 10}折`
  } else if (card_type == 'cash') {
    // 满减券
    couponText = `${info.reduce_cost / 100}元`
  }

  return (
    <View
      className={classNames(
        'sp-shop-coupon',
        {
          active: false
        },
        className
      )}
      onClick={onClick}
    >
      <View className='coupon-wrap'>
        <Text className='coupon-text'>{fromStoreIndex ? title : couponText}</Text>
        {!fromStoreIndex && (
          <Text className='coupon-status'>{info.receive == 1 ? '已领' : '领取'}</Text>
        )}
      </View>
    </View>
  )
}

SpShopCoupon.options = {
  addGlobalClass: true
}

export default SpShopCoupon
