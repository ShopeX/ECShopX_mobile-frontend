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
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpImage } from '@/components'
import './index.scss'

function BaStore(props) {
  const {
    guideInfo = {
      avatar: null,
      salesperson_name: null
    }
  } = props

  const { storeInfo } = useSelector((state) => state.guide)

  return (
    <View className='ba-store'>
      <SpImage className='ba-avatar' src={guideInfo?.avatar || 'user_icon.png'} />
      <View className='ba-store-bd'>
        <View className='guide-name'>{guideInfo.salesperson_name || '未知'}</View>
        {storeInfo && <View className='store-name'>{storeInfo.store_name}</View>}
      </View>
    </View>
  )
}

BaStore.options = {
  addGlobalClass: true
}

export default BaStore
