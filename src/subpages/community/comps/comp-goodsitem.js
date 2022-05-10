import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { AtProgress } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './comp-goodsitem.scss'

function CompGoodsItem(props) {
  const { info, showProgress = false } = props
  if (!info) {
    return
  }

  const { pic, itemName, store, price, itemSpecDesc } = info

  const handleClickGoodsDetail = () => {
    const { itemId, distributorId } = info
    Taro.navigateTo({
      url: `/subpages/community/espier-detail?id=${itemId}&dtid=${distributorId}`
    })
  }

  return (
    <View className='comp-goods-item'>
      <View className='item-hd' onClick={handleClickGoodsDetail}>
        <SpImage src={pic} width={160} height={160} />
      </View>
      <View className='item-bd'>
        <View className='goods-name'>{itemName}</View>
        <View className='goods-spec'>{itemSpecDesc}</View>
        <View className='goods-store'>{`库存：${store}`}</View>
        <View className='goods-price'>
          <SpPrice primary value={price} />
        </View>
        {showProgress && (
          <View className='activity-progress'>
            <AtProgress percent={25} isHidePercent />
            <Text className='progress-txt'>还差50件起送</Text>
          </View>
        )}
      </View>
    </View>
  )
}

CompGoodsItem.options = {
  addGlobalClass: true
}

export default CompGoodsItem
