// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
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

  const { pic, itemName, store, price, itemSpecDesc, buyNum, minDeliveryNum, nospec } = info

  const handleClickGoodsDetail = () => {
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
    <View className='comp-goods-item'>
      <View className='item-hd' onClick={handleClickGoodsDetail}>
        <SpImage src={pic} width={160} height={160} />
      </View>
      <View className='item-bd'>
        <View className='goods-name'>{itemName}</View>
        {!nospec && <View className='spec-label'>多规格</View>}
        <View className='goods-spec'>{itemSpecDesc}</View>
        <View className='goods-store'>{`库存：${store}`}</View>
        <View className='goods-price'>
          <SpPrice primary value={price} />
        </View>
        {showProgress && minDeliveryNum > 0 && (
          <View className='activity-progress'>
            <AtProgress percent={progressValue} isHidePercent />
            <Text className='progress-txt'>{diff <= 0 ? '已满足起送' : `还差${diff}件起送`}</Text>
          </View>
        )}
        {!showProgress && minDeliveryNum > 0 && (
          <View className='delivery-num'>{`${minDeliveryNum}件起送`}</View>
        )}
      </View>
    </View>
  )
}

CompGoodsItem.options = {
  addGlobalClass: true
}

export default CompGoodsItem
