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
import { useLogin } from '@/hooks'
import HomeWgts from './home/comps/home-wgts'
import { WgtHomeHeader, WgtHomeHeaderShop } from './home/wgts'
import CompAddTip from './home/comps/comp-addtip'
import CompFloatMenu from './home/comps/comp-floatmenu'

import './home/index.scss'

const MCompAddTip = React.memo(CompAddTip)
const MSpPrivacyModal = React.memo(SpPrivacyModal)

const initState = {
  wgts: [],
  shareInfo: {},
  showBackToTop: false,
  loading: true
}

function Home() {
  const [state, setState] = useImmer(initState)
  const [likeList, setLikeList] = useImmer([])
  const { openRecommend, openLocation } = useSelector((state) => state.sys)
  const { isLogin, login, updatePolicyTime, checkPolicyChange } = useLogin({
    // policyUpdateHook: () => { // 下面用了checkPolicyChange，不使用hook直接根据checkPolicyChange返回的值去判断是否更新
    //   if (openLocation == 1) setPolicyModal(true)
    // }
  })

  const [policyModal, setPolicyModal] = useState(false)
  const showAdv = useSelector((member) => member.user.showAdv)
  const { location = {} } = useSelector((state) => state.user)
  const { openScanQrcode } = useSelector((state) => state.sys)

  const { wgts, shareInfo, loading } = state

  const dispatch = useDispatch()

  useDidShow(() => {
    fetchShareInfo()
    // 检查隐私协议是否变更或同意
    getPolicyUpdate()
  })

  const getPolicyUpdate = async () => {
    const checkRes = await checkPolicyChange()
    if (!checkRes && openLocation == 1 && VERSION_STANDARD) {
      setPolicyModal(true)
    }
    if (!checkRes && openLocation == 2 && VERSION_STANDARD) {
      fetchStoreInfo(location)
    }
    if (!checkRes && VERSION_PLATFORM) {
      setPolicyModal(true)
    }
    if (checkRes) {
      fetchStoreInfo(location)
    }
  }

  const fetchWgts = async () => {
    // debugger
    const { config } = await api.shop.getShopTemplate({
      distributor_id: getDistributorId()
    })
    setState((draft) => {
      draft.wgts = config
      draft.loading = false
    })
    fetchLikeList()
  }

  const fetchLikeList = async () => {
    if (openRecommend == 1) {
      const query = {
        page: 1,
        pageSize: 1000
      }
      const { list } = await api.cart.likeList(query)
      setLikeList(list)
    }
  }

  const fetchShareInfo = async () => {
    const res = await api.wx.shareSetting({ shareindex: 'index' })
    setState((draft) => {
      draft.shareInfo = res
    })
  }

  // 定位
  const fetchLocation = async () => {
    const res = await entryLaunch.getCurrentAddressInfo()
    dispatch(updateLocation(res))
    fetchStoreInfo(res)
  }

  const handleConfirmModal = useCallback(async () => {
    setPolicyModal(false)
    if (openLocation == 1 && (VERSION_PLATFORM || VERSION_STANDARD)) {
      fetchLocation()
    } else {
      fetchStoreInfo(location)
    }
  }, [])

  useShareAppMessage(async (res) => {
    return {
      title: shareInfo.title,
      imageUrl: shareInfo.imageUrl,
      path: '/pages/index'
    }
  })

  useShareTimeline(async (res) => {
    return {
      title: shareInfo.title,
      imageUrl: shareInfo.imageUrl,
      query: '/pages/index'
    }
  })

  const fetchStoreInfo = async ({ lat, lng }) => {
    if (VERSION_PLATFORM) {
      fetchWgts()
      // fetchLikeList()
      return
    }
    let parmas = {
      distributor_id: getDistributorId() // 如果店铺id和经纬度都传会根据哪个去定位传参
    }
    if (openLocation) {
      parmas.lat = lat
      parmas.lng = lng
    }
    // if (parmas.lat && parmas.distributor_id) delete parmas.distributor_id
    const res = await api.shop.getShop(parmas)
    dispatch(updateShopInfo(res))

    fetchWgts()
    // fetchLikeList()
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
    VERSION_PLATFORM || (openScanQrcode == 1 && isWeixin) || (VERSION_B2C && fixedTop)
  return (
    <SpPage
      className='page-index'
      scrollToTopBtn
      renderFloat={<CompFloatMenu />}
      renderFooter={<SpTabbar />}
      loading={loading}
    >
      {/* header-block */}
      {VERSION_STANDARD ? (
        <WgtHomeHeaderShop>
          {fixedTop && <SpSearch isFixTop={searchComp.config.fixTop} />}
        </WgtHomeHeaderShop>
      ) : (
        <WgtHomeHeader isSetHight={isSetHight}>
          {fixedTop && <SpSearch isFixTop={searchComp.config.fixTop} />}
        </WgtHomeHeader>
      )}

      <View className={classNames(isSetHight ? 'home-body' : 'cus-home-body')}>
        <HomeWgts wgts={filterWgts} />
      </View>

      {/* 猜你喜欢 */}
      <SpRecommend className='recommend-block' info={likeList} />

      {/* 小程序搜藏提示 */}
      {isWeixin && <MCompAddTip />}

      {/* 开屏广告 */}
      {isWeixin && !showAdv && <SpScreenAd />}

      {/* 隐私政策 */}
      <MSpPrivacyModal
        open={policyModal}
        onCancel={() => {
          setPolicyModal(false)
          fetchStoreInfo(location)
        }}
        onConfirm={handleConfirmModal}
      />

      {/* 优惠券包 */}
      {/* <SpCouponPackage /> */}
    </SpPage>
  )
}

export default Home
