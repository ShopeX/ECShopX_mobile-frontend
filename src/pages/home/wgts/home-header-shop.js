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
import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { isWeixin, classNames } from '@/utils'

import './home-header-shop.scss'

function WgtHomeHeaderShop(props) {
  const { children, isSetHight } = props
  const { openScanQrcode, entryStoreByLBS } = useSelector((state) => state.sys)
  const {
    shopInfo: { store_name }
  } = useSelector((state) => state.shop)

  const handlePickStore = () => {
    Taro.navigateTo({
      url: '/subpages/store/list'
    })
  }

  const handleScanCode = () => {}

  return (
    <View className={classNames('home-header-shop', !isSetHight && 'cus-home-header')}>
      {entryStoreByLBS && (
        <View className='shop-left' onClick={handlePickStore}>
          <View className='shop-name'>{store_name || '暂无店铺信息'}</View>
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

WgtHomeHeaderShop.options = {
  addGlobalClass: true
}

export default WgtHomeHeaderShop
