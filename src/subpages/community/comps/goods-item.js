/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './goods-item.scss'

const GoodsItem = () => {
  useTranslation()
  return (
    <View className='goods'>
      <View className='goods-img'>
        <SpImage />
      </View>

      <View className='goods-info'>
        <View className='goods-info__name'>{$t('a13da772.f18799')}</View>
        <View className='goods-info__specs'>{$t('a13da772.471154')}</View>
        <Text className='goods-info__num'>{$t('a13da772.febd62')}</Text>
        <View className='goods-info__price'>
          <SpPrice value={99} noDecimal />
        </View>
      </View>

      <View className='goods-handle'>
        <View className='goods-handle__symbol goods-handle__reduce'>-</View>
        <View className='goods-handle__num'>10</View>
        <View className='goods-handle__symbol goods-handle__plus'>+</View>
      </View>
    </View>
  )
}

export default GoodsItem
