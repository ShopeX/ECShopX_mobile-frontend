/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
import './wp-goods-item.scss'

const WaitPayGoodsItem = () => {
  useTranslation()
  return (
    <View className='wpGoods'>
      <View className='wpGoods-img'>
        <SpImage />
      </View>

      <View className='wpGoods-info'>
        <View className='wpGoods-info__name'>
          <View>{$t('fa3aed62.b6ab74')}</View>
          <SpPrice value={0.01} />
        </View>
        <View className='wpGoods-info__num'>{ti('b1a8838b.17d01f', [1])}</View>
      </View>
    </View>
  )
}

export default WaitPayGoodsItem
