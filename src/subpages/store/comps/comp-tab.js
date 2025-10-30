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
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpImage, SpLogin, SpShopCoupon, SpPrice } from '@/components'
import { pickBy, showToast, classNames } from '@/utils'
import S from '@/spx'
import qs from 'qs'
import './comp-tab.scss'

const initialState = {
  fav: false,
  couponList: [],
  extend: false
}
function CompTab(props) {
  const { shopCartCount } = useSelector((state) => state.cart)

  const { popFrame = {} } = props
  const [state, setState] = useImmer(initialState)
  const { fav, couponList, extend } = state
  const $instance = getCurrentInstance()
  const router = $instance.router

  if (!shopCartCount) {
    return null
  }

  const settlement = () => {
    const { type = 'distributor' } = router.params
    const { shop_id, is_delivery, is_ziti, shop_name, address, lat, lng, hour, mobile } =
      shopCartCount.storeDetails
    const query = {
      cart_type: 'cart',
      type,
      shop_id,
      is_delivery,
      is_ziti,
      name: shop_name,
      store_address: address,
      lat,
      lng,
      hour,
      phone: mobile,
      //购物车默认是0     0:普通商品  1:跨境商品
      // goodType: current == 0 ? 'normal' : 'cross'
      goodType: 'normal'
    }
    Taro.navigateTo({
      url: `/pages/cart/espier-checkout?${qs.stringify(query)}`
    })
  }

  return (
    <View className='comp-shop-brand-cart'>
      <View className='comp-shop-brand-gwc'>
        <View className='comp-shop-brand-gwc-num' onClick={() => popFrame()}>
          <Text className='iconfont icon-gouwuche2' />
          {shopCartCount.cart_total_num && (
            <View className='nums'>{shopCartCount.cart_total_num}</View>
          )}
        </View>
        {shopCartCount.total_fee && <SpPrice value={shopCartCount.total_fee / 100}></SpPrice>}
        {/* {shopCartCount.discount_fee && <Text className='money'>¥ {formatMoney(shopCartCount.discount_fee)}</Text>} */}
      </View>
      {shopCartCount.shop_id && (
        <AtButton
          className='settlement'
          disabled={!shopCartCount.total_fee}
          onClick={() => settlement()}
        >
          去结算
        </AtButton>
      )}
    </View>
  )
}

CompTab.options = {
  addGlobalClass: true
}

export default CompTab
