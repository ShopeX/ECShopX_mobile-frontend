import React, { useEffect, useRef, useCallback } from 'react'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useDidShow
} from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import {
  SpScreenAd,
  SpPage,
  SpSearch,
  SpRecommend,
  SpTabbar,
  SpCouponPackage,
  SpSkuSelect,
  SpPrivacyModal,
  SpLogin,
  SpModalDivided
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
  resolveStringifyParams,
  getCurrentShopId,
  pickBy,
  showToast,
  entryLaunch
} from '@/utils'
import { updateShopInfo, changeInWhite } from '@/store/slices/shop'
import {
  updatePurchaseShareInfo,
  updateInviteCode,
  updateEnterpriseId
} from '@/store/slices/purchase'
import S from '@/spx'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation, useLocation, useModal, useWhiteShop } from '@/hooks'
import doc from '@/doc'
import { SG_ROUTER_PARAMS } from '@/consts/localstorage'
import HomeWgts from './home/comps/home-wgts'
import { WgtHomeHeader, WgtHomeHeaderShop } from './home/wgts'
import { WgtsContext } from './home/wgts/wgts-context'
import CompAddTip from './home/comps/comp-addtip'
import CompFloatMenu from './home/comps/comp-floatmenu'
import { platformTemplateName } from '@/utils/platform'

import './home/index.scss'

const MCompAddTip = React.memo(CompAddTip)
const MSpSkuSelect = React.memo(SpSkuSelect)

const initialState = {
  wgts: [],
  showBackToTop: false,
  loading: true,
  searchComp: null,
  pageData: null,
  fixedTop: false,
  filterWgts: [],
  isShowHomeHeader: false,
  info: null,
  skuPanelOpen: false,
  selectType: 'picker',
  policyModal: false,
  modalDivided: {
    isShow: false,
    content: '',
    confirmText: '',
    showCancel: true,
    onCancel: null,
    onConfirm: null
  }
}

