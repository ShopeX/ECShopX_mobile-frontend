import React, { useEffect, useState, useCallback } from 'react'
import Taro, { getCurrentInstance, useDidShow, useRouter } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import {
  SpPage,
  SpSearch,
  SpPrivacyModal,
  SpTabbar,
  SpSkuSelect
} from '@/components'
import api from '@/api'
import {
  isWeixin,
  getDistributorId,
  VERSION_STANDARD,
  VERSION_PLATFORM,
  classNames,
  pickBy,
  showToast
} from '@/utils'
import { updatePurchaseShareInfo, updatePurchaseTabbar } from '@/store/slices/purchase'
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
  selectType: 'picker'
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

  const [policyModal, setPolicyModal] = useState(false)
  const { openScanQrcode } = useSelector((state) => state.sys)
  const { setNavigationBarTitle } = useNavigation()

  const { wgts, loading ,info ,skuPanelOpen ,selectType} = state

  const dispatch = useDispatch()

  useEffect(() => {
    const { activity_id, enterprise_id, pages_template_id } = router.params || {}
    if (activity_id) {
      dispatch(updatePurchaseShareInfo({ activity_id, enterprise_id, pages_template_id }))
    }
  }, [])

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
    await fetchWgts()
  }

  const fetchWgts = async () => {
    try {
      const { config, tab_bar } = await api.shop.getShopTemplate({
        distributor_id: curDistributorId ?? getDistributorId(),
        pages_template_id: router.params?.pages_template_id || purchase_share_info?.pages_template_id,
        e_activity_id: router.params?.activity_id || purchase_share_info?.activity_id
      })
      const tabBar = tab_bar && JSON.parse(tab_bar)
      dispatch(updatePurchaseTabbar({
        tabbar: tabBar
      }))
      setState((draft) => {
        draft.wgts = config
        draft.loading = false
      })
    } catch (e) {
      dispatch(updatePurchaseTabbar({
        tabbar: null
      }))
    }
  }

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

  console.log('pageData:', pageData)
  return (
    <SpPage
      className='page-purchase-index'
      scrollToTopBtn
      // renderNavigation={renderNavigation()}
      pageConfig={pageData?.base}
      renderFooter={<CompTabbar />}
      loading={loading}
    >
      <ScrollView
        className={classNames('home-body', {
          'has-home-header': isShowHomeHeader && isWeixin
        })}
        scrollY
      >
        {isShowHomeHeader && process.env.APP_PLATFORM === 'platform' && <WgtHomeHeader>{fixedTop && <SpSearch info={searchComp} />}</WgtHomeHeader>}
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

    </SpPage>
  )
}

export default Home
