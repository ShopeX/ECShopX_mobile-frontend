import React from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './comp-purchasing-list.scss'

function CompPurchasingList(props) {
  const { items } = props

  return (
    <View className='comp-purchasing-list'>
      <View className='comp-purchasing-list-item'>
        <SpImage src='https://img2.baidu.com/it/u=3227619927,365499885&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1715965200&t=660d198a9636f02a2f0f591142128c1a' />
        <View className='details'>
          <View>{items.title}</View>
          <View className='new'>新品</View>
          <View>
            <SpPrice className='current' value={items.price} size={30} />
            <SpPrice lineThrough value={items.market_price} size={26} />
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
            <View className='increase'>+</View>
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