function Home() {
  const $instance = getCurrentInstance()
  const { isLogin, checkPolicyChange, isNewUser, updatePolicyTime, setToken, login } = useLogin({
    autoLogin: false,
    // 隐私协议变更
    policyUpdateHook: (isUpdate) => {
      console.log('🚀🚀🚀 ~ Home ~ policyUpdateHook:')

      isUpdate && onPolicyChange(true)
    },
    // // 登录成功后获取店铺信息
    loginSuccess: () => {
      // 老用户登录成功
      console.log('🚀🚀🚀 ~ Home ~ loginSuccess:')
      // 登录成功后获取店铺信息
      checkStoreIsolation()
    }
  })
  const { showModal } = useModal()
  const [state, setState] = useImmer(initialState)
  const [likeList, setLikeList] = useImmer([])
  const pageRef = useRef()
  const loginRef = useRef()
  const requestIdRef = useRef(0)
  const isFirstRender = useRef(true)
  const prevShopIdRef = useRef(null)
  const isFromPhoneCallBack = useRef(false) // 防止苹果手机返回不展示弹窗，但是安卓展示多次弹窗

  const {
    initState,
    openRecommend,
    openLocation,
    openStore,
    appName,
    openScanQrcode,
    open_divided,
    open_divided_templateId
  } = useSelector((state) => state.sys)
  const { shopInfo, shopInWhite } = useSelector((state) => state.shop)

  const showAdv = useSelector((member) => member.user.showAdv)
  const { location } = useSelector((state) => state.user)
  const { setNavigationBarTitle } = useNavigation()
  const { updateAddress } = useLocation()
  const { getWhiteShop, connectWhiteShop, phoneCall } = useWhiteShop({
    onPhoneCallComplete: () => {
      isFromPhoneCallBack.current = true
      checkStoreIsolation()
    }
  })
  const {
    wgts,
    loading,
    searchComp,
    pageData,
    fixedTop,
    filterWgts,
    isShowHomeHeader,
    info,
    skuPanelOpen,
    selectType,
    policyModal,
    modalDivided
  } = state

  const dispatch = useDispatch()

  useEffect(() => {
    if (initState) {
      init()
      setNavigationBarTitle(appName)
    }
  }, [initState])

  useDidShow(() => {
    dispatch(updatePurchaseShareInfo())
    dispatch(updateInviteCode())
    dispatch(updateEnterpriseId())
  })

  useEffect(() => {
    if (shopInfo && VERSION_STANDARD) {
      // 比较当前店铺ID与上一次的是否相同
      const currentShopId = shopInfo.distributor_id
      if (currentShopId != prevShopIdRef.current) {
        fetchWgts()
        prevShopIdRef.current = currentShopId
      }
    }
  }, [shopInfo])

  useEffect(() => {
    if (location && VERSION_STANDARD) {
      fetchWgts()
    }
  }, [location])

  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])

  useEffect(() => {
    if (open_divided) {
      // console.log("🚀🚀🚀 ~ useEffect ~ useEffect:")
      checkStoreIsolation()
    }
  }, [open_divided])

  // 需要在页面返回到首页的时候执行，第一次页面渲染的时候不执行
  useDidShow(() => {
    if (
      VERSION_STANDARD &&
      open_divided &&
      !isFirstRender.current &&
      !isFromPhoneCallBack.current
    ) {
      // console.log("🚀🚀🚀 ~ useDidShow ~ useDidShow:")
      checkStoreIsolation()
    }
    // 标记第一次渲染已完成
    isFirstRender.current = false
    // 防止苹果手机返回不展示弹窗，但是安卓展示多次弹窗
    isFromPhoneCallBack.current = false
  })

  useShareAppMessage(async (res) => {
    const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
    let params = getCurrentPageRouteParams()
    if (VERSION_STANDARD) {
      params = Object.assign(params, { dtid: getCurrentShopId() })
    }
    let path = `/pages/index${isEmpty(params) ? '' : '?' + resolveStringifyParams(params)}`

    console.log('useShareAppMessage path:', path, params)

    return {
      title: title,
      imageUrl: imageUrl,
      path
    }
  })

  useShareTimeline(async (res) => {
    const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
    let params = getCurrentPageRouteParams()
    if (VERSION_STANDARD) {
      params = Object.assign(params, { dtid: getCurrentShopId() })
    }

    console.log('useShareTimeline params:', params)
    return {
      title: title,
      imageUrl: imageUrl,
      query: resolveStringifyParams(params)
    }
  })

  const init = async () => {
    // 非店铺隔离，获取定位
    if (!open_divided) {
      fetchLocation()
    }

    // 非云店
    if (!VERSION_STANDARD) {
      await fetchWgts()
    } else {
      await fetchStoreInfo(location)
    }
  }

  const fetchWgts = async () => {
    const currentRequestId = ++requestIdRef.current

    setState((draft) => {
      draft.wgts = []
      draft.pageData = []
      draft.filterWgts = []
      draft.loading = true
    })
    // 为了店铺隔离模版和店铺信息保持一致
    const distributor_id = open_divided
      ? shopInfo.distributor_id || getDistributorId()
      : getDistributorId()

    try {
      const { config } = await api.shop.getShopTemplate({
        distributor_id: distributor_id
      })
      // 如果这不是最新的请求,直接返回，避免前一次请求影响渲染结果
      if (currentRequestId !== requestIdRef.current) {
        return
      }
      const searchComp = config.find((wgt) => wgt.name == 'search')
      const pageData = config.find((wgt) => wgt.name == 'page')
      let filterWgts = []
      if (searchComp && searchComp.config.fixTop) {
        filterWgts = config.filter((wgt) => wgt.name !== 'search' && wgt.name != 'page')
      } else {
        filterWgts = config.filter((wgt) => wgt.name != 'page')
      }

      const fixedTop = searchComp && searchComp.config.fixTop
      const isShowHomeHeader =
        VERSION_PLATFORM ||
        (openScanQrcode == 1 && isWeixin) ||
        (VERSION_STANDARD && openStore && openLocation == 1) ||
        fixedTop

      setState((draft) => {
        draft.wgts = config
        draft.searchComp = searchComp
        draft.pageData = pageData
        draft.fixedTop = fixedTop
        draft.isShowHomeHeader = isShowHomeHeader
        draft.filterWgts = filterWgts
        draft.loading = false
      })
    } catch (err) {
      if (currentRequestId === requestIdRef.current) {
        // 只处理最新请求的错误
        throw err
      }
    }
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
  const fetchLocation = () => {
    console.log(
      !location && ((VERSION_STANDARD && openLocation == 1) || VERSION_PLATFORM),
      'lllllll1l3'
    )
    if (!location && ((VERSION_STANDARD && openLocation == 1) || VERSION_PLATFORM)) {
      try {
        updateAddress()
        // entryLaunch.isOpenPosition((res) => {
        //   if (res.lat) {
        //     dispatch(updateLocation(res))
        //   }
        // })
      } catch (e) {
        console.error('map location fail:', e)
      }
    }
  }

  const fetchStoreInfo = async (location, showWhiteStore = false) => {
    const distributorId = getDistributorId() || 0
    let params = {
      distributor_id: distributorId // 如果店铺id和经纬度都传会根据哪个去定位传参
    }
    if (openLocation == 1 && location) {
      const { lat, lng } = location
      params.lat = lat
      params.lng = lng
      // params.distributor_id = undefined
    }
    // 非店铺隔离，获取店铺信息
    if (!open_divided) {
      const res = await api.shop.getShop(params)
      dispatch(updateShopInfo(res))
    }
  }

  const checkStoreIsolation = async () => {
    const distributorId = getDistributorId() || 0 // 启动携带店铺id 或者 之前记录的 店铺信息
    const { dtid: routerDtid } = Taro.getStorageSync(SG_ROUTER_PARAMS)
    let defalutShop  // 当前店铺的手机号
    // console.log('🚀🚀🚀 ~ checkStoreIsolation ~ shopInfo:', shopInfo.distributor_id)
    // console.log('🚀🚀🚀 ~ checkStoreIsolation ~ distributorId:', distributorId)
    // 店铺没有改变的情况下，不重复请求。
    if (distributorId != shopInfo.distributor_id) {
      defalutShop = await api.shop.getShop({ distributor_id: routerDtid || 0 })
      dispatch(updateShopInfo(defalutShop))
    }

    if (!S.getAuthToken()) {
      showWhiteLogin()
      return
    }

    if (S.getAuthToken()) {
      if ((shopInWhite && routerDtid == shopInfo.distributor_id) || (!routerDtid && shopInWhite)) {
        console.log('没有改变店铺信息，并且在白名单店铺内，结束店铺隔离逻辑')
        // 在有效店铺，如果店铺没变，直接进店
        // 直接进店铺切换店铺的话，没有 routerDtid，但是也需要直接进店
        return
      }

      /**
       * is_valid 接口逻辑
       * show_type = 'self' && distributor_id=0 && location，返回最近的且开启白名单的店铺
       * show_type = 'self' && distributor_id=0 && !location，返回加入白名单的店铺，如果默认店铺开了白名单并且加入了会员，就返回默认店铺，如果没有返回其他最新店铺
       * show_type = 'self' && distributor_id>0 ，如果有返回店铺信息，表示这个店铺已经有绑定白名单，没有则没有绑定白名单
       * 没有 show_type  && distributor_id=0 && location，返回没有开启白名单的店铺，如果没有，返回默认店铺， white_hidden==1，表示是默认的店铺，不能进店，但是给我店铺信息用来加载模版和手机号
       * 没有 show_type  && distributor_id=0 && !location，同上
       * 没有 show_type && distributor_id>0, 如果这个店铺没有启用，返回默认店铺
       * 没有 show_type && distributor_id>0, 如果这个有启用，返回店铺信息，open_divided判断的是这个店铺是否是白名单的店铺
       */

      if (routerDtid) {
        // 判断店铺是否开启了白名单
        // const reslut = await api.shop.getShop({distributor_id: routerDtid})
        // if (routerDtid == reslut.distributor_id && reslut.open_divided == '0') {
        //   // 该店未开启白名单，直接进店，但是shopInfo 没办法拿到
        //   return
        // }

        // 判断能否进店
        // const shopDetail = await api.shop.getShop({show_type: 'self',distributor_id: routerDtid})
        // if (shopDetail.store_name && shopDetail.white_hidden != 1) {
        //   // 找到店铺了
        //   dispatch(updateShopInfo(shopDetail))
        //   dispatch(changeInWhite(true))
        //   return
        // }

        // checkUserInWhite 取代上面2个接口的作用, 判断能否直接进店
        const { status } = await api.shop.checkUserInWhite({ distributor_id: routerDtid })
        dispatch(changeInWhite(status))
        console.log('🚀🚀🚀 ~ checkStoreIsolation ~ status:', status)
        if (status) {
          return
        }

        // 不能进店，找最新的店铺，必须用这个方法，测试过其他方法会有问题
        const shop = await getWhiteShop() // 已经加入的最优店铺
        console.log('🚀🚀🚀 ~ checkStoreIsolation ~ shop:', shop)

        if (shop) {
          setState((draft) => {
            draft.modalDivided = {
              isShow: true,
              confirmText: '回我的店',
              showCancel: !!(open_divided_templateId || defalutShop?.phone || shopInfo?.phone),
              onCancel: () => {
                connectWhiteShop(defalutShop?.phone || shopInfo?.phone)
                setState((draft) => {
                  draft.modalDivided = {
                    isShow: false
                  }
                })
              },
              onConfirm: async () => {
                // 清空小程序启动时携带的参数
                Taro.setStorageSync(SG_ROUTER_PARAMS, {})
                const res = await api.shop.getShop({ distributor_id: shop.distributor_id })
                dispatch(updateShopInfo(res))
                dispatch(changeInWhite(true))
                setState((draft) => {
                  draft.modalDivided = {
                    isShow: false
                  }
                })
              }
            }
          })
          return
        } else {
          // dispatch(updateShopInfo(shopInfo)) 
          showNoShopModal(defalutShop?.phone || shopInfo?.phone)
        }
      }

      if (!routerDtid) {
        // 没有携带店铺码，直接进店铺，不提示
        // 带self，返回店铺内容store_name => 是绑定的店铺
        const shopDetail = await api.shop.getShop({ show_type: 'self', distributor_id: 0 })

        // 目前的接口无法判断默认店铺是否开启白名单，如果需要加这个判断，需要改接口
        // 现在的逻辑：默认的店铺，没有开启白名单，跳落地页。开启了白名单，可以进

        if (shopDetail.store_name && shopDetail.white_hidden != 1) {
          // 找到店铺了
          dispatch(updateShopInfo(shopDetail))
          dispatch(changeInWhite(true))
          return
        }

        if (open_divided_templateId) {
          const query = `?id=${open_divided_templateId}&fromConnect=1`
          const path = `/pages/custom/custom-page${query}`
          Taro.reLaunch({
            url: path
          })
        } else {
          setState((draft) => {
            draft.modalDivided = {
              isShow: true,
              confirmText: '关闭',
              showCancel: defalutShop?.phone || shopInfo?.phone,
              onCancel: () => {
                phoneCall(defalutShop?.phone || shopInfo?.phone)
                setState((draft) => {
                  draft.modalDivided = {
                    isShow: false
                  }
                })
              },
              onConfirm: async () => {
                setState((draft) => {
                  draft.modalDivided = {
                    isShow: false
                  }
                })
                Taro.exitMiniProgram()
              }
            }
          })
        }
        return
      }
    }
  }

  /***
   * 未注册，开启店铺隔离后需要登录
   *
   *  */
  const showWhiteLogin = async () => {
    if (!open_divided) return
    // 开启了店铺隔离 && 未登录，提示用户登录
    console.log('🚀🚀🚀 ~ showWhiteLogin ~ S.getAuthToken():', S.getAuthToken())
    if (open_divided && !S.getAuthToken()) {
      Taro.showModal({
        content: '你还未登录，请先登录',
        confirmText: '立即登录',
        showCancel: false,
        success: async (res) => {
          if (res.confirm) {
            try {
              await login()
              console.log('login 下面')
            } catch {
              console.log('登录失败，走新用户注册')
              if (loginRef.current && loginRef.current.handleToLogin) {
                loginRef.current.handleToLogin()
              }
            }
          }
        }
      })
    }
  }

  // 关闭隐私协议弹窗
  const onPolicyChange = async (isShow = false) => {
    setState((draft) => {
      draft.policyModal = isShow
    })

    // 如果用户取消隐私协议，仍然需要显示登录提示
    if (!isShow) {
      Taro.showModal({
        content: '你还未登录，请先登录',
        confirmText: '立即登录',
        showCancel: false,
        success: async (res) => {
          if (res.confirm) {
            try {
              await login()
            } catch {
              console.log('登录失败，走新用户注册')
              if (loginRef.current && loginRef.current.handleToLogin) {
                loginRef.current.handleToLogin()
              }
            }
          }
        }
      })
    }
  }

  // 处理隐私协议确认
  const handlePolicyConfirm = async () => {
    // 更新隐私协议同意时间
    updatePolicyTime()
    // 关闭隐私协议弹窗
    setState((draft) => {
      draft.policyModal = false
    })
    // 继续登录流程
    try {
      await login()
    } catch {
      console.log('登录失败，走新用户注册')
      if (loginRef.current && loginRef.current.handleToLogin) {
        loginRef.current.handleToLogin()
      }
    }
  }

  // 没有店铺
  const showNoShopModal = (phone) => {
    setState((draft) => {
      draft.modalDivided = {
        isShow: true,
        confirmText: '关闭',
        showCancel: !!(open_divided_templateId || phone),
        onCancel: () => {
          connectWhiteShop(phone)
          setState((draft) => {
            draft.modalDivided = {
              isShow: false
            }
          })
        },
        onConfirm: async () => {
          Taro.exitMiniProgram()
          setState((draft) => {
            draft.modalDivided = {
              isShow: false
            }
          })
        }
      }
    })
  }

  // 店铺隔离 end

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

  return (
    <SpPage
      className='page-index'
      scrollToTopBtn
      // renderNavigation={renderNavigation()}
      pageConfig={pageData?.base || {}}
      renderFloat={wgts.length > 0 && <CompFloatMenu />}
      renderFooter={<SpTabbar />}
      loading={loading}
      ref={pageRef}
    >
      <ScrollView
        className={classNames('home-body', {
          'has-home-header': isShowHomeHeader && isWeixin
        })}
        scrollY
      >
        {isShowHomeHeader && (
          <WgtHomeHeader>{fixedTop && <SpSearch info={searchComp} />}</WgtHomeHeader>
        )}
        {filterWgts.length > 0 && (
          <WgtsContext.Provider
            value={{
              onAddToCart
            }}
          >
            <HomeWgts wgts={filterWgts} onLoad={fetchLikeList}>
              {/* 猜你喜欢 */}
              <SpRecommend className='recommend-block' info={likeList} />
            </HomeWgts>
          </WgtsContext.Provider>
        )}
      </ScrollView>

      {/* 小程序收藏提示 */}
      {isWeixin && <MCompAddTip />}

      {/* 开屏广告 */}
      {isWeixin && !showAdv && <SpScreenAd />}

      {/* 优惠券包 */}
      {VERSION_STANDARD && <SpCouponPackage />}

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
      {/* 恢复隐私协议弹窗 */}
      <SpPrivacyModal
        open={policyModal}
        onCancel={() => onPolicyChange(false)}
        onConfirm={handlePolicyConfirm}
      />

      {/* 登录组件 */}
      <SpLogin
        ref={loginRef}
        newUser={true}
        onChange={() => {
          // 新注册会员登录成功
          // 登录成功后需要获取店铺信息，然后查看店铺
          checkStoreIsolation()
        }}
        onPolicyClose={() => {
          onPolicyChange(false)
        }}
      ></SpLogin>
      {modalDivided.isShow && (
        <SpModalDivided
          content={modalDivided.content}
          cancelText={modalDivided.cancelText}
          confirmText={modalDivided.confirmText}
          showCancel={modalDivided.showCancel}
          onCancel={modalDivided.onCancel}
          onConfirm={modalDivided.onConfirm}
        />
      )}
    </SpPage>
  )
}

export default Home
