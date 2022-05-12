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

  const { pic, itemName, store, price, itemSpecDesc,  buyNum, minDeliveryNum, nospec } = info

  const handleClickGoodsDetail = () => {
    const { itemId, distributorId } = info
    Taro.navigateTo({
      url: `/subpages/community/espier-detail?id=${itemId}&dtid=${distributorId}`
    })
  }

  const diff = minDeliveryNum - buyNum
  let progressValue = 0
  if(diff <= 0) {
    progressValue = 100
  } else {
    progressValue = buyNum / minDeliveryNum * 100
  }

  return (
    <View className='comp-goods-item'>
      <View className='item-hd' onClick={handleClickGoodsDetail}>
        <SpImage src={pic} width={160} height={160} />
      </View>
      <View className='item-bd'>
        <View className='goods-name'>{itemName}</View>
        { !nospec && <View className="spec-label">多规格</View>}
        <View className='goods-spec'>{itemSpecDesc}</View>
        <View className='goods-store'>{`库存：${store}`}</View>
        <View className='goods-price'>
          <SpPrice primary value={price} />
        </View>
        {showProgress && (minDeliveryNum > 0) && (
          <View className='activity-progress'>
            <AtProgress percent={progressValue} isHidePercent />
            <Text className='progress-txt'>{diff <= 0 ? '已满足起送' : `还差${diff}件起送`}</Text>
          </View>
        )}
        {
          !showProgress && minDeliveryNum > 0 && <View className="delivery-num">{`${minDeliveryNum}件起送`}</View>
        }
      </View>
    </View>
  )
}

CompGoodsItem.options = {
  addGlobalClass: true
}

export default CompGoodsItem
