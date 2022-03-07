import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPrice } from '@/components'
import { classNames } from '@/utils'
import './index.scss'

function SpGoodsPrice (props) {
  const { info } = props
  if (!info) {
    return null
  }
  const { price, memberPrice, marketPrice, activityPrice } = info
  return (
    <View
      className={classNames('sp-goods-price', {
        'has-discount': !isNaN(memberPrice) || !isNaN(activityPrice)
      })}
    >
      <SpPrice className='sale-price' value={price} />
      {(!isNaN(memberPrice) || !isNaN(activityPrice)) && (
        <View className='discount'>
          <Text className='discount-txt'>{activityPrice ? '活动价' : '会员价'}</Text>
          <SpPrice className='discount-price' value={activityPrice ? activityPrice : memberPrice} />
        </View>
      )}
      {isNaN(memberPrice) && isNaN(activityPrice) && (
        <SpPrice className='market-price' lineThrough value={marketPrice} />
      )}
    </View>
  )
}

SpGoodsPrice.options = {
  addGlobalClass: true
}

export default SpGoodsPrice
