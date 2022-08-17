import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import './comp-coupon.scss'

function CompCoupon(props) {
  const { children } = props
  return (
    <View className='comp-coupon'>
      <View className='coupon-inner'>
        <View className='coupon-hd'>
          <View className='coupon-value'>
            <Text className='symbol'>¥</Text>
            <Text className='value'>15</Text>
          </View>
          <View className='coupon-tag'>满减券</View>
        </View>
        <View className='coupon-bd'>
          <View className='coupon-name'>
            新人券满2万减9999如果文字过多可换行显示新人券满2万减9999如果文字过多可换行显示
          </View>
          <View className='coupon-desc'>满20可用</View>
          <View className='coupon-datetime'>有效期: 2022.06.15 - 2023.06.01</View>
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
