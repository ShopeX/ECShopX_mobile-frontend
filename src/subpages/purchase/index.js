/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import Taro, { useDidShow, useRouter, useShareAppMessage } from '@tarojs/taro'
import { View, ScrollView, Button } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { SpPage, SpPrivacyModal, SpPoster, SpImage, SpPurchaseEnterpriseBar } from '@/components'
import { SharePurchase } from '@/subpages/components'
import api from '@/api'
import {
  isWeixin,
  VERSION_STANDARD,
  VERSION_PLATFORM,
  classNames,
  pickBy,
  showToast,
  log,
  buildSharePath,
  navigateTo
} from '@/utils'
import { updatePurchaseShareInfo, updatePersistPurchaseShareInfo } from '@/store/slices/purchase'
import doc from '@/doc'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import { useTranslation, $t } from '@/i18n'
import HomeWgts from '@/pages/home/comps/home-wgts'
import { WgtHomeHeader } from '@/pages/home/wgts'
import CompPurchaseNav from '@/pages/purchase/comps/comp-purchase-nav'
import configStore from '@/store'
import { WgtsContext } from '@/pages/home/wgts/wgts-context'
import CompSkuSelect from './comps/comp-skuselect'
import CompPurchaseActionbar from './comps/comp-purchase-actionbar'
import CompPurchaseQuotaSheet from './comps/comp-purchase-quota-sheet'
import './index.scss'

const MSpPrivacyModal = React.memo(SpPrivacyModal)
const MSpSkuSelect = React.memo(CompSkuSelect)

const initialState = {
  wgts: [],
  loading: true,
  info: null,
  skuPanelOpen: false,
  selectType: 'picker',
  isOpened: false,
  posterModalOpen: false,
  activityInfo: {},
  curItem: null,
  skuText: ''
}

const { store } = configStore()

