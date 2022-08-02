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
