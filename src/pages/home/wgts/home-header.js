import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { VERSION_PLATFORM, classNames, isWeixin, VERSION_STANDARD } from '@/utils'

import './home-header.scss'

function WgtHomeHeader(props) {
  const { children, isSetHight } = props
  const { location = {} } = useSelector((state) => state.user)
  const { openScanQrcode, openStore, openLocation } = useSelector((state) => state.sys)
  const {
    shopInfo: { store_name }
  } = useSelector((state) => state.shop)

  const handleScanCode = () => {}

  return (
    <View className={classNames('home-header')}>
      {VERSION_STANDARD && openStore && openLocation == 1 && (
        <View
          className='shop-left'
          onClick={() => {
            Taro.navigateTo({
              url: '/subpages/store/list'
            })
          }}
        >
          <View className='shop-name'>{store_name || '暂无店铺信息'}</View>
          <Text className='iconfont icon-qianwang-01'></Text>
        </View>
      )}

      {VERSION_PLATFORM && (
        <View
          className='nearly-shop'
          onClick={() => {
            Taro.navigateTo({
              url: '/subpages/ecshopx/nearly-shop'
            })
          }}
        >
          <View className='address'>{location?.address || '北京市北京市昌平区'}</View>
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
