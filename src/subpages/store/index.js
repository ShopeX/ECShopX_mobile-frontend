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
  pickBy,
  log
} from '@/utils'
import { useImmer } from 'use-immer'
import { useNavigation } from '@/hooks'
import qs from 'qs'
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

  const { wgts, loading, isDefault, distributorId, storeInfo } = state

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
      const storeInfo = await api.shop.getShop({
        distributor_id,
        show_score: 1,
        show_marketing_activity: 1
      })
      const { config } = await api.shop.getStoreShopTemplate({
        distributor_id
      })
      setState((draft) => {
        draft.wgts = config
        draft.distributorId = distributor_id
        draft.storeInfo = pickBy(storeInfo, doc.shop.STORE_INFO)
        draft.loading = false
      })
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

  useShareAppMessage((res) => {
    return getAppShareInfo()
  })

  useShareTimeline((res) => {
    return getAppShareInfo()
  })

  const getAppShareInfo = async () => {
    const { id } = await entryLaunch.getRouteParams()
    const query = {
      id
    }
    const path = `/subpages/store/index?${qs.stringify(query)}`
    log.debug(`share path: ${path}`)
    return {
      title: storeInfo?.name,
      imageUrl: storeInfo?.logo,
      path
    }
  }

  const searchComp = wgts.find((wgt) => wgt.name == 'search')
  const pageData = wgts.find((wgt) => wgt.name == 'page')
  let filterWgts = []
  if (searchComp && searchComp.config.fixTop) {
    filterWgts = wgts.filter((wgt) => wgt.name !== 'search')
  } else {
    filterWgts = wgts
  }
  // const fixedTop = searchComp && searchComp.config.fixTop


  return (
    <SpPage
      className='page-store-index'
      isDefault={isDefault}
      defaultMsg='该店铺已注销，在别的店铺看看吧'
      loading={loading}
      scrollToTopBtn
      // navigateMantle
      pageConfig={pageData?.base}
      // renderTitle={
      //   fixedTop && (
      //     <>
      //     <SpSearch
      //       isFixTop={searchComp.config.fixTop}
      //       onClick={() => {
      //         Taro.navigateTo({
      //           url: `/subpages/store/item-list?dtid=${distributorId}`
      //         })
      //       }}
      //     />
      //     </>

      //   )
      // }
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
      {searchComp && <View className='search' >
        <SpSearch
          // isFixTop={searchComp?.config?.fixTop}
          info={searchComp}
          onClick={() => {
            Taro.navigateTo({
              url: `/subpages/store/item-list?dtid=${distributorId}`
            })
          }}
        />
      </View>}

      <View className='header-block' style={{ background: `${pageData?.base?.pageBackgroundColor}` }}>
        <CompShopBrand storeInfo={storeInfo} dtid={distributorId} />
      </View>
      <HomeWgts wgts={filterWgts} dtid={distributorId} onLoad={fetchLikeList}>
        {/* 猜你喜欢 */}
        <SpRecommend className='recommend-block' info={likeList} />
      </HomeWgts>
    </SpPage>
  )
}

export default StoreIndex
