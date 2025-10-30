// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { VERSION_PLATFORM, classNames, isWeixin, VERSION_STANDARD } from '@/utils'

import './home-header.scss'

function WgtHomeHeader(props) {
  const { children, jump = true, isSetHight } = props
  const { location = {} } = useSelector((state) => state.user)
  const { openScanQrcode, entryStoreByLBS } = useSelector((state) => state.sys)
  const { shopInfo } = useSelector((state) => state.shop)
  const handleScanCode = () => {}

  return (
    <View className={classNames('home-header')}>
      {VERSION_STANDARD && entryStoreByLBS && (
        <View
          className='left-block'
          onClick={() => {
            Taro.navigateTo({
              url: '/subpages/store/list'
            })
          }}
        >
          <View className='shop-name'>{shopInfo?.name || '总店'}</View>
          <Text className='iconfont icon-qianwang-01'></Text>
        </View>
      )}

      {VERSION_PLATFORM && (
        <View
          className='left-block'
          onClick={() => {
            if (jump) {
              Taro.navigateTo({
                url: '/subpages/ecshopx/nearly-shop'
              })
            }
          }}
        >
          <View className='address'>{location?.address || '北京市北京市昌平区'}</View>
          <Text className='iconfont icon-qianwang-01'></Text>
        </View>
      )}

      <View className='children-block'>{children}</View>

      {isWeixin && openScanQrcode == 1 && jump && (
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
