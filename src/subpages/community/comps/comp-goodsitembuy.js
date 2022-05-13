import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { AtButton, AtProgress } from 'taro-ui'
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
    hideInputNumber = false,
    onChangeSku = () => {}
  } = props
  // const [state, setState] = useImmer(initialState)
  // const { num } = state
  const { buyNum, minDeliveryNum } = info

  const onNumChange = (num) => {
    onChange(num)
  }

  const handleClickGoodsDetail = (e) => {
    const { itemId, distributorId } = info
    Taro.navigateTo({
      url: `/subpages/community/espier-detail?id=${itemId}&dtid=${distributorId}`
    })
  }

  const diff = minDeliveryNum - buyNum
  let progressValue = 0
  if (diff <= 0) {
    progressValue = 100
  } else {
    progressValue = (buyNum / minDeliveryNum) * 100
  }

  return (
    <View className='comp-goodsitembuy'>
      <View className='comp-goodsitembuy-img' onClick={handleClickGoodsDetail}>
        <SpImage src={info.pic} width={160} height={160} />
      </View>
      <View className='comp-goodsitembuy-info'>
        <View className='comp-goodsitembuy-info__name'>{info.itemName}</View>
        <View className='comp-goodsitembuy-info__price'>
          <SpPrice value={info.price} />
        </View>
        {minDeliveryNum > 0 && (
          <View className='activity-progress'>
            <AtProgress percent={progressValue} isHidePercent />
            <Text className='progress-txt'>{diff <= 0 ? '已满足起送' : `还差${diff}件起送`}</Text>
          </View>
        )}
      </View>

      {!hideInputNumber && (
        <View className='comp-goodsitembuy-handle'>
          {info.nospec && <SpInputNumber value={info.num} min={0} onChange={onNumChange} />}
          {!info.nospec && (
            <AtButton circle type='primary' onClick={onChangeSku}>
              选择规格
            </AtButton>
          )}
        </View>
      )}
    </View>
  )
}

export default CompGoodsItemBuy
