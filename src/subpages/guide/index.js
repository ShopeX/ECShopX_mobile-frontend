// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect, useState, useCallback } from 'react'
import Taro, { useShareAppMessage, useShareTimeline, useDidShow } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { SpScreenAd, SpPage, SpSearch, SpRecommend, SpTabbar } from '@/components'
import api from '@/api'
import { isWeixin, platformTemplateName } from '@/utils'
import entryLaunch from '@/utils/entryLaunch'
import { updateStoreInfo } from '@/store/slices/guide'
import { useImmer } from 'use-immer'
import { useQwLogin } from '@/hooks'
import {
  BaHomeWgts,
  BaStoreList,
  BaStore,
  BaGoodsBuyPanel,
  BaTabBar,
  BaNavBar
} from '@/subpages/guide/components'
// import { WgtHomeHeader } from '@/pages/home/wgts'

import './index.scss'

const initState = {
  wgts: [],
  shareInfo: {},
  showBackToTop: false,
  shopList: null,
  footerHeight: 0
}

function Home() {
  const [state, setState] = useImmer(initState)
  const { isLogin, login } = useQwLogin({
    autoLogin: true
  })

  const sys = useSelector((state) => state.sys)
  const { userInfo } = useSelector((state) => state.guide)

  const { wgts, shareInfo, shopList } = state

  const dispatch = useDispatch()

  useEffect(() => {
    if (userInfo) {
      fetchWgts()
      getStoreList()
      // fetchShareInfo()
    }
  }, [userInfo])

  const fetchWgts = async () => {
    const { config } = await api.guide.getHomeTmps({
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: 'custom_salesperson',
      company_id: 1
    })

    setState((draft) => {
      draft.wgts = config
    })
  }

  //获取门店列表
  const getStoreList = async (params = {}) => {
    const { list } = await api.guide.distributorlist({
      page: 1,
      pageSize: 10000,
      store_type: 'distributor'
    })
    const fd = list.find((item) => item.distributor_id == userInfo.distributor_id)
    setState((draft) => {
      draft.shopList = list
    })

    if (fd) {
      dispatch(updateStoreInfo(fd))
    }
  }

  // useShareAppMessage(async () => {
  //   return {
  //     title: shareInfo.title,
  //     imageUrl: shareInfo.imageUrl,
  //     path: '/pages/index'
  //   }
  // })

  // useShareTimeline(async () => {
  //   return {
  //     title: shareInfo.title,
  //     imageUrl: shareInfo.imageUrl,
  //     query: '/pages/index'
  //   }
  // })

  return (
    <SpPage
      className='page-guide-index'
      scrollToTopBtn
      renderFooter={<BaTabBar height={state.footerHeight} />}
      onReady={({ footerHeight }) => {
        setState((draft) => {
          draft.footerHeight = footerHeight
        })
      }}
    >
      {userInfo && <BaStore guideInfo={userInfo} />}

      <View className='home-body'>
        <BaHomeWgts wgts={wgts} />
      </View>
    </SpPage>
  )
}

export default Home
