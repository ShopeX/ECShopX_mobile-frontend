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
  useShareTimeline
} from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import qs from 'qs'
import { SpPage, SpSearch, SpSkuSelect, SpTabbar, SpLogin } from '@/components'
import { WgtsContext } from '@/pages/home/wgts/wgts-context'
import { getDistributorId, log, entryLaunch, pickBy, showToast, buildSharePath } from '@/utils'
import { platformTemplateName } from '@/utils/platform'
import { useNavigation } from '@/hooks'
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
  footerHeight: 0
}
function CustomPage(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { wgts, loading, shareInfo, skuPanelOpen, selectType, info, isShowTabBar } = state
  const MSpSkuSelect = React.memo(SpSkuSelect)
  const pageRef = useRef()
  const loginRef = useRef()
  const router = useRouter()

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
    const { id, isTabBar } = await entryLaunch.getRouteParams($instance.router.params)
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

  const getAppShareInfo = async () => {
    const { id } = await entryLaunch.getRouteParams($instance.router.params)
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
  let filterWgts = []
  if (searchComp && searchComp.config.fixTop) {
    filterWgts = wgts.filter((wgt) => wgt.name !== 'search')
  } else {
    filterWgts = wgts
  }
  const fixedTop = searchComp && searchComp.config.fixTop
  const pageData = wgts.find((wgt) => wgt.name == 'page')
  return (
    <SpPage
      btnHomeEnable={router.params.fromConnect !== 'davild'}
      scrollToTopBtn
      className='page-custom-page'
      loading={loading}
      title={shareInfo?.page_name}
      ref={pageRef}
      renderFooter={isShowTabBar && <SpTabbar height={state.footerHeight} />}
      fixedTopContainer={fixedTop && <SpSearch info={searchComp} />}
      onReady={({ footerHeight }) => {
        setState((draft) => {
          draft.footerHeight = footerHeight
        })
      }}
    >
      <WgtsContext.Provider
        value={{
          onAddToCart,
          immersive: pageData?.base?.isImmersive,
          isTab: isShowTabBar
        }}
      >
        <HomeWgts wgts={filterWgts} />
      </WgtsContext.Provider>

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
    </SpPage>
  )
}

CustomPage.options = {
  addGlobalClass: true
}

export default CustomPage
