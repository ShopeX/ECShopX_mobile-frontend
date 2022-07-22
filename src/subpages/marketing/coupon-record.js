import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { SpPage, SpTagBar, SpScrollView, SpCoupon, SpButton, SpNote } from '@/components'
import { pickBy } from '@/utils'
import './coupon-record.scss'

const initialState = {
  couponTypes: [
    { tag_name: '已使用', value: '2' },
    { tag_name: '已过期', value: '3' }
  ],
  couponType: '2',
  couponList: [],
  isDefault: false
}
function CouponRecord() {
  const [state, setState] = useImmer(initialState)
  const { couponTypes, couponType, couponList, isDefault } = state
  const couponRef = useRef()

  useEffect(() => {
    couponRef.current.reset()
  }, [couponType])

  const fetch = async ({ pageIndex, pageSize }) => {
    const params = {
      status: couponType,
      page: pageIndex,
      pageSize
    }
    const { list, total_count: total } = await api.member.getUserCardList(params)
    console.log(pickBy(list, doc.coupon.COUPON_ITEM))
    const _list = couponList.concat(pickBy(list, doc.coupon.COUPON_ITEM))
    setState((draft) => {
      draft.couponList = _list
      draft.isDefault = _list.length == 0
    })
    return {
      total
    }
  }

  const onChangeCouponType = (index, { tag_name, value }) => {
    setState((draft) => {
      draft.couponType = value
      draft.couponList = []
      draft.isDefault = false
    })
  }

  return (
    <SpPage scrollToTopBtn className='page-marketing-couponrecord'>
      <SpTagBar list={couponTypes} value={couponType} onChange={onChangeCouponType} />
      <SpScrollView className='list-scroll' auto={false} ref={couponRef} fetch={fetch}>
        {couponList.map((item, index) => (
          <View className='coupon-item-wrap' key={`coupon-item__${index}`}>
            <SpCoupon info={item}>
              <Text>
                {
                  {
                    'used': '已使用',
                    'overdue': '已过期'
                  }[item.tagClass]
                }
              </Text>
            </SpCoupon>
          </View>
        ))}

        {isDefault && (
          <View className={'default-view'}>
            <SpNote img={'empty_marketing.png'} title={'没有优惠券~'} />
            <SpButton
              resetText='首页'
              confirmText='领券中心'
              onConfirm={() => {
                Taro.navigateTo({ url: '/pages/index' })
              }}
              onReset={() => {
                Taro.navigateTo({ url: '/subpages/marketing/coupon-center' })
              }}
            />
          </View>
        )}
      </SpScrollView>
    </SpPage>
  )
}

CouponRecord.options = {
  addGlobalClass: true
}

export default CouponRecord
