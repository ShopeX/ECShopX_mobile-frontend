import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './index.scss'

function SpGoodsCell (props) {
  const { info } = props

  if (!info) {
    return null
  }

  return (
    <View className='sp-goods-cell'>
      <View className='goods-item-hd'>
        <SpImage src={info.img} width={170} height={170} />
      </View>
      <View className='goods-item-bd'>
        <View className='item-hd'>
          <View className='goods-title'>{info.itemName}</View>
        </View>
        <View className='item-bd'>
          <View className='goods-sku'>{info.sku}</View>
          {info.num && <Text className='item-num'>x {info.num}</Text>}
        </View>
        <View className='item-ft'>
          <SpPrice value={info.price}></SpPrice>
          <SpPrice lineThrough value={info.marketPrice}></SpPrice>
        </View>
      </View>
    </View>
  )
}

SpGoodsCell.options = {
  addGlobalClass: true
}

export default SpGoodsCell
