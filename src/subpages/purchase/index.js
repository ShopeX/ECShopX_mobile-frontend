import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import Taro, {
  getCurrentInstance,
  useDidShow,
  useRouter,
  useShareAppMessage,
  useShareTimeline
} from '@tarojs/taro'
import { View, Image, ScrollView, Button } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import {
  SpPage,
  SpSearch,
  SpPrivacyModal,
  SpTabbar,
  SpSkuSelect,
  SpFloatMenus,
  SharePurchase,
  SpPoster,
  SpImage
} from '@/components'
import api from '@/api'
import {
  isWeixin,
  getDistributorId,
  VERSION_STANDARD,
  VERSION_PLATFORM,
  classNames,
  pickBy,
  showToast,
  log
} from '@/utils'
import {
  updatePurchaseShareInfo,
  updatePurchaseTabbar,
  updatePersistPurchaseShareInfo
} from '@/store/slices/purchase'
import doc from '@/doc'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import HomeWgts from '@/pages/home/comps/home-wgts'
import { WgtHomeHeader } from '@/pages/home/wgts'
import configStore from '@/store'
import CompTabbar from './comps/comp-tabbar'
import { WgtsContext } from '@/pages/home/wgts/wgts-context'
import './index.scss'

const MSpPrivacyModal = React.memo(SpPrivacyModal)
const MSpSkuSelect = React.memo(SpSkuSelect)

const initialState = {
  wgts: [],
  loading: true,
  info: null,
  skuPanelOpen: false,
  selectType: 'picker',
  isOpened: false,
  posterModalOpen: false,
  activityInfo: {}
}

const { store } = configStore()

