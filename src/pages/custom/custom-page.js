/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, {
  useRouter,
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
} from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'
import qs from 'qs'
import { SpPage, SpSkuSelect, SpTabbar, SpLogin, SpPoweredBy } from '@/components'
import { WgtsContext } from '@/pages/home/wgts/wgts-context'
import { getDistributorId, log, entryLaunch, buildSharePath } from '@/utils'
import { platformTemplateName } from '@/utils/platform'
import req from '@/api/req'
import HomeWgts from '@/pages/home/comps/home-wgts'
import './custom-page.scss'

const initialState = {
  wgts: [],
  loading: true,
  shareInfo: null,
  info: null,
  skuPanelOpen: false,
  selectType: 'picker',
  isShowTabBar: false,
  footerHeight: 0,
  bodyHeight: 0,
  scrollIntoView: null,
  navbarHeight: 0
}
function CustomPage(props) {
  const $instance = getCurrentInstance() || {}
  const [state, setState] = useImmer(initialState)
  const { wgts, loading, shareInfo, skuPanelOpen, selectType, info, isShowTabBar, scrollIntoView, navbarHeight } = state
  const MSpSkuSelect = React.memo(SpSkuSelect)
  const pageRef = useRef()
  const loginRef = useRef()
  const router = useRouter()
  const { location, address } = useSelector((state) => state.user)
  const nearbyText = address?.adrdetail
    ? address?.city || address?.province || ''
    : location?.city || location?.province || address?.city || ''

  useEffect(() => {
    fetch()
    entryLaunch.postGuideUV()
    entryLaunch.postGuideTask()
  }, [])

  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])

  const fetch = async () => {
    const { id, isTabBar } = await entryLaunch.getRouteParams($instance?.router?.params)
    const pathparams = qs.stringify({
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: `custom_${id}`,
      distributor_id: getDistributorId()
    })
    const url = `/pageparams/setting?${pathparams}`
    const { config, share } = await req.get(url)

    setState((draft) => {
      draft.wgts = config
      draft.loading = false
      draft.shareInfo = share
      draft.isShowTabBar = isTabBar
    })
  }

  useShareAppMessage(async () => {
    return getAppShareInfo()
  })

  useShareTimeline(async () => {
    return getAppShareInfo()
  })

  const getAppShareInfo = async () => {
    const { id } = await entryLaunch.getRouteParams($instance?.router?.params)
    const { userId } = Taro.getStorageSync('userinfo')
    const params = { id }
    if (userId) {
      params.uid = userId
    }
    const path = buildSharePath('poster_custom_page', params)

    log.debug(`getAppShareInfo: ${path}`)
    return {
      title: shareInfo.page_share_title,
      imageUrl: shareInfo.page_share_imageUrl,
      path
    }
  }

  const searchComp = wgts.find((wgt) => wgt.name == 'search')
  const pageData = wgts.find((wgt) => wgt.name == 'page')
  let filterWgts = []
  if (searchComp && searchComp.config && searchComp.config.fixTop) {
    filterWgts = wgts.filter((wgt) => wgt.name !== 'search' && wgt.name != 'page')
  } else {
    filterWgts = wgts.filter((wgt) => wgt.name != 'page')
  }
  return (
    <SpPage
      btnHomeEnable={router?.params.fromConnect !== 'davild'}
      scrollToTopBtn
      className='page-custom-page'
      showpoweredBy={false}
      loading={loading}
      title={shareInfo?.page_name}
      immersive={pageData?.base?.isImmersive}
      pageConfig={pageData?.base || {}}
      nearbyText={nearbyText}
      ref={pageRef}
      renderFooter={isShowTabBar && <SpTabbar height={state.footerHeight} />}
      onReady={({ footerHeight, height, gNavbarH }) => {
        setState((draft) => {
          draft.footerHeight = footerHeight
          draft.bodyHeight = height
          draft.navbarHeight = gNavbarH
        })
      }}
    >
      <ScrollView
        scrollY
        onScroll={(e) => {
          pageRef.current.handlePageScroll(e?.detail)
        }}
        scrollIntoView={scrollIntoView}
        style={{ height: state.bodyHeight }}
      >
        <WgtsContext.Provider
          value={{
            immersive: pageData?.base?.isImmersive,
            isTab: isShowTabBar,
            navBarHeight: navbarHeight,
            footerHeight: state.footerHeight,
            setScrollIntoView: (view) => {
              setState((draft) => {
                draft.scrollIntoView = view
              })
            }
          }}
        >
          <HomeWgts wgts={filterWgts} />
        </WgtsContext.Provider>
        {/* If you remove or alter Shopex brand identifiers, you must obtain a branding removal license from Shopex.  Contact us at:  http://www.shopex.cn to purchase a branding removal license. */}
        <View className='sp-page__powered-by w-full'>
          <SpPoweredBy />
        </View>

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

        {/* 登录组件 */}
        <SpLogin
          ref={loginRef}
          newUser
          onChange={() => {
            // 新注册会员登录成功
            // 登录成功后需要获取店铺信息，然后查看店铺
            checkEnterStoreRule()
          }}
          onPolicyClose={() => {
            onPolicyChange(false)
          }}
        ></SpLogin>
      </ScrollView>
    </SpPage>
  )
}

CustomPage.options = {
  addGlobalClass: true
}

export default CustomPage
