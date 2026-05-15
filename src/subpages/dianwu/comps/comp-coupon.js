/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View, Text } from '@tarojs/components'
import { useTranslation, $t, ti } from '@/i18n'
import './comp-coupon.scss'

const CARD_TYPE_KEYS = {
  cash: '48b8293c.f23195',
  discount: '48b8293c.d94484',
  new_gift: '48b8293c.8bc752'
}

function CompCoupon(props) {
  useTranslation()
  const { children, info } = props
  const typeKey = CARD_TYPE_KEYS[info.cardType]

  return (
    <View className='comp-coupon'>
      <View className='coupon-inner'>
        <View className='coupon-hd'>
          {info.cardType == 'cash' && (
            <View className='coupon-value'>
              <Text className='symbol'>¥</Text>
              <Text className='value'>{info.reduceCost}</Text>
            </View>
          )}

          {info.cardType == 'discount' && (
            <View className='coupon-value'>
              <Text className='value'>{info.discount}</Text>
              <Text className='symbol'>{$t('48b8293c.96c015')}</Text>
            </View>
          )}

          <View className='coupon-tag'>{typeKey ? $t(typeKey) : ''}</View>
        </View>
        <View className='coupon-bd'>
          <View className='coupon-name'>{info?.title}</View>
          {info.leastCost > 0 && (
            <View className='coupon-desc'>{ti('48b8293c.47e317', [info.leastCost])}</View>
          )}
          <View className='coupon-datetime'>
            {ti('48b8293c.661906', [info?.beginDate, info?.endDate])}
          </View>
        </View>
        <View className='coupon-ft'>{children}</View>
      </View>
    </View>
  )
}

CompCoupon.options = {
  addGlobalClass: true
}

export default CompCoupon
