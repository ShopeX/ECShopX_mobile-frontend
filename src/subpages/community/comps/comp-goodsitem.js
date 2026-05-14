/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import Taro from '@tarojs/taro'
import { AtProgress } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
import './comp-goodsitem.scss'

function CompGoodsItem(props) {
  useTranslation()
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
        {!nospec && <View className='spec-label'>{$t('2b7a222c.5d60de')}</View>}
        <View className='goods-spec'>{itemSpecDesc}</View>
        <View className='goods-store'>{ti('2b7a222c.e203b0', [store])}</View>
        <View className='goods-price'>
          <SpPrice primary value={price} />
        </View>
        {showProgress && minDeliveryNum > 0 && (
          <View className='activity-progress'>
            <AtProgress percent={progressValue} isHidePercent />
            <Text className='progress-txt'>
              {diff <= 0 ? $t('2b7a222c.d74a92') : ti('2b7a222c.d50b61', [diff])}
            </Text>
          </View>
        )}
        {!showProgress && minDeliveryNum > 0 && (
          <View className='delivery-num'>{ti('2b7a222c.596cf6', [minDeliveryNum])}</View>
        )}
      </View>
    </View>
  )
}

CompGoodsItem.options = {
  addGlobalClass: true
}

export default CompGoodsItem
