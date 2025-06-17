import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useDidShow
} from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import qs from 'qs'
import S from '@/spx'
import { View } from '@tarojs/components'
import {
  SpPage,
  SpSearch,
  SpSkuSelect,
  SpTabbar,
  SpPrivacyModal,
  SpLogin,
  SpModalDivided
} from '@/components'
import { WgtsContext } from '@/pages/home/wgts/wgts-context'
import { getDistributorId, log, entryLaunch, pickBy, showToast, VERSION_STANDARD } from '@/utils'
import { platformTemplateName, transformPlatformUrl } from '@/utils/platform'
import { useLogin, useNavigation, useLocation, useModal, useWhiteShop } from '@/hooks'
import { SG_ROUTER_PARAMS } from '@/consts/localstorage'
import req from '@/api/req'
import HomeWgts from '@/pages/home/comps/home-wgts'
import { updateShopInfo, changeInWhite } from '@/store/slices/shop'
import './custom-page.scss'

const initialState = {
  wgts: [],
  loading: true,
  shareInfo: null,
  info: null,
  skuPanelOpen: false,
  selectType: 'picker',
  isShowTabBar: false,
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
function CustomPage(props) {
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
  const [state, setState] = useImmer(initialState)
  const { setNavigationBarTitle } = useNavigation()
  const {
    wgts,
    loading,
    shareInfo,
    skuPanelOpen,
    selectType,
    info,
    isShowTabBar,
    policyModal,
    modalDivided
  } = state
  const MSpSkuSelect = React.memo(SpSkuSelect)
  const pageRef = useRef()
  const loginRef = useRef()
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
  const { location } = useSelector((state) => state.user)
  const { updateAddress } = useLocation()
  const dispatch = useDispatch()
  const { getWhiteShop, connectWhiteShop } = useWhiteShop({
    onPhoneCallComplete: () => {
      isFromPhoneCallBack.current = true
      checkStoreIsolation()
    }
  })
  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    if (shopInfo && VERSION_STANDARD) {
      // 比较当前店铺ID与上一次的是否相同
      const currentShopId = shopInfo.distributor_id
      if (currentShopId != prevShopIdRef.current) {
        fetch()
        prevShopIdRef.current = currentShopId
      }
    }
  }, [shopInfo])

  useEffect(() => {
    if (open_divided) {
      // fetchLocation()
      // console.log("🚀🚀🚀 ~ useEffect ~ useEffect:")
      checkStoreIsolation()
    }
  }, [open_divided])

  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])

  // 需要在页面返回到首页的时候执行，第一次页面渲染的时候不执行
  useDidShow(() => {
    if (
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

    let path = `/pages/custom/custom-page${query}`
    if (open_divided) {
      path += `&tdid=${getDistributorId() || 0}`
    }
    log.debug(`getAppShareInfo: ${path}`)
    return {
      title: shareInfo.page_share_title,
      imageUrl: shareInfo.page_share_imageUrl,
      path
    }
  }

  // 店铺隔离
  // const fetchLocation = () => {
  //   if (!location && (VERSION_STANDARD && openLocation == 1 && open_divided )) {
  //     try {
  //       updateAddress()
  //       // entryLaunch.isOpenPosition((res) => {
  //       //   if (res.lat) {
  //       //     dispatch(updateLocation(res))
  //       //   }
  //       // })
  //     } catch (e) {
  //       console.error('map location fail:', e)
  //     }
  //   }
  // }

  const checkStoreIsolation = async () => {
    if(!open_divided) {
      return
    }
    const { fromConnect } = await entryLaunch.getRouteParams($instance.router.params)
    if (fromConnect) return // 店铺隔离引导页
    const distributorId = getDistributorId() || 0
    // const { dtid: distributorId } = Taro.getStorageSync(SG_ROUTER_PARAMS)
    // console.log("🚀🚀🚀 ~ checkStoreIsolation ~ 分享进来的 dtid:", dtid)
    let params = {
      distributor_id: distributorId // 如果店铺id和经纬度都传会根据哪个去定位传参
    }
    // console.log("🚀🚀🚀 ~ checkStoreIsolation ~ location:", location)
    // 开启了店铺隔离并且登录，获取白名单店铺
    let defalutShop
    // 渲染默认的模版和联系店铺的手机号

    // 有带id，就用带id的店铺的模版和手机号
    // 没有带id，在后面的逻辑内，用默认店铺的模版和手机号
    // 2种情况 用默认店铺渲染背景和电话
    // 1、存在于页面有路由参数店铺ID的情况，且和店铺信息不一致，
    // 2、没有shopInfo
    if (distributorId != shopInfo.distributor_id) {
      defalutShop = await api.shop.getShop(params)
      dispatch(updateShopInfo(defalutShop))
    }

    if (!S.getAuthToken()) {
      showWhiteLogin()
      return
    }

    if (S.getAuthToken()) {
      // if ((shopInWhite && routerDtid == shopInfo.distributor_id) || (!routerDtid && shopInWhite)) {
      //   console.log('没有改变店铺信息，并且在白名单店铺内，结束店铺隔离逻辑')
      //   // 在有效店铺，如果店铺没变，直接进店
      //   // 直接进店铺切换店铺的话，没有 routerDtid，但是也需要直接进店
      //   return
      // }

      if (distributorId) {
        // checkUserInWhite 取代上面2个接口的作用, 判断能否直接进店
        const { status } = await api.shop.checkUserInWhite({ distributor_id: distributorId })
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

      if (!distributorId) {
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
      immersive={pageData?.base?.isImmersive}
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

      {/* 隐私协议弹窗 */}
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

CustomPage.options = {
  addGlobalClass: true
}

export default CustomPage
