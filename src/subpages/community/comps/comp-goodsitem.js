import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './comp-goodsitem.scss'

function CompGoodsItem(props) {
  return (
    <View className='comp-goods-item'>
      <View className='item-hd'>
        <SpImage width={160} height={160} />
      </View>
      <View className='item-bd'>
        <View className='goods-name'>金龙鱼</View>
        <View className='goods-sku'>库存：50</View>
        <View className='goods-price'>
          <SpPrice value={100} />
        </View>
      </View>
    </View>
  )
}

CompGoodsItem.options = {
  addGlobalClass: true
}

export default CompGoodsItem
