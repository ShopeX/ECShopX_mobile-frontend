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
  couponList: [],
  select: null
}
function CouponPicker(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { couponList, select } = state
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
      coupon = null
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
      iscrossborder: 0
    }
    const { list, total_count: total } = await api.cart.coupons(params)
    setState((draft) => {
      draft.couponList = couponList.concat(pickBy(list, doc.coupon.COUPON_ITEM)),
      draft.select = coupon
    })
    return {
      total
    }
  }

  const onChangeSelectCoupon = (item, e) => {
    let payload = null
    // 不使用优惠券
    if(item) {
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
    setState(draft => {
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
        {couponList.map((item, index) => (
          <View className='coupon-item-wrap' key={`coupon-item__${index}`}>
            <SpCoupon info={item} />
            <SpCheckboxNew onChange={onChangeSelectCoupon.bind(this, item)} disabled={!item.valid} checked={select == item.code}/>
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
