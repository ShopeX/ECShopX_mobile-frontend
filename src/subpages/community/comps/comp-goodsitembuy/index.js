import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'

import './index.scss'

const CompGoodsItemBuy = (props) => {
  const { isShare = false } = props
  const { isMarket = false } = props
  const { isLeft = false } = props
  const { isTag = false } = props
  const { isSpecs = false } = props
  return (
    <View className='comp-goodsitembuy'>
      <View className='comp-goodsitembuy-img'>
        <SpImage />
        {isLeft && <Text className='comp-goodsitembuy-img__num'>剩余999件</Text>}
      </View>
      {isShare && (
        <View className='comp-goodsitembuy-share'>
          <Text className='icon iconfont icon-gouwuche'></Text>
        </View>
      )}

      <View className='comp-goodsitembuy-info'>
        <View className='comp-goodsitembuy-info__name'>测试商品</View>
        {isSpecs && <View className='comp-goodsitembuy-info__specs'>111</View>}
        {isTag && (
          <View>
            <View className='comp-goodsitembuy-info__tag'>团长推荐</View>
            <View className='comp-goodsitembuy-info__tag'>网红爆款</View>
          </View>
        )}
        <View>
          <Text className='comp-goodsitembuy-info__num'>10件起购</Text>
        </View>
        <View className='comp-goodsitembuy-info__price'>
          <SpPrice value={99} />
          {isMarket && <SpPrice lineThrough size={24} value={100}></SpPrice>}
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
