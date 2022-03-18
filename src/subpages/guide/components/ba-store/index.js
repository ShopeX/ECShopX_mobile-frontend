import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
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
      <Image
        className='ba-avatar'
        mode='widthFix'
        src={guideInfo.avatar || '/assets/imgs/group.png'}
      />
      <View className='ba-store-bd'>
        <View className='guide-name'>{guideInfo.salesperson_name || '导购货架'}</View>
        {storeInfo && <View className='store-name'>{storeInfo.store_name}</View>}
      </View>
    </View>
  )
}

BaStore.options = {
  addGlobalClass: true
}

export default BaStore
