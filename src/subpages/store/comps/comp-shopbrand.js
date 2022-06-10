import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { SpImage, SpLogin, SpShopCoupon } from '@/components'
import { pickBy, showToast, classNames } from '@/utils'
import './comp-shopbrand.scss'

const initialState = {
  storeInfo: null,
  fav: false,
  couponList: [],
  extend: false
}
function CompShopBrand(props) {
  const { dtid = 0 } = props
  const [state, setState] = useImmer(initialState)
  const { storeInfo, fav, couponList, extend } = state
  useEffect(() => {
    fetch()
    fetchCouponList()
  }, [])

  const fetch = async () => {
    const storeInfo = await api.shop.getShop({
      distributor_id: dtid,
      show_score: 1,
      show_marketing_activity: 1
    })
    const { is_fav } = await api.member.storeIsFav(dtid)

    setState((draft) => {
      draft.storeInfo = pickBy(storeInfo, doc.shop.STORE_INFO)
      draft.fav = is_fav
    })
  }

  const fetchCouponList = async () => {
    const params = {
      page_no: 1,
      page_size: 5,
      end_date: 1,
      distributor_id: dtid
    }
    const { list } = await api.member.homeCouponList(params)

    setState((draft) => {
      draft.couponList = list
    })
  }

  const handleFocus = async () => {
    let data = {}
    if (fav) {
      //取消
      data = await api.member.storeFavDel(dtid)
    } else {
      //关注
      data = await api.member.storeFav(dtid)
    }
    if (Object.keys(data).length > 0) {
      showToast(fav ? '取消关注成功' : '关注成功')
    }
    setState((draft) => {
      draft.fav = !fav
    })
  }

  return (
    <View className='comp-shop-brand'>
      <View className='shop-brand-hd'>
        <SpImage
          className='store-logo'
          src={storeInfo?.logo}
          mode='aspectFit'
          width={140}
          height={140}
        />
        <View className='store-info'>
          <View className='store-name'>{storeInfo?.name}</View>
          <View className='store-score-desc'>
            {storeInfo?.scoreList?.avg_star > 0 && (
              <View className='store-score'>{`评分: ${scoreList.avg_star}`}</View>
            )}
            <View
              className='store-desc'
              onClick={() => {
                Taro.navigateTo({
                  url: `/subpages/store/brand-info?distributor_id=${dtid}`
                })
              }}
            >
              品牌介绍
              <Text className='iconfont icon-qianwang-01'></Text>
            </View>
          </View>
        </View>

        <SpLogin className='btn-attention' onChange={handleFocus}>
          {fav ? '取消关注' : '+关注'}
        </SpLogin>
      </View>
      <View className='coupon-list'>
        {couponList.slice(0, 3).map((item, index) => (
          <SpShopCoupon
            fromStoreIndex
            className='coupon-index'
            info={item}
            key={`shop-coupon__${index}`}
            onClick={() => {
              Taro.navigateTo({
                url: `/others/pages/home/coupon-home?distributor_id=${dtid}`
              })
            }}
          />
        ))}
      </View>
      {storeInfo?.marketingActivityList.length > 0 && (
        <View className='activity-list'>
          <View className={classNames('activity', {
            'extend': extend
          })}>
            {storeInfo?.marketingActivityList.map((item, index) => (
              <View className='activity-item' key={`activity-item__${index}`}>
                <View className='activity-tag'>{item.promotion_tag}</View>
                <View className='activity-name'>{item.marketing_name}</View>
              </View>
            ))}
          </View>
          <View className="more-txt" onClick={() => {
            setState(draft => {
              draft.extend = !draft.extend;
            })
          }}>
            <Text>{`${storeInfo?.marketingActivityList.length}种优惠`}</Text>
            <Text className={classNames('iconfont', {
              'icon-arrowDown': !extend,
              'icon-arrowUp': extend
            })}></Text>
          </View>
        </View>
      )}
    </View>
  )
}

CompShopBrand.options = {
  addGlobalClass: true
}

export default CompShopBrand
