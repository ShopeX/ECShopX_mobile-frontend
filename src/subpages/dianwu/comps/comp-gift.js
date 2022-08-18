import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View } from '@tarojs/components'
import './comp-gift.scss'

function CompGift(props) {
  const { itemName, item_spec_desc, gift_num } = props.info
  return (
    <View className='comp-gift'>
      <View className='gift-tag'>赠品</View>
      <View className='gift-info'>
        <View className='title'>{itemName}</View>
        <View className='sku-num'>
          <View>{item_spec_desc && <View className='sku'>{item_spec_desc}</View>}</View>
          <View className='num'>数量：{gift_num}</View>
        </View>
      </View>
    </View>
  )
}

CompGift.options = {
  addGlobalClass: true
}

export default CompGift
