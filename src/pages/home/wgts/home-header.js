import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { toggleTouchMove } from '@/utils/dom'
import { VERSION_PLATFORM, classNames, isWeixin } from '@/utils'

import './home-header.scss'

function WgtHomeHeader(props) {
  const { children, isSetHight } = props
  const { location = {} } = useSelector((state) => state.user)
  const { openScanQrcode, openLocation } = useSelector((state) => state.sys)

  const handlePickStore = () => {
    Taro.navigateTo({
      url: '/subpages/ecshopx/nearly-shop'
    })
  }

  const handleScanCode = () => {}

  return (
    <View className={classNames('home-header', !isSetHight && 'cus-home-header')}>
      {VERSION_PLATFORM && openLocation == 1 && (
        <View className='nearly-shop' onClick={handlePickStore}>
          <View className='address'>{location.address || '北京市北京市昌平区'}</View>
          <Text className='iconfont icon-qianwang-01'></Text>
        </View>
      )}

      <View className='children-block'>{children}</View>

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