function Home() {
  useTranslation()
  const [state, setState] = useImmer(initialState)
  const { initState, entryStoreByLBS, appName } = useSelector((state) => state.sys)
  const { purchase_share_info = {}, persist_purchase_share_info = {} } = useSelector(
    (state) => state.purchase
  )
  const { checkPolicyChange } = useLogin({
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
  const [quotaSheetOpen, setQuotaSheetOpen] = useState(false)
  const { openScanQrcode } = useSelector((state) => state.sys)
  const { setNavigationBarTitle } = useNavigation()

  const {
    wgts,
    loading,
    info,
    skuPanelOpen,
    selectType,
    isOpened,
    posterModalOpen,
    activityInfo,
    curItem
  } = state

  const dispatch = useDispatch()
  const { cartCount = 0 } = useSelector((state) => state.purchase)

  const remainingAmountText = useMemo(() => {
    const cents =
      activityInfo?.surplus_limitfee ?? activityInfo?.left_fee ?? activityInfo?.fee?.left_fee
    if (cents == null || cents === '') {
      return '¥0.00'
    }
    const n = Number(cents) / 100
    if (Number.isNaN(n)) {
      return '¥0.00'
    }
    return `¥${n.toFixed(2)}`
  }, [activityInfo])

  /** 额度抽屉：与 member / share 注释区字段一致，单位分 */
  const quotaFeeCents = useMemo(
    () => ({
      total: activityInfo?.total_limitfee ?? activityInfo?.limit_fee,
      used: activityInfo?.used_limitfee ?? activityInfo?.aggregate_fee,
      remaining:
        activityInfo?.surplus_limitfee ?? activityInfo?.left_fee ?? activityInfo?.fee?.left_fee
    }),
    [activityInfo]
  )

  useEffect(() => {
    Taro.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    const routeContext = {
      activity_id: normalizeContextValue(router?.params?.activity_id),
      enterprise_id: normalizeContextValue(router?.params?.enterprise_id),
      pages_template_id: normalizeContextValue(router?.params?.pages_template_id)
    }
    if (routeContext.activity_id) {
      persistPurchaseContext(routeContext)
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

  //是否可以分享亲友
  const isPurchaseShare = useMemo(() => {
    return !!(activityInfo?.is_employee && activityInfo?.if_relative_join)
  }, [activityInfo])

  const init = async () => {
    const context = await ensurePurchaseContext()
    await fetchWgts(context)
    await fetchActivity(context)
  }

  const normalizeContextValue = (value) => {
    if (value == null || value === '' || value === 'null' || value === 'undefined') {
      return ''
    }
    return value
  }

  const normalizePurchaseContext = (source = {}) => {
    return {
      activity_id: normalizeContextValue(source.activity_id),
      enterprise_id: normalizeContextValue(source.enterprise_id),
      pages_template_id: normalizeContextValue(source.pages_template_id)
    }
  }

  const isSamePurchaseContext = (source, activityId, enterpriseId) => {
    if (!source?.activity_id || String(source.activity_id) !== String(activityId)) {
      return false
    }
    if (!enterpriseId || !source.enterprise_id) {
      return true
    }
    return String(source.enterprise_id) === String(enterpriseId)
  }

  const persistPurchaseContext = (context = {}) => {
    if (!context.activity_id) return
    dispatch(updatePurchaseShareInfo(context))
    dispatch(updatePersistPurchaseShareInfo(context))
  }

  const resolvePurchaseContext = () => {
    const params = normalizePurchaseContext(router?.params || {})
    const currentContext = normalizePurchaseContext(purchase_share_info)
    const persistContext = normalizePurchaseContext(persist_purchase_share_info)
    if (params.activity_id) {
      const matchedCache = [currentContext, persistContext].find((source) =>
        isSamePurchaseContext(source, params.activity_id, params.enterprise_id)
      )
      return {
        activity_id: params.activity_id,
        enterprise_id: params.enterprise_id || matchedCache?.enterprise_id,
        pages_template_id: params.pages_template_id || matchedCache?.pages_template_id
      }
    }

    return currentContext.activity_id ? currentContext : persistContext
  }

  const ensurePurchaseContext = async () => {
    const context = resolvePurchaseContext()
    if (!context.activity_id) {
      return context
    }

    if (context.enterprise_id && context.pages_template_id) {
      return context
    }

    try {
      const activityDetail = await api.purchase.getActivitydata({
        activity_id: context.activity_id,
        enterprise_id: context.enterprise_id
      })
      const nextContext = {
        activity_id: context.activity_id,
        enterprise_id:
          context.enterprise_id ||
          normalizeContextValue(activityDetail?.enterprise_id || activityDetail?.enterpriseId),
        pages_template_id:
          context.pages_template_id || normalizeContextValue(activityDetail?.pages_template_id)
      }
      persistPurchaseContext(nextContext)
      return nextContext
    } catch (e) {
      return context
    }
  }

  const fetchWgts = async (context = resolvePurchaseContext()) => {
    try {
      const { pages_template_id } = context
      if (!pages_template_id) {
        return setState((draft) => {
          draft.wgts = []
          draft.loading = false
        })
      }

      const res = await api.purchase.getPurchaseStoreHomePage(pages_template_id)
      const config = Array.isArray(res?.page_template_detail?.config)
        ? res?.page_template_detail?.config
        : []
      setState((draft) => {
        draft.wgts = Array.isArray(config) ? config : []
        draft.loading = false
      })
    } catch (e) {
      setState((draft) => {
        draft.loading = false
      })
    }
  }

  const fetchActivity = async (context = resolvePurchaseContext()) => {
    const { activity_id, enterprise_id } = context
    if (!activity_id || !enterprise_id) {
      return setState((draft) => {
        draft.activityInfo = {}
      })
    }
    try {
      const data = await api.purchase.getEmployeeActivitydata({ activity_id, enterprise_id })
      setState((draft) => {
        draft.activityInfo = data
      })
    } catch (e) {
      setState((draft) => {
        draft.activityInfo = {}
      })
    }
  }

  useDidShow(() => {
    // 检查隐私协议是否变更或同意
    checkPolicyChange()
    ;(async () => {
      const context = await ensurePurchaseContext()
      await fetchActivity(context)
    })()
  })

  useShareAppMessage(async () => {
    return new Promise(async function (resolve) {
      if (isPurchaseShare) {
        const { activity_id, enterprise_id } = await ensurePurchaseContext()
        const data = await api.purchase.getEmployeeInviteCode({ enterprise_id, activity_id })
        const params = {
          type: 'passcode',
          code: data.invite_code,
          enterprise_id,
          activity_id
        }
        const path = buildSharePath('poster_purchase_auth', params)
        log.debug(path)
        resolve({
          title: activityInfo.name,
          imageUrl: activityInfo.share_pic,
          path
        })
      }
    })
  })

  const handleConfirmModal = useCallback(async () => {
    setPolicyModal(false)
  }, [])

  /* 顶栏搜索为固定稿样式，不读装修；若模板仍下发 search 组件则从正文排除避免重复 */
  let filterWgts = wgts.filter((wgt) => wgt.name != 'page' && wgt.name !== 'search')

  const isShowHomeHeader =
    VERSION_PLATFORM || (openScanQrcode == 1 && isWeixin) || (VERSION_STANDARD && entryStoreByLBS)

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

  const showInfo = () => {
    if (purchase_share_info.surplus_share_limitnum == '0') {
      Taro.showToast({
        title: $t('63b11dbe.ce0559'),
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

  const onActionBarCart = useCallback(() => {
    navigateTo('/subpages/purchase/espier-index?tabbar=0')
  }, [])

  const onActionBarShare = useCallback(() => {
    if (!isPurchaseShare) {
      showToast($t('61144037.63023a'))
      return
    }
    if (purchase_share_info.surplus_share_limitnum == '0') {
      Taro.showToast({
        title: $t('63b11dbe.ce0559'),
        icon: 'none'
      })
      return
    }
    navigateTo('/subpages/purchase/share')
  }, [isPurchaseShare, purchase_share_info])

  const onActionBarQuota = useCallback(() => {
    setQuotaSheetOpen(true)
  }, [])

  return (
    <SpPage
      className='page-purchase-index'
      title={$t('c2581d4c.6fb7d0')}
      pageConfig={{ navigateBackgroundColor: '#ffffff' }}
      renderNavigation={(navProps) => <CompPurchaseNav {...navProps} />}
      scrollToTopBtn
      ref={pageRef}
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
        className={classNames('purchase-page__scroll', 'home-body', {
          'has-home-header': isShowHomeHeader && isWeixin
        })}
        scrollY
      >
        <View className='purchase-page'>
          {isShowHomeHeader && process.env.APP_PLATFORM === 'platform' && (
            <View className='purchase-page__toolbar'>
              <WgtHomeHeader />
            </View>
          )}

          <View className='purchase-page__head'>
            <SpPurchaseEnterpriseBar showSearch />
          </View>

          {filterWgts.length > 0 && (
            <View className='purchase-page__wgts'>
              <WgtsContext.Provider
                value={{
                  onAddToCart,
                  eActivityId: resolvePurchaseContext().activity_id
                }}
              >
                <HomeWgts wgts={filterWgts} />
              </WgtsContext.Provider>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sku选择器 */}
      <MSpSkuSelect
        open={skuPanelOpen}
        type={selectType}
        info={info}
        selectedItem={curItem}
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

      <CompPurchaseQuotaSheet
        open={quotaSheetOpen}
        onClose={() => setQuotaSheetOpen(false)}
        totalFeeCents={quotaFeeCents.total}
        usedFeeCents={quotaFeeCents.used}
        remainingFeeCents={quotaFeeCents.remaining}
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

      <CompPurchaseActionbar
        fixed
        cartCount={cartCount}
        remainingAmount={remainingAmountText}
        onCart={onActionBarCart}
        onShare={onActionBarShare}
        onQuota={onActionBarQuota}
      />
    </SpPage>
  )
}

export default Home
