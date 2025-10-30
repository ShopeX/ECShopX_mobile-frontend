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
import React from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'

import './goods-item.scss'

const GoodsItem = () => {
  return (
    <View className='goods'>
      <View className='goods-img'>
        <SpImage />
      </View>

      <View className='goods-info'>
        <View className='goods-info__name'>10斤绿叶菜</View>
        <View className='goods-info__specs'>10斤（都是大白菜）</View>
        <Text className='goods-info__num'>10件起购</Text>
        <View className='goods-info__price'>
          <SpPrice value={99} noDecimal />
        </View>
      </View>

      <View className='goods-handle'>
        <View className='goods-handle__symbol goods-handle__reduce'>-</View>
        <View className='goods-handle__num'>10</View>
        <View className='goods-handle__symbol goods-handle__plus'>+</View>
      </View>
    </View>
  )
}

export default GoodsItem
