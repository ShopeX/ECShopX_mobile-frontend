import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpFloatLayout, SpButton, SpImage, SpPrice } from '@/components'
import './index.scss'

function SpSku (props) {
  const { info } = props
  if (!info) {
    return null
  }
  return (
    <SpFloatLayout
      className='sp-sku-select'
      open
      renderFooter={<SpButton resetText='加入购物车' confirmText='立即购买'></SpButton>}
    >
      <View className='sku-info'>
        <SpImage className='sku-image' width={170} height={170} />
        <View className='info-bd'>
          <View className='goods-sku-price'>
            <SpPrice value={100}></SpPrice>
          </View>
          <View className='goods-sku-txt'>xxxxx</View>
        </View>
      </View>
      <View className='sku-list'>
        <View className='sku-'></View>
      </View>
    </SpFloatLayout>
  )
}

SpSku.options = {
  addGlobalClass: true
}

export default SpSku
