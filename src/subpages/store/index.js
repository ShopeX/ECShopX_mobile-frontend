import React, { useEffect, useState, useCallback } from 'react'
import Taro, { useShareAppMessage, useShareTimeline, useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import {
  SpFloatMenuItem,
  SpPage,
  SpSearch,
  SpRecommend,
  SpPrivacyModal,
  SpTabbar
} from '@/components'
import api from '@/api'
import doc from '@/doc'
import {
  isWeixin,
  getDistributorId,
  VERSION_STANDARD,
  VERSION_PLATFORM,
  VERSION_B2C,
  classNames,
  entryLaunch,
  pickBy
} from '@/utils'
import { useImmer } from 'use-immer'
import { useNavigation } from '@/hooks'
import HomeWgts from '@/pages/home/comps/home-wgts'
import CompTabbar from './comps/comp-tabbar'
import CompShopBrand from './comps/comp-shopbrand'

import './index.scss'

const initState = {
  wgts: [],
  showBackToTop: false,
  loading: true,
  isDefault: false,
  storeInfo: null,
  distributorId: 0
}

function StoreIndex() {
  const [state, setState] = useImmer(initState)
  const [likeList, setLikeList] = useImmer([])
  const { openRecommend, openLocation, openStore } = useSelector((state) => state.sys)
  const { setNavigationBarTitle } = useNavigation()

  const { wgts, loading, isDefault, distributorId } = state

  const dispatch = useDispatch()

  useEffect(() => {
    fetchWgts()
  }, [])

  const fetchWgts = async () => {
    const { id, dtid } = await entryLaunch.getRouteParams()
    const distributor_id = getDistributorId(id || dtid)
    const { status } = await api.distribution.merchantIsvaild({
      distributor_id
    })

    if (!status) {
      setState((draft) => {
        draft.isDefault = true
      })
      return
    } else {
      // const storeInfo = await api.shop.getShop({
      //   distributor_id,
      //   show_score: 1,
      //   show_marketing_activity: 1
      // })
      const { config } = await api.shop.getStoreShopTemplate({
        distributor_id
      })
      setState((draft) => {
        draft.wgts = config
        draft.distributorId = distributor_id
        // draft.storeInfo = pickBy(storeInfo, doc.shop.STORE_INFO)
        draft.loading = false
      })
      fetchLikeList()
    }
  }

  const fetchLikeList = async () => {
    if (openRecommend == 1) {
      const query = {
        page: 1,
        pageSize: 30
      }
      const { list } = await api.cart.likeList(query)
      setLikeList(list)
    }
  }

  // useShareAppMessage(async (res) => {
  //   const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
  //   return {
  //     title: title,
  //     imageUrl: imageUrl,
  //     path: '/pages/index'
  //   }
  // })

  // useShareTimeline(async (res) => {
  //   const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
  //   return {
  //     title: title,
  //     imageUrl: imageUrl,
  //     query: '/pages/index'
  //   }
  // })

  const searchComp = wgts.find((wgt) => wgt.name == 'search')
  let filterWgts = []
  if (searchComp && searchComp.config.fixTop) {
    filterWgts = wgts.filter((wgt) => wgt.name !== 'search')
  } else {
    filterWgts = wgts
  }
  const fixedTop = searchComp && searchComp.config.fixTop

  return (
    <SpPage
      className='page-store-index'
      isDefault={isDefault}
      defaultMsg='该店铺已注销，在别的店铺看看吧'
      loading={loading}
      scrollToTopBtn
      navigateMantle
      renderTitle={
        fixedTop && (
          <SpSearch
            isFixTop={searchComp.config.fixTop}
            onClick={() => {
              Taro.navigateTo({
                url: `/subpages/store/item-list?dtid=${distributorId}`
              })
            }}
          />
        )
      }
      renderFloat={
        <View>
          <SpFloatMenuItem
            onClick={() => {
              Taro.navigateTo({ url: '/subpages/member/index' })
            }}
          >
            <Text className='iconfont icon-huiyuanzhongxin'></Text>
          </SpFloatMenuItem>
          <SpFloatMenuItem
            onClick={() => {
              Taro.navigateTo({ url: '/pages/cart/espier-index' })
            }}
          >
            <Text className='iconfont icon-gouwuche'></Text>
          </SpFloatMenuItem>
        </View>
      }
      renderFooter={<CompTabbar />}
    >
      <View className='header-block'>
        <CompShopBrand dtid={distributorId} />
      </View>
      <HomeWgts wgts={filterWgts} />

      {/* 猜你喜欢 */}
      <SpRecommend className='recommend-block' info={likeList} />
    </SpPage>
  )
}

export default StoreIndex
