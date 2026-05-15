/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import { $t, useTranslation } from '@/i18n'
import './comp-purchasing-list.scss'

function CompPurchasingList(props) {
  useTranslation()
  const { items, addCart = () => {} } = props

  return (
    <View className='comp-purchasing-list'>
      <View className='comp-purchasing-list-item'>
        <SpImage src={items?.pics} />
        <View className='details'>
          <View>{items.title}</View>
          {/* <View className='new'>新品</View> */}
          <View>
            <SpPrice className='current' value={items.price} size={30} />
            {items.market_price - items.price > 0 && (
              <SpPrice lineThrough value={items.market_price} size={26} />
            )}
          </View>
          <View className='selector'>
            <View>
              <View className='selector-delivery'>
                <Text>{$t('9477baa6.992b9a')}</Text>
                <Text>{items.store}</Text>
              </View>
              <View className='selector-delivery'>
                <Text>{$t('9477baa6.e2dd06')}</Text>
                <Text>{items.itemBn}</Text>
              </View>
            </View>
            <View className='increase' onClick={() => addCart(items)}>
              +
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

CompPurchasingList.options = {
  addGlobalClass: true
}

export default CompPurchasingList
