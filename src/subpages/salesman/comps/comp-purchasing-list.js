import React from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './comp-purchasing-list.scss'

function CompPurchasingList(props) {
  const { items ,addCart=()=>{}} = props

  return (
    <View className='comp-purchasing-list'>
      <View className='comp-purchasing-list-item'>
        <SpImage src={items?.pics} />
        <View className='details'>
          <View>{items.title}</View>
          {/* <View className='new'>新品</View> */}
          <View>
            <SpPrice className='current' value={items.price} size={30} />
            {items.market_price - items.price > 0 && (
              <SpPrice lineThrough value={items.market_price} size={26} />
            )}
          </View>
          <View className='selector'>
            <View>
              <View className='selector-delivery'>
                <Text>库存: </Text>
                <Text>{items.store}</Text>
              </View>
              <View className='selector-delivery'>
                <Text>货号: </Text>
                <Text>{items.itemBn}</Text>
              </View>
            </View>
            <View className='increase' onClick={()=>addCart(items)}>+</View>
          </View>
        </View>
      </View>
    </View>
  )
}

CompPurchasingList.options = {
  addGlobalClass: true
}

export default CompPurchasingList
