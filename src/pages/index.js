/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useCallback } from 'react'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useDidShow
} from '@tarojs/taro'
import { View, Image, ScrollView, Text } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import throttle from 'lodash/throttle'
import {
  SpScreenAd,
  SpPage,
  SpSearch,
  SpRecommend,
  SpTabbar,
  SpCouponPackage,
  SpSkuSelect,
  SpPrivacyModal,
  SpLogin,
  SpLoading
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
  log,
  showToast,
  entryLaunch,
  buildSharePath
} from '@/utils'
import { updateShopInfo } from '@/store/slices/shop'
import {
  updatePurchaseShareInfo,
  updateInviteCode,
  updateEnterpriseId
} from '@/store/slices/purchase'
import S from '@/spx'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation, useLocation, useModal, useEffectAsync } from '@/hooks'
import doc from '@/doc'
import { SG_ROUTER_PARAMS } from '@/consts/localstorage'
import withPageWrapper from '@/hocs/withPageWrapper'
import HomeWgts from './home/comps/home-wgts'
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
  selectType: 'picker',
  navigateMantle: false,
  footerHeight: 0,
  distributor_id: null,
  backTopScrollTop: null,
  bodyHeight: 0,
  scrollIntoView: null,
  navbarHeight: 0
}

function Home() {
  const { updatePolicyTime, setToken, login } = useLogin({
    autoLogin: false
  })
  const { showModal } = useModal()
  const [state, setState] = useImmer(initialState)
  const [likeList, setLikeList] = useImmer([])
  const pageRef = useRef()

  const { openRecommend, appName, openScanQrcode, entryStoreByLBS, openWechatappLocation } =
    useSelector((state) => state.sys)
  const { shopInfo } = useSelector((state) => state.shop)

  const showAdv = useSelector((member) => member.user.showAdv)
  const { location, address } = useSelector((state) => state.user)
  const nearbyText = address?.city || location?.city || ''
  const { setNavigationBarTitle } = useNavigation()
  const { updateAddress } = useLocation()
  const {
    wgts,
    pageData,
    filterWgts,
    isShowHomeHeader,
    info,
    skuPanelOpen,
    selectType,
    navigateMantle,
    scrollIntoView
  } = state

  const dispatch = useDispatch()

  useEffectAsync(async () => {
    fetchWgts()
    setNavigationBarTitle(appName)

    log.info({ str: 'hello world' }, 'info log', 100, [1, 2, 3])
  }, [])

  useDidShow(() => {
    dispatch(updatePurchaseShareInfo())
    dispatch(updateInviteCode())
    dispatch(updateEnterpriseId())
    // 通知挂件（如浏览记录）刷新本地数据
    Taro.eventCenter.trigger('homePageShow')
  })

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

  useShareAppMessage(async () => {
    const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
    let params = getCurrentPageRouteParams()
    if (VERSION_STANDARD) {
      params = Object.assign(params, { dtid: getCurrentShopId() })
    }
    const path = buildSharePath('poster_home', params)

    console.log('useShareAppMessage path:', path, params)

    return {
      title: title,
      imageUrl: imageUrl,
      path
    }
  })

  useShareTimeline(async () => {
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

  const fetchWgts = async () => {
    setState((draft) => {
      draft.wgts = []
      draft.pageData = []
      draft.filterWgts = []
      draft.loading = true
    })
    try {
      // 为了店铺隔离模版和店铺信息保持一致
      const distributor_id = getDistributorId()

      const res = await api.shop.getShopTemplate({
        distributor_id: distributor_id
      })

      // 确保返回数据有效
      if (!res || !res.config || !Array.isArray(res.config)) {
        log.error('getShopTemplate:', res)
        setState((draft) => {
          draft.loading = false
        })
        return
      }

      const { config } = res
      const searchComp = config.find((wgt) => wgt.name == 'search')
      const pageData = config.find((wgt) => wgt.name == 'page')
      console.log('pageData:', pageData?.base?.isImmersive)
      let filterWgts = []
      if (searchComp && searchComp.config && searchComp.config.fixTop) {
        filterWgts = config.filter((wgt) => wgt.name !== 'search' && wgt.name != 'page')
      } else {
        filterWgts = config.filter((wgt) => wgt.name != 'page')
      }

      const fixedTop = searchComp && searchComp.config && searchComp.config.fixTop
      const isShowHomeHeader =
        (VERSION_STANDARD && entryStoreByLBS && openWechatappLocation == 1) ||
        (VERSION_PLATFORM && openWechatappLocation == 1) ||
        (openScanQrcode == 1 && isWeixin) ||
        fixedTop

      setState((draft) => {
        draft.wgts = config
        draft.searchComp = searchComp
        draft.pageData = pageData
        draft.fixedTop = fixedTop
        draft.isShowHomeHeader = isShowHomeHeader
        draft.filterWgts = filterWgts
        draft.loading = false
        draft.distributor_id = distributor_id
      })
    } catch (error) {
      log.error('fetchWgts:', error)
      setState((draft) => {
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

  // 定位

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
      Taro.hideLoading({
        success: () => {
          showToast(e.message)
        }
      })
    }
  }

  return (
    <SpPage
      className='page-index'
      scrollToTopBtn
      immersive={pageData?.base?.isImmersive}
      // renderNavigation={renderNavigation()}
      showpoweredBy={false}
      pageConfig={pageData?.base || {}}
      nearbyText={nearbyText}
      renderFloat={wgts.length > 0 && <CompFloatMenu />}
      renderFooter={<SpTabbar />}
      onScrollToTop={() => {
        console.log('onScrollToTop')
        // 先设置为一个很小的非0值，确保触发滚动变化
        setState((draft) => {
          draft.backTopScrollTop = 0.1
        })
        // 立即设置为0，滚动到顶部
        setTimeout(() => {
          setState((draft) => {
            draft.backTopScrollTop = 0
          })
        }, 0)
      }}
      ref={pageRef}
      navigateMantle={navigateMantle}
      onReady={({ height, gNavbarH }) => {
        setState((draft) => {
          draft.bodyHeight = height
          draft.navbarHeight = gNavbarH
        })
      }}
    >
      <ScrollView
        scrollY
        scrollTop={state.backTopScrollTop}
        onScroll={(e) => {
          pageRef.current.handlePageScroll(e?.detail)
        }}
        scrollIntoView={scrollIntoView}
        style={{ height: state.bodyHeight }}
        className={classNames('home-body', {
          'has-home-header': isShowHomeHeader && isWeixin
        })}
      >
        <>
          <View
            className='home-body-content'
            style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <View style={{ flex: 1 }}>
              {filterWgts.length > 0 && (
                <WgtsContext.Provider
                  value={{
                    onAddToCart,
                    isTab: true,
                    immersive: pageData?.base?.isImmersive,
                    isShowHomeHeader: isShowHomeHeader && isWeixin,
                    navBarHeight: state.navbarHeight,
                    footerHeight: state.footerHeight,
                    setScrollIntoView: (view) => {
                      setState((draft) => {
                        draft.scrollIntoView = view
                      })
                    }
                  }}
                >
                  <HomeWgts wgts={filterWgts} onLoad={fetchLikeList} dtid={state.distributor_id}>
                    {/* 猜你喜欢 */}
                    <SpRecommend className='recommend-block' info={likeList} />
                  </HomeWgts>
                </WgtsContext.Provider>
              )}
            </View>
            {/* If you remove or alter Shopex brand identifiers, you must obtain a branding removal license from Shopex.  Contact us at:  http://www.shopex.cn to purchase a branding removal license. */}
            {/* <View className='sp-page__powered-by w-full'>
            <Text>Powered by</Text>
            <Image
              src='/assets/imgs/powered-logo.png'
              className='powered-logo'
              mode='contain'
            />
          </View> */}
          </View>

          {/* 小程序收藏提示 */}
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
        </>
      </ScrollView>
    </SpPage>
  )
}

export default withPageWrapper(Home)
