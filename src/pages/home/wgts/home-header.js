import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { SG_APP_CONFIG } from '@/consts'
import { toggleTouchMove } from '@/utils/dom'
import { getQueryVariable, isWeixin } from '@/utils'

import './home-header.scss'

function WgtHomeHeader( props ) {
  const { children } = props
  const { openScanQrcode } = Taro.getStorageSync( SG_APP_CONFIG );
  const { location = {} } = useSelector(state => state.user)

  const handlePickStore = () => {
    Taro.navigateTo( {
      url: '/subpages/ecshopx/nearly-shop'
    })
  }

  const handleScanCode = () => {

  }

  return (
    <View className='home-header'>
      <View className='nearly-shop' onClick={handlePickStore}>
        <View className='address'>{location.address || '北京市北京市昌平区'}</View>
        <Text className='iconfont icon-qianwang-01'></Text>
      </View>

      <View className='children-block'>
        {children}
      </View>
      
      {isWeixin && openScanQrcode == 1 && (
        <View className='scancode' onClick={handleScanCode}>
          <Text className='iconfont icon-scan'></Text>
        </View>
      )}
    </View>
  )
}

WgtHomeHeader.options = {
  addGlobalClass: true
}

export default WgtHomeHeader