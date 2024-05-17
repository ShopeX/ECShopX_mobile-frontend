import React, { useEffect, useRef, useCallback } from 'react'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useDidShow
} from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import {
  SpScreenAd,
  SpPage,
  SpSearch,
  SpRecommend,
  SpTabbar,
  SpCouponPackage,
  SpSkuSelect
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
  resolveStringifyParams,
  getCurrentShopId,
  pickBy,
  showToast
} from '@/utils'
import entryLaunch from '@/utils/entryLaunch'
import { updateLocation } from '@/store/slices/user'
import { updateShopInfo } from '@/store/slices/shop'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import doc from '@/doc'
import HomeWgts from './home/comps/home-wgts'
import { WgtHomeHeader, WgtHomeHeaderShop } from './home/wgts'
import { WgtsContext } from './home/wgts/wgts-context'
import CompAddTip from './home/comps/comp-addtip'
import CompFloatMenu from './home/comps/comp-floatmenu'

import './home/index.scss'

const MCompAddTip = React.memo(CompAddTip)
const MSpSkuSelect = React.memo(SpSkuSelect)

const initialState = {
  wgts: [],
  showBackToTop: false,
  loading: true,
  searchComp: null,
  pageData: null,
  fixedTop: false,
  filterWgts: [],
  isShowHomeHeader: false,
  info: null,
  skuPanelOpen: false,
  selectType: 'picker'
}

function Home() {
  const [state, setState] = useImmer(initialState)
  const [likeList, setLikeList] = useImmer([])
  const pageRef = useRef()

  const { initState, openRecommend, openLocation, openStore, appName, openScanQrcode } = useSelector(
    (state) => state.sys
  )
  const { shopInfo } = useSelector(
    (state) => state.shop
  )

  const showAdv = useSelector((member) => member.user.showAdv)
  const { location } = useSelector((state) => state.user)
  const { setNavigationBarTitle } = useNavigation()

  const { wgts, loading, searchComp, pageData, fixedTop,
    filterWgts,
    isShowHomeHeader,
    info,
    skuPanelOpen,
    selectType } = state

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

  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])

  useShareAppMessage(async (res) => {
    const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
    let params = getCurrentPageRouteParams()
    if (VERSION_STANDARD) {
      params = Object.assign(params, { dtid: getCurrentShopId() })
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
    if (VERSION_STANDARD) {
      params = Object.assign(params, { dtid: getCurrentShopId() })
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
<<<<<<< HEAD
  console.log('pageData?.base', pageData?.base)
=======

  const onAddToCart = async ({ itemId, distributorId }) => {
    Taro.showLoading()
    try {
      const itemDetail = await api.item.detail(itemId, {
        showError: false,
        distributor_id: distributorId
      })
      Taro.hideLoading()
      setState((draft) => {
        draft.info = pickBy(itemDetail, doc.goods.GOODS_INFO)
        draft.skuPanelOpen = true
        draft.selectType = 'addcart'
      })
    } catch (e) {
      showToast(e.message)
      Taro.hideLoading()
    }
  }

>>>>>>> origin/hotfix/3.13.21
  return (
    <SpPage
      className='page-index'
      scrollToTopBtn
      // renderNavigation={renderNavigation()}
      pageConfig={pageData?.base || {}}
      renderFloat={wgts.length > 0 && <CompFloatMenu />}
      renderFooter={<SpTabbar />}
      loading={loading}
      ref={pageRef}
    >
      <View
        className={classNames('home-body', {
          'has-home-header': isShowHomeHeader && isWeixin
        })}
      >
        {isShowHomeHeader && <WgtHomeHeader>{fixedTop && <SpSearch info={searchComp} />}</WgtHomeHeader>}
        {
          filterWgts.length > 0 && <WgtsContext.Provider value={{
            onAddToCart
          }}>
            <HomeWgts wgts={filterWgts} onLoad={fetchLikeList}>
              {/* 猜你喜欢 */}
              <SpRecommend className='recommend-block' info={likeList} />
            </HomeWgts>
          </WgtsContext.Provider>
        }
      </View>

      {/* 小程序搜藏提示 */}
      {isWeixin && <MCompAddTip />}

      {/* 开屏广告 */}
      {isWeixin && !showAdv && <SpScreenAd />}

      {/* 优惠券包 */}
      {VERSION_STANDARD && <SpCouponPackage />}


      {/* Sku选择器 */}
      <MSpSkuSelect
        open={skuPanelOpen}
        type={selectType}
        info={info}
        onClose={() => {
          setState((draft) => {
            draft.skuPanelOpen = false
          })
        }}
        onChange={(skuText, curItem) => {
          setState((draft) => {
            draft.skuText = skuText
            draft.curItem = curItem
          })
        }}
      />
    </SpPage>
  )
}

export default Home
