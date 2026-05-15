/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useRef, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { SpPage, SpScrollView, SpCoupon, SpButton, SpNote } from '@/components'
import { SpTagBar } from '@/subpages/components'
import { pickBy } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './coupon-record.scss'

const initialState = {
  couponType: '2',
  couponList: [],
  isDefault: false
}
function CouponRecord() {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { couponType, couponList, isDefault } = state
  const couponRef = useRef()

  const couponTypes = useMemo(
    () => [
      { tag_name: $t('2ffc1635.b59b00'), value: '2' },
      { tag_name: $t('2ffc1635.4d5ccd'), value: '3' }
    ],
    [i18n.language]
  )

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('2d319bee.a396a9') })
  }, [i18n.language])

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
      <SpScrollView
        className='list-scroll'
        auto={false}
        ref={couponRef}
        fetch={fetch}
        renderEmpty={<></>}
      >
        {couponList.map((item, index) => (
          <View className='coupon-item-wrap' key={`coupon-item__${index}`}>
            <SpCoupon info={item}>
              <Text>
                {
                  {
                    used: $t('2ffc1635.b59b00'),
                    overdue: $t('2ffc1635.4d5ccd')
                  }[item.tagClass]
                }
              </Text>
            </SpCoupon>
          </View>
        ))}

        {isDefault && (
          <View className='default-view'>
            <SpNote img='empty_marketing.png' title={$t('2ffc1635.a371ef')} />
            <SpButton
              resetText={$t('2ffc1635.db1c89')}
              confirmText={$t('2ffc1635.9c356b')}
              onConfirm={() => {
                Taro.navigateTo({ url: '/subpages/marketing/coupon-center' })
              }}
              onReset={() => {
                Taro.navigateTo({ url: '/pages/index' })
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
