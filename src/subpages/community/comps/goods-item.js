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
