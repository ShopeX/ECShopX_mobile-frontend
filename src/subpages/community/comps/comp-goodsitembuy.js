import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { AtProgress } from 'taro-ui'
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

  const handleClickGoodsDetail = (e) => {
    const { itemId, distributorId } = info
    Taro.navigateTo({
      url: `/subpages/community/espier-detail?id=${itemId}&dtid=${distributorId}`
    })
  }

  return (
    <View className='comp-goodsitembuy' >
      <View className='comp-goodsitembuy-img' onClick={handleClickGoodsDetail}>
        <SpImage src={info.pic} width={160} height={160} />
      </View>
      <View className='comp-goodsitembuy-info'>
        <View className='comp-goodsitembuy-info__name'>{info.itemName}</View>
        <View className='comp-goodsitembuy-info__price'>
          <SpPrice value={info.price} />
        </View>
        <View className="activity-progress">
          <AtProgress percent={25} isHidePercent />
          <Text className='progress-txt'>还差50件起送</Text>
        </View>
      </View>


      {!hideInputNumber && (
        <View className='comp-goodsitembuy-handle'>
          <SpInputNumber value={info.num} min={0} onChange={onNumChange} />
        </View>
      )}
    </View>
  )
}

export default CompGoodsItemBuy
