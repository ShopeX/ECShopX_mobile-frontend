/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { changeCoupon } from '@/store/slices/cart'
import { SpPage, SpScrollView, SpCoupon, SpImage, SpCheckboxNew } from '@/components'
import { SpTagBar } from '@/subpages/components'
import { pickBy } from '@/utils'
import { useTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import './coupon-picker.scss'

const initialState = {
  couponListVaild: [],
  couponListInVaild: [],
  select: null
}
function CouponPicker(props) {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  let { couponListVaild, couponListInVaild, select } = state
  const { customerLnformation } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('2ddd2e6e.45bcee') })
  }, [i18n.language])

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
    } = $instance?.router?.params
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
      ...customerLnformation
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
            {$t('2ddd2e6e.af4202')}
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
        {couponListInVaild.length > 0 ? (
          <View className='invalid-title'>{$t('2ddd2e6e.c3a1b6')}</View>
        ) : (
          ''
        )}
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
