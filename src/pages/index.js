import React, { useEffect, useState, useCallback } from 'react'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useDidShow
} from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import {
  SpScreenAd,
  SpPage,
  SpSearch,
  SpRecommend,
  SpTabbar,
  SpCouponPackage
} from '@/components'
import api from '@/api'
import {
  isWeixin,
  isAPP,
  isEmpty,
  getDistributorId,
  VERSION_STANDARD,
  VERSION_PLATFORM,
  VERSION_IN_PURCHASE,
  VERSION_B2C,
  classNames,
  getCurrentPageRouteParams,
  resolveStringifyParams
} from '@/utils'
import entryLaunch from '@/utils/entryLaunch'
import { updateLocation } from '@/store/slices/user'
import { updateShopInfo } from '@/store/slices/shop'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import qs from 'qs'
import HomeWgts from './home/comps/home-wgts'
import { WgtHomeHeader, WgtHomeHeaderShop } from './home/wgts'
import CompAddTip from './home/comps/comp-addtip'
import CompFloatMenu from './home/comps/comp-floatmenu'

import './home/index.scss'

const MCompAddTip = React.memo(CompAddTip)

const initialState = {
  wgts: [],
  showBackToTop: false,
  loading: true,
  searchComp: null,
  pageData: null,
  fixedTop: false,
  filterWgts: [],
  isShowHomeHeader: false
}

function Home() {
  const [state, setState] = useImmer(initialState)
  const [likeList, setLikeList] = useImmer([])

  const { initState, openRecommend, openLocation, openStore, appName, openScanQrcode } = useSelector(
    (state) => state.sys
  )
  const { shopInfo } = useSelector(
    (state) => state.shop
  )

  const showAdv = useSelector((member) => member.user.showAdv)
  const { location } = useSelector((state) => state.user)
  const { setNavigationBarTitle } = useNavigation()

  const { wgts, loading, searchComp, pageData, fixedTop, filterWgts, isShowHomeHeader } = state

  const dispatch = useDispatch()

  useEffect(() => {
    if (initState) {
      init()
      setNavigationBarTitle(appName)
    }
  }, [initState])

  useEffect(() => {
    if (shopInfo && VERSION_STANDARD) {
      fetchWgts()
    }
  }, [shopInfo])

  useEffect(() => {
    if (location && VERSION_STANDARD) {
      fetchWgts()
    }
  }, [location])

  useShareAppMessage(async (res) => {
    const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
    let params = getCurrentPageRouteParams()
    const dtid = getDistributorId()
    if (dtid && !('dtid' in params)) {
      params = Object.assign(params, { dtid })
    }
    let path = `/pages/index${isEmpty(params) ? '' : '?' + resolveStringifyParams(params)}`

    console.log('useShareAppMessage path:', path, params)

    return {
      title: title,
      imageUrl: imageUrl,
      path
    }
  })

  useShareTimeline(async (res) => {
    const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
    let params = getCurrentPageRouteParams()
    const dtid = getDistributorId()

    if (dtid && !('dtid' in params)) {
      params = Object.assign(params, { dtid })
    }

    console.log('useShareTimeline params:', params)
    return {
      title: title,
      imageUrl: imageUrl,
      query: resolveStringifyParams(params)
    }
  })

  const init = async () => {
    fetchLocation()
    // 非云店
    if (!VERSION_STANDARD) {
      fetchWgts()
    } else {
      fetchStoreInfo(location)
    }
  }

  const fetchWgts = async () => {
    setState((draft) => {
      draft.wgts = []
      draft.pageData = []
      draft.filterWgts = []
      draft.loading = true
    })
    const { config } = await api.shop.getShopTemplate({
      distributor_id: getDistributorId()
    })
    const searchComp = config.find((wgt) => wgt.name == 'search')
    const pageData = config.find((wgt) => wgt.name == 'page')
    let filterWgts = []
    if (searchComp && searchComp.config.fixTop) {
      filterWgts = config.filter((wgt) => wgt.name !== 'search' && wgt.name != 'page')
    } else {
      filterWgts = config.filter((wgt) => wgt.name != 'page')
    }

    const fixedTop = searchComp && searchComp.config.fixTop
    const isShowHomeHeader =
      VERSION_PLATFORM ||
      (openScanQrcode == 1 && isWeixin) ||
      (VERSION_STANDARD && openStore && openLocation == 1) ||
      fixedTop

    setState((draft) => {
      draft.wgts = config
      draft.searchComp = searchComp
      draft.pageData = pageData
      draft.fixedTop = fixedTop
      draft.isShowHomeHeader = isShowHomeHeader
      draft.filterWgts = filterWgts
      draft.loading = false
    })
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

  // 定位
  const fetchLocation = () => {
    if (!location && ((VERSION_STANDARD && openLocation == 1) || VERSION_PLATFORM)) {
      try {
        entryLaunch.isOpenPosition((res) => {
          if (res.lat) {
            dispatch(updateLocation(res))
          }
        })
      } catch (e) {
        console.error('map location fail:', e)
      }
    }
  }

  const fetchStoreInfo = async (location) => {
    let params = {
      distributor_id: getDistributorId() // 如果店铺id和经纬度都传会根据哪个去定位传参
    }
    if (openLocation == 1 && location) {
      const { lat, lng } = location
      params.lat = lat
      params.lng = lng
      // params.distributor_id = undefined
    }
    const res = await api.shop.getShop(params)
    console.log('fetchStoreInfo:', res)
    dispatch(updateShopInfo(res))
  }

  return (
    <SpPage
      className='page-index'
      scrollToTopBtn
      // renderNavigation={renderNavigation()}
      pageConfig={pageData?.base}
      renderFloat={wgts.length > 0 && <CompFloatMenu />}
      renderFooter={<SpTabbar />}
      loading={loading}
    >
      <ScrollView
        className={classNames('home-body', {
          'has-home-header': isShowHomeHeader && isWeixin
        })}
        scrollY
      >
        {isShowHomeHeader && <WgtHomeHeader>{fixedTop && <SpSearch info={searchComp} />}</WgtHomeHeader>}
        {
          filterWgts.length > 0 && <HomeWgts wgts={filterWgts} onLoad={fetchLikeList}>
            {/* 猜你喜欢 */}
            <SpRecommend className='recommend-block' info={likeList} />
          </HomeWgts>
        }
      </ScrollView>

      {/* 小程序搜藏提示 */}
      {isWeixin && <MCompAddTip />}

      {/* 开屏广告 */}
      {isWeixin && !showAdv && <SpScreenAd />}

      {/* 优惠券包 */}
      {VERSION_STANDARD && <SpCouponPackage />}
    </SpPage>
  )
}

export default Home
