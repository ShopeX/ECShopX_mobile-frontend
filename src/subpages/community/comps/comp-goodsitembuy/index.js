import React from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'

import './index.scss'

const CompGoodsItemBuy = () => {
  return (
    <View className='comp-goodsitembuy'>
      <View className='comp-goodsitembuy-img'>
        <SpImage />
        <Text className='comp-goodsitembuy-img__num'>剩余999件</Text>
      </View>
      <View className='comp-goodsitembuy-share'>
        <Text
          className='icon iconfont icon-gouwuche'
        ></Text>
      </View>

      <View className='comp-goodsitembuy-info'>
        <View className='comp-goodsitembuy-info__name'>测试商品</View>
        <View className='comp-goodsitembuy-info__specs'>111</View>
        <View className='comp-goodsitembuy-info__tag'>团长推荐</View>
        <View className='comp-goodsitembuy-info__tag'>网红爆款</View>
        <View className='comp-goodsitembuy-info__price'>
          <SpPrice value={99} />
          <SpPrice lineThrough size={24} value={100}></SpPrice>
        </View>
      </View>

      <View className='hasbuy-num'>
        <Text className=''>已团12</Text>
      </View>

      <View className='comp-goodsitembuy-handle'>
        <View className='comp-goodsitembuy-handle__symbol comp-goodsitembuy-handle__reduce'>-</View>
        <View className='comp-goodsitembuy-handle__num'>10</View>
        <View className='comp-goodsitembuy-handle__symbol comp-goodsitembuy-handle__plus'>+</View>
      </View>
    </View>
  )
}

export default CompGoodsItemBuy
