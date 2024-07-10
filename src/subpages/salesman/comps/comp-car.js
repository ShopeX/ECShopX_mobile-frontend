import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { View, Text } from '@tarojs/components'
import { SpImage, SpPrice } from '@/components'
import './comp-car.scss'

const initialState = {
  fav: false,
  couponList: [],
  extend: false
}
function CompCar(props) {
  const { popFrame = {} } = props
  const [state, setState] = useImmer(initialState)
  const { fav, couponList, extend } = state

  const settlement = () => {
    // const { type = 'distributor' } = router.params
    // const { shop_id, is_delivery, is_ziti, shop_name, address, lat, lng, hour, mobile } =
    //   shopCartCount.storeDetails
    // const query = {
    //   cart_type: 'cart',
    //   type,
    //   shop_id,
    //   is_delivery,
    //   is_ziti,
    //   name: shop_name,
    //   store_address: address,
    //   lat,
    //   lng,
    //   hour,
    //   phone: mobile,
    //   //购物车默认是0     0:普通商品  1:跨境商品
    //   // goodType: current == 0 ? 'normal' : 'cross'
    //   goodType: 'normal'
    // }
    // Taro.navigateTo({
    //   url: `/pages/cart/espier-checkout?${qs.stringify(query)}`
    // })
  }

  return (
    <View className='comp-shop-brand-cart'>
      <View className='comp-shop-brand-gwc'>
        <View className='comp-shop-brand-gwc-num' onClick={() => popFrame()}>
          <SpImage className='car-img' src='cart.png' />
          {/* <Text className='iconfont icon-gouwuche2' /> */}
          <View className='nums'>9</View>
        </View>
        <View>
          <SpPrice value='1000' size={36}></SpPrice>
          <View className='free-delivery'>免配送费</View>
        </View>
      </View>
      <AtButton className='settlement' onClick={() => settlement()}>
        代客下单
      </AtButton>
    </View>
  )
}

CompCar.options = {
  addGlobalClass: true
}

export default CompCar
