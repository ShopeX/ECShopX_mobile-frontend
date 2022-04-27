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
