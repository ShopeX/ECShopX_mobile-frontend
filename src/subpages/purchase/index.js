import React, { useEffect, useState, useCallback } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import {
  SpPage,
  SpSearch,
  SpPrivacyModal,
} from '@/components'
import api from '@/api'
import {
  isWeixin,
  getDistributorId,
  VERSION_STANDARD,
  VERSION_PLATFORM,
  classNames
} from '@/utils'
import { updatePurchaseShareInfo } from '@/store/slices/purchase'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import HomeWgts from '@/pages/home/comps/home-wgts'
import { WgtHomeHeader } from '@/pages/home/wgts'
import configStore from '@/store'
import CompTabbar from './comps/comp-tabbar'

import '@/pages/home/index.scss'

const MSpPrivacyModal = React.memo(SpPrivacyModal)

const initialState = {
  wgts: [],
  loading: true
}

const { store } = configStore()

function Home() {
  const [state, setState] = useImmer(initialState)
  const { initState, openLocation, openStore, appName } = useSelector((state) => state.sys)
  const { purchase_share_info = {} } = useSelector((state) => state.purchase)
  const { isLogin, login, checkPolicyChange } = useLogin({
    policyUpdateHook: (isUpdate) => {
      if (isUpdate) {
        setPolicyModal(true)
      } else {
      }
    }
  })
  const $instance = getCurrentInstance()

  const [policyModal, setPolicyModal] = useState(false)
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

  useEffect(() => {
    const { activity_id, enterprise_id, pages_template_id } = $instance.router.params || {}
    if (activity_id) {
      dispatch(updatePurchaseShareInfo({ activity_id, enterprise_id, pages_template_id }))
    }
  }, [])

  const init = async () => {
    await fetchWgts()
  }

  const fetchWgts = async () => {
    const { pages_template_id } = purchase_share_info
    console.log(purchase_share_info, pages_template_id, '-----purchase_share_info----')
    const { config, tab_bar } = await api.shop.getShopTemplate({
      distributor_id: getDistributorId(),
      pages_template_id
    })
    const tabBar = tab_bar && JSON.parse(tab_bar)
    store.dispatch({
      type: 'purchase/updatePurchaseTabbar',
      payload: {
        tabbar: tabBar
      }
    })
    setState((draft) => {
      draft.wgts = config
      draft.loading = false
    })
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

  console.log('pageData:', pageData)

  return (
    <SpPage
      className='page-index'
      scrollToTopBtn
      // renderNavigation={renderNavigation()}
      pageConfig={pageData?.base}
      renderFooter={<CompTabbar />}
      loading={loading}
    >
      <View
        className={classNames('home-body', {
          'has-home-header': isShowHomeHeader && isWeixin
        })}
      >
        {isShowHomeHeader && <WgtHomeHeader>{fixedTop && <SpSearch />}</WgtHomeHeader>}
        <HomeWgts wgts={filterWgts} />
      </View>

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