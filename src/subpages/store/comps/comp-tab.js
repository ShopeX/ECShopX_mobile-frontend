import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { SpImage, SpLogin, SpShopCoupon, SpPrice } from '@/components'
import { pickBy, showToast, classNames } from '@/utils'
import S from '@/spx'
import './comp-tab.scss'
import { goToAuthPage } from '@/utils/platform.h5'

const initialState = {
  xx: 123,
  fav: false,
  couponList: [],
  extend: false
}
function CompTab(props) {
  const { dtid = 0, storeInfo = {} } = props
  const [state, setState] = useImmer(initialState)
  const { fav, couponList, extend, xx } = state

  return (
    <View className='comp-shop-brand'>
      <View className='comp-shop-brand-gwc'>
        <View
          className='comp-shop-brand-gwc-num'
          onClick={() => {
            Taro.navigateTo({
              url: '/pages/cart/espier-index'
            })
          }}
        >
          <Text className='iconfont icon-gouwuche2' />
          <View className='nums'>12</View>
        </View>
        <SpPrice value={xx}></SpPrice>
        <Text className='money'>¥ 1,000</Text>
      </View>
      <View className='settlement'>去结算</View>
    </View>
  )
}

CompTab.options = {
  addGlobalClass: true
}

export default CompTab
