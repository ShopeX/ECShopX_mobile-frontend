import React, { useRef, useEffect } from 'react'
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
import qs from 'qs'
import { pickBy, log } from '@/utils'
import { useQwLogin } from '@/hooks'
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
  const { isLogin, login } = useQwLogin({
    autoLogin: true
  })
  const $instance = getCurrentInstance()
  const { subtask_id = '' } = getCurrentInstance().router.params
  const [state, setState] = useImmer(initialState)
  const { list } = state
  const couponRef = useRef()
  const { userInfo } = useSelector((state) => state.guide)

  useEffect(() => {
    if (isLogin) {
      couponRef.current.reset()
    }
  }, [isLogin])

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
    const query = {
      card_id: cardId,
      dtid: distributor_id,
      smid: salesperson_id,
      gu: `${work_userid}_${shop_code}`
      // subtask_id: subtaskId
    }

    const path = `/subpages/marketing/coupon-center?${qs.stringify(query)}`
    log.debug(`getAppShareInfo: ${path}`)
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
    console.log(pickBy(list, doc.coupon.GUIDE_COUPON_ITEM))
    setState((draft) => {
      draft.list = pickBy(list, doc.coupon.GUIDE_COUPON_ITEM)
    })
    return { total: total_count }
  }
  console.log('list:', list)
  return (
    <SpPage className='page-guide-coupon' navigateTheme='dark' renderFooter={<BaTabBar />}>
      <SpScrollView className='coupon-list' auto={false} ref={couponRef} fetch={fetch}>
        {list.map((item, index) => (
          <View className='coupon-item__wrap' key={`coupon-item__${index}`}>
            <BaCoupon info={item} />
          </View>
        ))}
      </SpScrollView>
    </SpPage>
  )
}

GuideCouponIndex.options = {
  addGlobalClass: true
}

export default GuideCouponIndex
