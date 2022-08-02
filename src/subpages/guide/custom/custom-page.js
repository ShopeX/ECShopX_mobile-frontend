import React, { useEffect, useState, useCallback } from 'react'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useDidShow
} from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import qs from 'qs'
import { AtButton } from 'taro-ui'
import { SpScreenAd, SpPage, SpSearch, SpRecommend, SpPrivacyModal, SpTabbar } from '@/components'
import api from '@/api'
import { isWeixin, log } from '@/utils'
import entryLaunch from '@/utils/entryLaunch'
import { updateStoreInfo } from '@/store/slices/guide'
import { useImmer } from 'use-immer'
import { useQwLogin, useNavigation } from '@/hooks'
import {
  BaHomeWgts,
  BaStoreList,
  BaStore,
  BaGoodsBuyPanel,
  BaTabBar,
  BaNavBar
} from '@/subpages/guide/components'
// import { WgtHomeHeader } from '@/pages/home/wgts'

import './custom-page.scss'

const initState = {
  wgts: [],
  shareInfo: {},
  showBackToTop: false,
  shopList: null
}

function GuideCustomPage() {
  const [state, setState] = useImmer(initState)
  const $instance = getCurrentInstance()
  const { setNavigationBarTitle } = useNavigation()
  const { isLogin, login } = useQwLogin({
    autoLogin: true
  })

  const { userInfo } = useSelector((state) => state.guide)

  const { wgts, shareInfo, shopList } = state


  useEffect(() => {
    if (userInfo) {
      fetchWgts()
    }
  }, [userInfo])

  const fetchWgts = async () => {
    const { id } = $instance.router.params
    const { config, share } = await api.guide.getHomeTmps({
      template_name: 'yykweishop',
      version: 'v1.0.1',
      page_name: `custom_${id}`
    })
    setNavigationBarTitle(share.page_name)
    setState((draft) => {
      draft.wgts = config
      draft.shareInfo = share
    })
  }

  useShareAppMessage(async () => {
    const { id, subtask_id } = $instance.router.params
    const { salesperson_id, distributor_id, work_userid, shop_code } = userInfo
    const query = {
      id,
      dtid: distributor_id,
      smid: salesperson_id,
      gu: `${work_userid}_${shop_code}`,
      subtask_id
    }
    const path = `/pages/custom/custom-page?${qs.stringify(query)}`
    log.debug(`share path: ${path}`)

    return {
      title: shareInfo.page_share_title,
      imageUrl: shareInfo.page_share_imageUrl,
      path: path
    }
  })

  return (
    <SpPage
      className='page-guide-custompage'
      navigateTheme='dark'
      scrollToTopBtn
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle className='btn-share' type='primary' openType='share'>
            分享给顾客
          </AtButton>
        </View>
      }
    >
      <View className='home-body'>
        <BaHomeWgts wgts={wgts} />
      </View>
    </SpPage>
  )
}

export default GuideCustomPage