function Home() {
  const [state, setState] = useImmer(initialState)
  const { initState, openLocation, openStore, appName } = useSelector((state) => state.sys)
  const { purchase_share_info = {}, curDistributorId } = useSelector((state) => state.purchase)
  const { isLogin, login, checkPolicyChange } = useLogin({
    policyUpdateHook: (isUpdate) => {
      if (isUpdate) {
        setPolicyModal(true)
      } else {
      }
    }
  })
  const router = useRouter()
  const pageRef = useRef()

  const [policyModal, setPolicyModal] = useState(false)
  const { openScanQrcode } = useSelector((state) => state.sys)
  const { setNavigationBarTitle } = useNavigation()

  const { wgts, loading, info, skuPanelOpen, selectType, isOpened, posterModalOpen, activityInfo } =
    state

  const dispatch = useDispatch()

  useEffect(() => {
    Taro.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    const { activity_id, enterprise_id, pages_template_id } = router.params || {}
    if (activity_id) {
      dispatch(updatePurchaseShareInfo({ activity_id, enterprise_id, pages_template_id }))
      dispatch(updatePersistPurchaseShareInfo({ activity_id, enterprise_id, pages_template_id }))
    }
  }, [])

  useEffect(() => {
    if (initState) {
      init()
      setNavigationBarTitle(appName)
    }
  }, [initState])

  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])

  useDidShow(() => {
    // 检查隐私协议是否变更或同意
    checkPolicyChange()
  })

  //是否可以分享亲友
  const isPurchaseShare = useMemo(() => {
    return !!(activityInfo?.is_employee && activityInfo?.if_relative_join)
  }, [activityInfo])

  const init = async () => {
    await fetchWgts()
    await fetchActivity()
  }

  const fetchWgts = async () => {
    try {
      const { config, tab_bar } = await api.shop.getShopTemplate({
        distributor_id: curDistributorId ?? getDistributorId(),
        pages_template_id:
          router.params?.pages_template_id || purchase_share_info?.pages_template_id,
        e_activity_id: router.params?.activity_id || purchase_share_info?.activity_id
      })
      const tabBar = tab_bar && JSON.parse(tab_bar)
      dispatch(
        updatePurchaseTabbar({
          tabbar: tabBar
        })
      )
      setState((draft) => {
        draft.wgts = config
        draft.loading = false
      })
    } catch (e) {
      dispatch(
        updatePurchaseTabbar({
          tabbar: null
        })
      )
    }
  }

  const fetchActivity = async () => {
    const activity_id = router.params?.activity_id || purchase_share_info?.activity_id
    const enterprise_id = router.params?.enterprise_id || purchase_share_info?.enterprise_id
    const data = await api.purchase.getEmployeeActivitydata({ activity_id, enterprise_id })
    setState((draft) => {
      draft.activityInfo = data
    })
  }

  useShareAppMessage(async () => {
    return new Promise(async function (resolve, reject) {
      if (isPurchaseShare) {
        const activity_id = router.params?.activity_id || purchase_share_info?.activity_id
        const enterprise_id = router.params?.enterprise_id || purchase_share_info?.enterprise_id
        const data = await api.purchase.getEmployeeInviteCode({ enterprise_id, activity_id })
        log.debug(`/pages/purchase/auth?code=${data.invite_code}`)
        resolve({
          title: activityInfo.name,
          imageUrl: activityInfo.share_pic,
          path: `/pages/purchase/auth?code=${data.invite_code}&enterprise_id=${enterprise_id}&activity_id=${activity_id}`
        })
      }
    })
  })

  // useShareTimeline(async (res) => {
  //   return new Promise(async function (resolve,reject) {
  //     const activity_id = router.params?.activity_id || purchase_share_info?.activity_id
  //     const enterprise_id = router.params?.enterprise_id || purchase_share_info?.enterprise_id
  //     const data = await api.purchase.getEmployeeInviteCode({ enterprise_id, activity_id })
  //     log.debug(`/pages/purchase/auth?code=${data.invite_code}`)
  //     resolve({
  //       title: activityInfo.name,
  //       imageUrl: activityInfo.share_pic,
  //       path: `/pages/purchase/auth?code=${data.invite_code}&enterprise_id=${enterprise_id}&activity_id=${activity_id}`
  //     })
  //   })
  // })

  const handleConfirmModal = useCallback(async () => {
    setPolicyModal(false)
  }, [])

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

  const showInfo = () => {
    if (purchase_share_info.surplus_share_limitnum == '0') {
      Taro.showToast({
        title: '分享次数为0',
        icon: 'none'
      })
      return
    }
    // else {
    //   //选择分享海报还是卡片
    //   setState((draft) => {
    //     draft.isOpened = true
    //   })
    // }
  }

  const onCreatePoster = () => {
    setState((draft) => {
      draft.isOpened = false
      draft.posterModalOpen = true
    })
  }

  console.log('pageData:', pageData)
  return (
    <SpPage
      className='page-purchase-index'
      scrollToTopBtn
      ref={pageRef}
      // renderNavigation={renderNavigation()}
      pageConfig={pageData?.base}
      renderFooter={<CompTabbar />}
      renderFloat={
        false &&
        isPurchaseShare && (
          <Button open-type='share' size='mini' className='float-share' onClick={showInfo}>
            <SpImage src='share.png' className='share-btn' mode='aspectFit'></SpImage>
          </Button>
        )
      }
      loading={loading}
    >
      <ScrollView
        className={classNames('home-body', {
          'has-home-header': isShowHomeHeader && isWeixin
        })}
        scrollY
      >
        {isShowHomeHeader && process.env.APP_PLATFORM === 'platform' && (
          <WgtHomeHeader>{fixedTop && <SpSearch info={searchComp} />}</WgtHomeHeader>
        )}
        {filterWgts.length > 0 && (
          <WgtsContext.Provider
            value={{
              onAddToCart
            }}
          >
            <HomeWgts wgts={filterWgts} />
          </WgtsContext.Provider>
        )}
      </ScrollView>

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

      {/* 隐私政策 */}
      <MSpPrivacyModal
        open={policyModal}
        onCancel={() => {
          setPolicyModal(false)
        }}
        onConfirm={handleConfirmModal}
      />

      <SharePurchase
        open={isOpened}
        onCreatePoster={onCreatePoster}
        onClose={() => {
          setState((draft) => {
            draft.isOpened = false
          })
        }}
      ></SharePurchase>

      {/* 海报组件 */}
      {posterModalOpen && (
        <SpPoster
          info={purchase_share_info}
          type='invite'
          onClose={() => {
            setState((draft) => {
              draft.posterModalOpen = false
            })
          }}
        />
      )}
    </SpPage>
  )
}

export default Home
