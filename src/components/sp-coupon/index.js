import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

function SpCoupon(props) {
  return <View className='sp-coupon'></View>
}

SpCoupon.options = {
  addGlobalClass: true
}

export default SpCoupon
