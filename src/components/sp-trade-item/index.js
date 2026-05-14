/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
import './index.scss'

function SpTradeItem(props) {
  useTranslation()
  const { info, onClick = () => {} } = props
  if (!info) return null
  const {
    pic,
    itemName,
    itemPoint,
    price,
    itemSpecDesc,
    num,
    orderClass = 'normal',
    isPrescription
  } = info
  const { pointName } = useSelector((state) => state.sys)

  const onClickItem = () => {
    onClick(info)
  }

  return (
    <View className='sp-trade-item' onClick={onClickItem}>
      <View className='tradeitem-hd'>
        <SpImage src={pic} width={130} />
      </View>
      <View className='tradeitem-bd'>
        <View className='goods-info-hd'>
          <View className='name'>
            {isPrescription == 1 && (
              <Text className='prescription-drug'>{$t('7d82f6d2.e8b7e1')}</Text>
            )}
            {itemName}
          </View>
          {orderClass == 'pointsmall' && (
            <Text style={{ display: 'flex', justifyContent: 'flex-end', width: '150rpx' }}>
              {`${pointName}: ${itemPoint}`}{' '}
              {price > 0 ? (
                <Text>
                  +<SpPrice value={price} />
                </Text>
              ) : null}
            </Text>
          )}
          {orderClass == 'normal' && <SpPrice value={price} />}
        </View>
        <View className='goods-info-bd'>
          <Text className='spec-desc'>{itemSpecDesc}</Text>
          <Text className='num'>{ti('bd6df9b9.60c735', [num])}</Text>
        </View>
      </View>
    </View>
  )
}

SpTradeItem.options = {
  addGlobalClass: true
}

export default SpTradeItem
