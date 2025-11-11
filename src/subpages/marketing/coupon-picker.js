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
import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { changeCoupon } from '@/store/slices/cart'
import { SpPage, SpTagBar, SpScrollView, SpCoupon, SpImage, SpCheckboxNew } from '@/components'
import { pickBy } from '@/utils'
import './coupon-picker.scss'

const initialState = {
  couponListVaild: [],
  couponListInVaild: [],
  select: null
}
function CouponPicker(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  let { couponListVaild, couponListInVaild, select } = state
  const dispatch = useDispatch()

  const fetch = async ({ pageIndex, pageSize }) => {
    const {
      items,
      is_checkout,
      cart_type,
      use_platform = 'mall',
      distributor_id,
      source,
      goodType,
      coupon = null,
      cxdid
    } = $instance.router.params
    const params = {
      page_no: pageIndex,
      page_size: pageSize,
      items: decodeURIComponent(items),
      use_platform,
      page_type: 'picker',
      distributor_id,
      valid: true,
      is_checkout,
      cart_type,
      iscrossborder: 0,
      cxdid
    }
    const { list, total_count: total } = await api.cart.coupons(params)

    const couponListNewVaul = pickBy(list, doc.coupon.COUPON_ITEM)
    couponListVaild = couponListNewVaul.filter((item) => item.valid)
    couponListInVaild = couponListNewVaul.filter((item) => !item.valid)
    setState((draft) => {
      ;(draft.couponListVaild = couponListVaild),
        (draft.couponListInVaild = couponListInVaild),
        (draft.select = coupon)
    })
    return {
      total
    }
  }

  const onChangeSelectCoupon = (item, e) => {
    let payload = null
    // 不使用优惠券
    if (item) {
      const { cardId, code, title } = item
      payload = {
        coupon_id: cardId,
        coupon_code: code,
        title
      }
    } else {
      payload = {
        coupon_id: null,
        coupon_code: null,
        title: ''
      }
    }
    dispatch(changeCoupon(payload))
    setState((draft) => {
      draft.select = item ? item.code : item
    })

    setTimeout(() => {
      Taro.navigateBack()
    }, 300)
  }

  console.log('select:', select)

  return (
    <SpPage
      scrollToTopBtn
      className='page-marketing-couponpicker'
      renderFooter={
        <View className='btn-wrap'>
          <SpCheckboxNew onChange={onChangeSelectCoupon.bind(this, null)} checked={select === null}>
            暂不使用优惠券
          </SpCheckboxNew>
        </View>
      }
    >
      <SpScrollView className='list-scroll' fetch={fetch}>
        {couponListVaild.map((item, index) => (
          <View className='coupon-item-wrap' key={`coupon-item__${index}`}>
            <SpCoupon info={item} />
            <SpCheckboxNew
              onChange={onChangeSelectCoupon.bind(this, item)}
              disabled={!item.valid}
              checked={select == item.code}
            />
          </View>
        ))}
        {couponListInVaild.length > 0 ? <View className='invalid-title'>不可用优惠券</View> : ''}
        {couponListInVaild.map((item, index) => (
          <View className='coupon-item-wrap' key={`coupon-item__${index}`}>
            <SpCoupon info={item} />
            <SpCheckboxNew
              onChange={onChangeSelectCoupon.bind(this, item)}
              disabled={!item.valid}
              checked={select == item.code}
            />
          </View>
        ))}
      </SpScrollView>
    </SpPage>
  )
}

CouponPicker.options = {
  addGlobalClass: true
}

export default CouponPicker
