import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { SpPage, SpTagBar, SpScrollView, SpCoupon, SpImage } from '@/components'
import { pickBy, showToast } from '@/utils'
import './coupon.scss'

const initialState = {
  couponTypes: [
    { tag_name: '全部', value: '' },
    { tag_name: '满减券', value: 'cash' },
    { tag_name: '折扣券', value: 'discount' },
    { tag_name: '兑换券', value: 'new_gift' }
  ],
  couponType: '',
  couponList: []
}
function CouponIndex() {
  const [state, setState] = useImmer(initialState)
  const { couponTypes, couponType, couponList } = state
  const couponRef = useRef()

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

  const handleClickCouponItem = ({ cardId, cardType, status, sourceType, sourceId, id, tagClass }) => {
    if(tagClass == 'notstarted') {
      showToast('活动未开始')
      return
    }
    if (cardType == 'new_gift') {
      if (status == 1) {
        Taro.navigateTo({
          url: `/pages/item/list?card_id=${cardId}&user_card_id=${id}`
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
            优惠券使用记录
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
            前往领券中心
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
              {item.cardType != 'new_gift' && <Text>去使用</Text>}
              {item.cardType == 'new_gift' && (
                <Text>
                  {item?.tagClass == 'notstarted'
                    ? '未开始'
                    : {
                        '1': '去使用',
                        '10': '待核销'
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
