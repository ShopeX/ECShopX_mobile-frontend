/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useRef, useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { SpPage, SpScrollView, SpCoupon, SpImage } from '@/components'
import { SpTagBar } from '@/subpages/components'
import { pickBy, showToast } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './coupon.scss'

const initialState = {
  couponType: '',
  couponList: []
}
function CouponIndex() {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { couponType, couponList } = state
  const couponRef = useRef()

  const couponTypes = useMemo(
    () => [
      { tag_name: $t('f1d3181c.a8b0c2'), value: '' },
      { tag_name: $t('97c6bb81.f23195'), value: 'cash' },
      { tag_name: $t('97c6bb81.9268f9'), value: 'discount' },
      { tag_name: $t('97c6bb81.8bc752'), value: 'new_gift' }
    ],
    [i18n.language]
  )

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('2b4b2b4f.2f3635') })
  }, [i18n.language])

  useEffect(() => {
    couponRef.current.reset()
  }, [couponType])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      status: '1',
      page: pageIndex,
      pageSize,
      card_type: couponType,
      scope_type: 'all'
    }
    const { list, total_count: total } = await api.member.getUserCardList(params)
    console.log(pickBy(list, doc.coupon.COUPON_ITEM))
    setState((draft) => {
      draft.couponList = couponList.concat(pickBy(list, doc.coupon.COUPON_ITEM))
    })
    return {
      total
    }
  }

  const onChangeCouponType = (index, { tag_name, value }) => {
    setState((draft) => {
      draft.couponType = value
      draft.couponList = []
    })
  }

  const handleClickCouponItem = ({
    cardId,
    cardType,
    status,
    sourceType,
    sourceId,
    id,
    tagClass
  }) => {
    if (tagClass == 'notstarted') {
      showToast($t('0bed8171.7527b8'))
      return
    }
    if (cardType == 'new_gift') {
      if (status == 1) {
        Taro.navigateTo({
          url: `/subpages/item/list?card_id=${cardId}&user_card_id=${id}`
        })
      } else if (status == 10) {
        Taro.navigateTo({
          url: `/subpages/marketing/exchange-code?card_id=${cardId}&user_card_id=${id}&from=mycoupon`
        })
      }
      return
    }
    //如果有admin或者没有值则跳转到首页，否则跳转到对应店铺
    if (sourceType === 'distributor') {
      let url = '/subpages/store/index'
      if (sourceId > 0) {
        url = `${url}?id=sourceId`
      }
      Taro.navigateTo({ url })
    } else {
      Taro.navigateTo({ url: '/pages/index' })
    }
  }

  return (
    <SpPage
      scrollToTopBtn
      className='page-marketing-coupon'
      renderFooter={
        <View className='btn-wrap'>
          <View
            className='btn-text'
            onClick={() => {
              Taro.navigateTo({
                url: `/subpages/marketing/coupon-record`
              })
            }}
          >
            {$t('2d319bee.a396a9')}
          </View>
          <View className='space'>|</View>
          <View
            className='btn-text'
            onClick={() => {
              Taro.navigateTo({
                url: `/subpages/marketing/coupon-center`
              })
            }}
          >
            {$t('0bed8171.cf5dc9')}
            <SpImage src='coupon_right_icon.png' width={25} height={18} />
          </View>
        </View>
      }
    >
      <SpTagBar list={couponTypes} value={couponType} onChange={onChangeCouponType} />
      <SpScrollView className='list-scroll' auto={false} ref={couponRef} fetch={fetch}>
        {couponList.map((item, index) => (
          <View className='coupon-item-wrap' key={`coupon-item__${index}`}>
            <SpCoupon info={item} onClick={handleClickCouponItem.bind(this, item)}>
              {item.cardType != 'new_gift' && <Text>{$t('593377c2.d48da8')}</Text>}
              {item.cardType == 'new_gift' && (
                <Text>
                  {item?.tagClass == 'notstarted'
                    ? $t('da5ae518.dd4e55')
                    : {
                        '1': $t('593377c2.d48da8'),
                        '10': $t('250b375e.06ec9f')
                      }[item.status]}
                </Text>
              )}
            </SpCoupon>
          </View>
        ))}
      </SpScrollView>
    </SpPage>
  )
}

CouponIndex.options = {
  addGlobalClass: true
}

export default CouponIndex
