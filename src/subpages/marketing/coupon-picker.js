import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './coupon-picker.scss'

function CouponPicker(props) {
  return <View className='page-marketing-coupon'></View>
}

CouponPicker.options = {
  addGlobalClass: true
}

export default CouponPicker
