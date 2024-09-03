import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import qs from 'qs'
import { View } from '@tarojs/components'
import { SpPage, SpSearch, SpSkuSelect,SpTabbar } from '@/components'
import { WgtsContext } from '@/pages/home/wgts/wgts-context'
import { getDistributorId, log, entryLaunch, pickBy, showToast } from '@/utils'
import { platformTemplateName, transformPlatformUrl } from '@/utils/platform'
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
  isShowTabBar:false
}
function CustomPage(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { setNavigationBarTitle } = useNavigation()
  const { wgts, loading, shareInfo, skuPanelOpen, selectType, info,isShowTabBar } = state
  const MSpSkuSelect = React.memo(SpSkuSelect)
  const pageRef = useRef()

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])

  const fetch = async () => {
    const { id,isTabBar } = await entryLaunch.getRouteParams($instance.router.params)
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
    // setNavigationBarTitle(share?.page_name)
    // Taro.setNavigationBarTitle({
    //   title: share?.page_name
    // })
    // this.setState(
    //   {
    //     positionStatus: (fixSetting.length && fixSetting[0].params.config.fixTop) || false
    //   },
    //   () => {
    //     this.fetchInfo()
    //   }
    // )
  }

  useShareAppMessage(async (res) => {
    return getAppShareInfo()
  })

  useShareTimeline(async (res) => {
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
      showToast(e.message)
      Taro.hideLoading()
    }
  }

  const getAppShareInfo = async () => {
    const { id } = await entryLaunch.getRouteParams($instance.router.params)
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `?uid=${userId}&id=${id}` : `?id=${id}`
    const path = `/pages/custom/custom-page${query}`
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
      scrollToTopBtn
      className='page-custom-page'
      pageConfig={pageData?.base}
      loading={loading}
      title={shareInfo?.page_name}
      ref={pageRef}
      renderFooter={isShowTabBar && <SpTabbar />}
      fixedTopContainer={fixedTop && <SpSearch info={searchComp} />}
    >
      <WgtsContext.Provider
        value={{
          onAddToCart
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
    </SpPage>
  )
}

CustomPage.options = {
  addGlobalClass: true
}

export default CustomPage
