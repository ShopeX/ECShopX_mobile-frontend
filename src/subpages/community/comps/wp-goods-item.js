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

import './wp-goods-item.scss'

const WaitPayGoodsItem = () => {
  return (
    <View className='wpGoods'>
      <View className='wpGoods-img'>
        <SpImage />
      </View>

      <View className='wpGoods-info'>
        <View className='wpGoods-info__name'>
          <View>金龙鱼</View>
          <SpPrice value={0.01} />
        </View>
        <View className='wpGoods-info__num'>共1件</View>
      </View>
    </View>
  )
}

export default WaitPayGoodsItem
