import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import './comp-coupon.scss'

function CompCoupon(props) {
  const { children, info } = props
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
              <Text className='symbol'>折</Text>
            </View>
          )}

          <View className='coupon-tag'>
            {
              {
                'cash': '满减券',
                'discount': '满折券',
                'new_gift': '兑换券'
              }[info.cardType]
            }
          </View>
        </View>
        <View className='coupon-bd'>
          <View className='coupon-name'>{info?.title}</View>
          {info.leastCost > 0 && <View className='coupon-desc'>满{info.leastCost}可用</View>}
          <View className='coupon-datetime'>{`有效期: ${info?.beginDate} - ${info?.endDate}`}</View>
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
