import React, { useEffect, useState } from 'react'
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
    isSpecs = false
  } = props
  // const [state, setState] = useImmer(initialState)
  // const { num } = state

  const onNumChange = (num) => {
    onChange(num)
  }

  return (
    <View className='comp-goodsitembuy'>
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
          <SpPrice value={info.price} size={24} />
          {/* {isMarket && <SpPrice lineThrough size={22} unit='cent' value={info.market_price} />} */}
        </View>
      </View>

      <View className='hasbuy-num'>{/* <Text className=''>已团{info.buy_num}</Text> */}</View>

      <View className='comp-goodsitembuy-handle'>
        <SpInputNumber value={info.num} min={0} onChange={onNumChange} />
        {/* {num == 0
           ? <Button size='mini' className='add-btn' onClick={() => onNumChange(1)}>
              加购商品
            </Button>
          :  <SpInputNumber
              value={num}
              min={1}
              // max={limitNum}
              onChange={onNumChange}
            />
        } */}

        {/* <View className='comp-goodsitembuy-handle__symbol comp-goodsitembuy-handle__reduce'>-</View>
        <View className='comp-goodsitembuy-handle__num'>10</View>
        <View className='comp-goodsitembuy-handle__symbol comp-goodsitembuy-handle__plus'>+</View> */}
      </View>
    </View>
  )
}

export default CompGoodsItemBuy
