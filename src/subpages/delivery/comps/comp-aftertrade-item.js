/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice, SpTradeItem } from '@/components'
import { VERSION_STANDARD } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import './comp-aftertrade-item.scss'

const AFTERSALE_STATUS_KEYS = {
  '0': '7c005828.047109',
  '1': '7c005828.5d459d',
  '2': '7c005828.5ad605',
  '3': '7c005828.dbf36d',
  '4': '7c005828.9c5850'
}

function CompTradeItem(props) {
  useTranslation()
  const { info } = props
  if (!info) {
    return null
  }
  const {
    aftersalesBn,
    distributorInfo,
    createdTime,
    aftersalesStatus,
    items,
    refundFee,
    orderClass = 'normal',
    distributorId,
    userId
  } = info

  const onViewTradeDetail = () => {
    Taro.navigateTo({
      url: `/subpages/delivery/after-sale-detail?aftersales_bn=${aftersalesBn}&user_id=${userId}`
    })
  }

  const onViewStorePage = (e) => {
    if (!VERSION_STANDARD) {
      e.stopPropagation()
      Taro.navigateTo({
        url: `/subpages/store/index?id=${distributorId}`
      })
    }
  }

  const totalNum = items.reduce((preVal, item) => preVal + item.num, 0)
  const statusKey = AFTERSALE_STATUS_KEYS[String(aftersalesStatus)]
  const statusText = statusKey ? $t(statusKey) : ''

  return (
    <View className='comp-tradeitem'>
      <View className='trade-item-hd' onClick={onViewTradeDetail}>
        <View>
          <View className='shop-info' onClick={onViewStorePage}>
            <SpImage src={distributorInfo?.logo} width={100} height={100} />
            <View className='shop-name'>
              {distributorInfo?.name}
              {!VERSION_STANDARD && <Text className='iconfont icon-qianwang-01'></Text>}
            </View>
          </View>
          <View className='trade-no'>{ti('7c005828.2957dc', [aftersalesBn])}</View>
          <View className='trade-time'>{ti('7c005828.bdfc53', [createdTime])}</View>
        </View>
        <View className='trade-state'>{statusText}</View>
      </View>
      <View className='trade-item-bd' onClick={onViewTradeDetail}>
        {items.map((good, idx) => (
          <SpTradeItem
            key={idx}
            info={{
              ...good
            }}
          />
        ))}

        <View className='trade-total'>
          <View className='delivery'></View>
          {orderClass == 'normal' && (
            <View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Text className='num'>{ti('7c005828.17d01f', [totalNum])}</Text>
              <Text className='label'>{$t('7c005828.a0cd4c')}</Text>
              <SpPrice value={refundFee} size={38} />
            </View>
          )}
        </View>
      </View>

      <View className='trade-item-ft'></View>
    </View>
  )
}

CompTradeItem.options = {
  addGlobalClass: true
}

export default CompTradeItem
