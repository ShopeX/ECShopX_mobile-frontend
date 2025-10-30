// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
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
  const { cartSalesman = 0, shopSalesmanCartCount = {} } = useSelector((state) => state.cart)
  const { params } = useRouter()

  return (
    <View className='comp-shop-brand-cart'>
      <View className='comp-shop-brand-gwc'>
        <View className='comp-shop-brand-gwc-num' onClick={() => popFrame()}>
          <SpImage className='car-img' src='cart.png' />
          {cartSalesman > 0 && <View className='nums'>{cartSalesman}</View>}
        </View>
        <View>
          <SpPrice
            value={shopSalesmanCartCount.total_fee ? shopSalesmanCartCount.total_fee / 100 : 0}
            size={36}
          ></SpPrice>
          {/* <View className='free-delivery'>免配送费</View> */}
        </View>
      </View>
      <AtButton
        className='settlement'
        onClick={() => {
          Taro.navigateTo({
            url: `/subpages/salesman/cart?distributor_id=${params.distributor_id}`
          })
        }}
      >
        去购物车
      </AtButton>
    </View>
  )
}

CompCar.options = {
  addGlobalClass: true
}

export default CompCar
