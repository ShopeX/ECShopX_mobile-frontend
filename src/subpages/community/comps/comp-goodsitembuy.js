import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { SpImage, SpPrice, SpInputNumber } from '@/components'
import { useImmer } from 'use-immer'

import './comp-goodsitembuy.scss'

const initialState = {
  num: 1,
  // limitNum: 10,
  max: 9
}
const CompGoodsItemBuy = (props) => {
  const {
    info = {},
    onChange = () => {},
    isShare = false,
    isMarket = false,
    isLeft = false,
    isTag = false,
    isSpecs = false,
    hideInputNumber = false
  } = props
  // const [state, setState] = useImmer(initialState)
  // const { num } = state

  const onNumChange = (num) => {
    onChange(num)
  }

  const handleClickGoodsDetail = () => {
    const { itemId, distributorId } = info
    Taro.navigateTo({
      url: `/subpages/community/espier-detail?id=${itemId}&dtid=${distributorId}`
    })
  }

  return (
    <View className='comp-goodsitembuy' onClick={handleClickGoodsDetail}>
      <View className='comp-goodsitembuy-img'>
        <SpImage src={info.pic} width={160} height={160} />
      </View>
      {/* {isShare && (
        <View className='comp-goodsitembuy-share'>
          <Text className='icon iconfont icon-gouwuche'></Text>
        </View>
      )} */}

      <View className='comp-goodsitembuy-info'>
        <View className='comp-goodsitembuy-info__name'>{info.itemName}</View>
        {/* {isSpecs && <View className='comp-goodsitembuy-info__specs'>111</View>} */}
        {/* {isTag && (
          <View>
            <View className='comp-goodsitembuy-info__tag'>团长推荐</View>
            <View className='comp-goodsitembuy-info__tag'>网红爆款</View>
          </View>
        )} */}
        <View>{/* <Text className='comp-goodsitembuy-info__num'>10件起购</Text> */}</View>
        <View className='comp-goodsitembuy-info__price'>
          <SpPrice value={info.price} />
          {/* {isMarket && <SpPrice lineThrough size={22} unit='cent' value={info.market_price} />} */}
        </View>
      </View>

      <View className='hasbuy-num'>{/* <Text className=''>已团{info.buy_num}</Text> */}</View>

      {!hideInputNumber && (
        <View className='comp-goodsitembuy-handle'>
          <SpInputNumber value={info.num} min={0} onChange={onNumChange} />
        </View>
      )}
    </View>
  )
}

export default CompGoodsItemBuy
