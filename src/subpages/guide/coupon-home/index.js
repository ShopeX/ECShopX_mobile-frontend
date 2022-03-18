import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, {
  getCurrentInstance,
  useDidShow,
  useShareAppMessage,
  useShareTimeline
} from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { SpPage, SpScrollView, CouponItem } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import {
  BaHomeWgts,
  BaStoreList,
  BaStore,
  BaGoodsBuyPanel,
  BaTabBar,
  BaNavBar,
  BaCoupon
} from '@/subpages/guide/components'
import './index.scss'

const initialState = {
  list: []
}
function GuideCouponIndex(props) {
  const $instance = getCurrentInstance()
  const { subtask_id = '' } = getCurrentInstance().router.params
  const [state, setState] = useImmer(initialState)
  const { list } = state
  const { userInfo } = useSelector((state) => state.guide)

  // useEffect(() => {
  //   fetch()
  // }, [])

  useDidShow(() => {
    Taro.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  })

  useShareAppMessage(async (options) => {
    const cardId = options.target.dataset.info
    return getAppShareInfo(cardId)
  })

  // useShareTimeline(async (res) => {
  //   return getAppShareInfo()
  // })

  const getAppShareInfo = async (cardId) => {
    const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'coupon' })
    const { salesperson_id, distributor_id, work_userid, shop_code } = userInfo
    const gu = `${work_userid}_${shop_code}`
    const path = `/others/pages/home/coupon-home?smid=${salesperson_id}&card_id=${cardId}&distributor_id=${distributor_id}&subtask_id=${subtask_id}&gu=${gu}`
    console.log(`getAppShareInfo:`, path)
    return {
      title: title,
      imageUrl: imageUrl,
      path: path
    }
  }

  const fetch = async () => {
    const { card_id = '', item_id = '' } = $instance.router.params
    const { distributor_id } = userInfo
    const params = {
      end_date: 1,
      distributor_id,
      card_id,
      item_id
    }
    const { list, total_count } = await api.member.homeCouponList(params)
    console.log(pickBy(list, doc.coupon.COUPON_ITEM))
    setState((draft) => {
      draft.list = pickBy(list, doc.coupon.COUPON_ITEM)
    })
    return { total: total_count }
  }
  console.log('list:', list)
  return (
    <SpPage className='page-guide-coupon'>
      <BaNavBar home title='优惠券' />
      <SpScrollView className='coupon-list' fetch={fetch}>
        {list.map((item) => (
          <View className='coupon-item__wrap'>
            <BaCoupon info={item} />
          </View>
        ))}
      </SpScrollView>
      <BaTabBar />
    </SpPage>
  )
}

GuideCouponIndex.options = {
  addGlobalClass: true
}

export default GuideCouponIndex
