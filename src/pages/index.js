import React, { useEffect, useState, useCallback } from 'react'
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
  SpPrivacyModal,
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
const MSpPrivacyModal = React.memo(SpPrivacyModal)

const initialState = {
  wgts: [],
  showBackToTop: false,
  loading: true
}

function Home() {
  const [state, setState] = useImmer(initialState)
  const [likeList, setLikeList] = useImmer([])

  const { initState, openRecommend, openLocation, openStore, appName } = useSelector(
    (state) => state.sys
  )
  const { isLogin, login, checkPolicyChange } = useLogin({
    policyUpdateHook: (isUpdate) => {
      if (isUpdate && process.env.APP_BUILD_TARGET != 'app') {
        setPolicyModal(true)
      } else {
        fetchLocation()
      }
    }
  })

  const [policyModal, setPolicyModal] = useState(false)
  const showAdv = useSelector((member) => member.user.showAdv)
  const { location } = useSelector((state) => state.user)
  const { openScanQrcode } = useSelector((state) => state.sys)
  const { setNavigationBarTitle } = useNavigation()

  const { wgts, loading } = state

  const dispatch = useDispatch()

  useEffect(() => {
    if (initState) {
      init()
      setNavigationBarTitle(appName)
    }
  }, [initState])

  useDidShow(() => {
    // 检查隐私协议是否变更或同意
    checkPolicyChange()
  })

  const init = async () => {
    // if (!VERSION_STANDARD) {
    await fetchWgts()
    // }
  }

  const fetchWgts = async () => {
    const { config } = await api.shop.getShopTemplate({
      distributor_id: getDistributorId()
    })
    setState((draft) => {
      draft.wgts = config
      draft.loading = false
    })
    // fetchLikeList()
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
  const fetchLocation = async () => {
    if (!location && ((VERSION_STANDARD && openLocation == 1) || VERSION_PLATFORM)) {
      try {
        const res = await entryLaunch.getCurrentAddressInfo()
        dispatch(updateLocation(res))
      } catch (e) {
        // 定位失败，获取默认店铺
        console.error('map location fail:', e)
      }
    }

    if (VERSION_STANDARD) {
      fetchStoreInfo(location)
    }
  }

  const handleConfirmModal = useCallback(async () => {
    setPolicyModal(false)
    fetchLocation()
  }, [])

  useShareAppMessage(async (res) => {
    const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
    const params = getCurrentPageRouteParams()
    const path = `/pages/index${isEmpty(params) ? '' : '?' + resolveStringifyParams(params)}`
    console.log('useShareAppMessage path:', path)
    return {
      title: title,
      imageUrl: imageUrl,
      path
    }
  })

  useShareTimeline(async (res) => {
    const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
    const params = getCurrentPageRouteParams()
    console.log('useShareTimeline params:', params)
    return {
      title: title,
      imageUrl: imageUrl,
      query: resolveStringifyParams(params)
    }
  })

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
    await fetchWgts()
  }

  const searchComp = wgts.find((wgt) => wgt.name == 'search')
  const pageData = wgts.find((wgt) => wgt.name == 'page')
  let filterWgts = []
  if (searchComp && searchComp.config.fixTop) {
    filterWgts = wgts.filter((wgt) => wgt.name !== 'search' && wgt.name != 'page')
  } else {
    filterWgts = wgts.filter((wgt) => wgt.name != 'page')
  }

  const fixedTop = searchComp && searchComp.config.fixTop

  const isShowHomeHeader =
    VERSION_PLATFORM ||
    (openScanQrcode == 1 && isWeixin) ||
    (VERSION_STANDARD && openStore && openLocation == 1) ||
    fixedTop

  console.log('pageData:', pageData)

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
      <View
        className={classNames('home-body', {
          'has-home-header': isShowHomeHeader && isWeixin
        })}
      >
        {isShowHomeHeader && <WgtHomeHeader>{fixedTop && <SpSearch info={searchComp} />}</WgtHomeHeader>}
        <HomeWgts wgts={filterWgts} onLoad={fetchLikeList}>
          {/* 猜你喜欢 */}
          <SpRecommend className='recommend-block' info={likeList} />
        </HomeWgts>
      </View>

      {/* 小程序搜藏提示 */}
      {isWeixin && <MCompAddTip />}

      {/* 开屏广告 */}
      {isWeixin && !showAdv && <SpScreenAd />}

      {/* 隐私政策 */}
      <MSpPrivacyModal
        open={policyModal}
        onCancel={() => {
          setPolicyModal(false)
        }}
        onConfirm={handleConfirmModal}
      />

      {/* 优惠券包 */}
      {VERSION_STANDARD && <SpCouponPackage />}
    </SpPage>
  )
}

export default Home
