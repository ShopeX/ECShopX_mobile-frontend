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
  fav: false,
  couponList: [],
  extend: false
}
function CompTab(props) {
  const {shopCartCount} = useSelector((state) => state.cart)

  const { settlement = {} } = props
  const [state, setState] = useImmer(initialState)
  const { fav, couponList, extend } = state

  if(!shopCartCount) {
    return null
  }

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
          {shopCartCount.cart_total_num && <View className='nums'>{shopCartCount.cart_total_num}</View>}
        </View>
        {shopCartCount.total_fee && <SpPrice value={shopCartCount.total_fee / 100}></SpPrice>}
        {/* {shopCartCount.discount_fee && <Text className='money'>¥ {formatMoney(shopCartCount.discount_fee)}</Text>} */}
      </View>
      {shopCartCount.shop_id && <View className='settlement' onClick={()=>settlement()}>去结算</View>}
    </View>
  )
}

CompTab.options = {
  addGlobalClass: true
}

export default CompTab
