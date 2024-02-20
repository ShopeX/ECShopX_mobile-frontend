import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './index.scss'

function SpTradeItem(props) {
  const { info } = props
  if(!info) return null
  const { pic, itemName, price, itemSpecDesc, num } = info
  return (
    <View className='sp-trade-item'>
      <View className='tradeitem-hd'>
        <SpImage src={pic} width={130} height={130} />
      </View>
      <View className='tradeitem-bd'>
        <View className='goods-info-hd'>
          <Text className='name'>{itemName}</Text>
          <SpPrice value={price} />
        </View>
        <View className='goods-info-bd'>
          <Text className='spec-desc'>{itemSpecDesc}</Text>
          <Text className='num'>{`x ${num}`}</Text>
        </View>
      </View>
    </View>
  )
}

SpTradeItem.options = {
  addGlobalClass: true
}

export default SpTradeItem
