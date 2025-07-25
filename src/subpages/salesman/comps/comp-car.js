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
