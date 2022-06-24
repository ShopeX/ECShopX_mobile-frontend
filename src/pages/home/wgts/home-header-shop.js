import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { isWeixin, classNames } from '@/utils'

import './home-header-shop.scss'

function WgtHomeHeaderShop(props) {
  const { children, isSetHight } = props
  const { openScanQrcode, openStore, openLocation } = useSelector((state) => state.sys)
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
      {openStore && openLocation == 1 && (
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
