import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View } from '@tarojs/components'
import './comp-gift.scss'

function CompGift(props) {
  return (
    <View className='comp-gift'>
      <View className='gift-tag'>赠品</View>
      <View className='gift-info'>
        <View className='title'>
          我商品名我商品名我商品名最多只显示一行我商品名我商品名我商品名最多只显示一行
        </View>
        <View className='sku-num'>
          <View className='sku'>白色、XL、印花</View>
          <View className='num'>数量：20</View>
        </View>
      </View>
    </View>
  )
}

CompGift.options = {
  addGlobalClass: true
}

export default CompGift
