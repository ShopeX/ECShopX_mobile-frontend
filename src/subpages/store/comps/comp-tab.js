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
  const { fav, couponList, extend, xx } = state



  const formatMoney = (num)=> {
    const numString = String(num)
    const [integerPart, decimalPart] = numString.split('.')

    let formattedInteger = ''
    for (let i = integerPart.length - 1, j = 1; i >= 0; i--, j++) {
      formattedInteger = integerPart[i] + formattedInteger
      if (j % 3 === 0 && i !== 0) {
        formattedInteger = ',' + formattedInteger
      }
    }

    let result = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger
    return result
  }

  return (
    <View className='comp-shop-brand'>
      <View className='comp-shop-brand-gwc'>
        {console.log('shopCartCountshopCartCountshopCartCountshopCartCountshopCartCountshopCartCount',shopCartCount)}
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
        {shopCartCount.total_fee && <SpPrice value={shopCartCount.total_fee}></SpPrice>}
        {shopCartCount.discount_fee && <Text className='money'>¥ {formatMoney(shopCartCount.discount_fee)}</Text>}
      </View>
      {shopCartCount.shop_id && <View className='settlement' onClick={()=>settlement()}>去结算</View>}
    </View>
  )
}

CompTab.options = {
  addGlobalClass: true
}

export default CompTab
