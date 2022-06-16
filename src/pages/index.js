import React, { useEffect, useState, useCallback } from 'react'
import Taro, { useShareAppMessage, useShareTimeline, useDidShow } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { SpScreenAd, SpPage, SpSearch, SpRecommend, SpPrivacyModal, SpTabbar } from '@/components'
import api from '@/api'
import {
  isWeixin,
  getDistributorId,
  VERSION_STANDARD,
  VERSION_PLATFORM,
  VERSION_B2C,
  classNames
} from '@/utils'
import entryLaunch from '@/utils/entryLaunch'
import { updateLocation } from '@/store/slices/user'
import { updateShopInfo } from '@/store/slices/shop'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import HomeWgts from './home/comps/home-wgts'
import { WgtHomeHeader, WgtHomeHeaderShop } from './home/wgts'
import CompAddTip from './home/comps/comp-addtip'
import CompFloatMenu from './home/comps/comp-floatmenu'

import './home/index.scss'

const MCompAddTip = React.memo(CompAddTip)
const MSpPrivacyModal = React.memo(SpPrivacyModal)

const initState = {
  wgts: [],
  showBackToTop: false,
  loading: true
}

function Home() {
  const [state, setState] = useImmer(initState)
  const [likeList, setLikeList] = useImmer([])
  const { openRecommend, openLocation, openStore, appName } = useSelector((state) => state.sys)
  const { isLogin, login, updatePolicyTime, checkPolicyChange } = useLogin({
    policyUpdateHook: (isUpdate) => {
      if (isUpdate) {
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
    init()
    setNavigationBarTitle(appName)
  }, [])

  useDidShow(() => {
    // 检查隐私协议是否变更或同意
    checkPolicyChange()
  })

  const init = async () => {
    if (VERSION_STANDARD) {
      await fetchStoreInfo(location)
    } else {
      await fetchWgts()
    }
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
    if (!location) {
      const res = await entryLaunch.getCurrentAddressInfo()
      dispatch(updateLocation(res))
    }

    if (VERSION_STANDARD) {
      fetchStoreInfo(location)
    }
  }

  const handleConfirmModal = useCallback(async () => {
    setPolicyModal(false)
    if ((VERSION_STANDARD && openLocation == 1) || VERSION_PLATFORM) {
      fetchLocation()
    }
  }, [])

  useShareAppMessage(async (res) => {
    const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
    return {
      title: title,
      imageUrl: imageUrl,
      path: '/pages/index'
    }
  })

  useShareTimeline(async (res) => {
    const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
    return {
      title: title,
      imageUrl: imageUrl,
      query: '/pages/index'
    }
  })

  const fetchStoreInfo = async ({ lat, lng }) => {
    let parmas = {
      distributor_id: getDistributorId() // 如果店铺id和经纬度都传会根据哪个去定位传参
    }
    if (openLocation == 1) {
      parmas.lat = lat
      parmas.lng = lng
      // parmas.distributor_id = undefined
    }
    const res = await api.shop.getShop(parmas)
    dispatch(updateShopInfo(res))
    await fetchWgts()
  }

  const searchComp = wgts.find((wgt) => wgt.name == 'search')
  let filterWgts = []
  if (searchComp && searchComp.config.fixTop) {
    filterWgts = wgts.filter((wgt) => wgt.name !== 'search')
  } else {
    filterWgts = wgts
  }

  const fixedTop = searchComp && searchComp.config.fixTop
  const isSetHight =
    VERSION_PLATFORM ||
    (openScanQrcode == 1 && isWeixin) ||
    (openStore && openLocation == 1) ||
    fixedTop
  return (
    <SpPage
      className='page-index'
      scrollToTopBtn
      renderFloat={wgts.length > 0 && <CompFloatMenu />}
      renderFooter={<SpTabbar />}
      loading={loading}
    >
      {/* header-block */}
      {VERSION_STANDARD ? (
        <WgtHomeHeaderShop isSetHight={isSetHight}>
          {fixedTop && <SpSearch isFixTop={searchComp.config.fixTop} />}
        </WgtHomeHeaderShop>
      ) : (
        <WgtHomeHeader isSetHight={isSetHight}>
          {fixedTop && <SpSearch isFixTop={searchComp.config.fixTop} />}
        </WgtHomeHeader>
      )}

      <View className={classNames(isSetHight ? 'home-body' : 'cus-home-body')}>
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
      {/* <SpCouponPackage /> */}
    </SpPage>
  )
}

export default Home
