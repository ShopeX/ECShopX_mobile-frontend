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
  SpLogin
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
import { updatePurchaseShareInfo, updateInviteCode } from '@/store/slices/purchase'
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
}

function Home() {
  const $instance = getCurrentInstance()
  const { isLogin, checkPolicyChange, isNewUser, updatePolicyTime, setToken, login } = useLogin({
    autoLogin: false,
    // 隐私协议变更
    policyUpdateHook: (isUpdate) => {

      console.log("🚀🚀🚀 ~ Home ~ policyUpdateHook:")

      isUpdate && onPolicyChange(true)
    },
    // // 登录成功后获取店铺信息
    loginSuccess: () => {
      // 老用户登录成功
      console.log("🚀🚀🚀 ~ Home ~ loginSuccess:")
      // 登录成功后获取店铺信息
      checkStoreIsolation()
    }
  })
  const { showModal } = useModal()
  const [state, setState] = useImmer(initialState)
  const [likeList, setLikeList] = useImmer([])
  const pageRef = useRef()
  const loginRef = useRef()
  const requestIdRef = useRef(0);
  const isFirstRender = useRef(true);

  const { initState, openRecommend, openLocation, openStore, appName, openScanQrcode, open_divided, open_divided_templateId } =
    useSelector((state) => state.sys)
  const { shopInfo, shopInWhite } = useSelector((state) => state.shop)

  const showAdv = useSelector((member) => member.user.showAdv)
  const { location } = useSelector((state) => state.user)
  const { setNavigationBarTitle } = useNavigation()
  const { updateAddress } = useLocation()
  const { getWhiteShop, showNoShopModal, connectWhiteShop } = useWhiteShop({
    onPhoneCallComplete: () => {
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
  } = state

  const dispatch = useDispatch()

  useEffect(() => {
    if (initState) {
      init()
      setNavigationBarTitle(appName)
    }
  }, [initState])

  useEffect(() => {
    dispatch(updatePurchaseShareInfo())
    dispatch(updateInviteCode())
  }, [])

  useEffect( () => {
    
    if (shopInfo && VERSION_STANDARD) {
      console.log("🚀🚀🚀 ~ Home ~ shopInfo useEffect:", shopInfo)
      fetchWgts()
    }
  }, [shopInfo])

  useEffect(() => {
    if (location && VERSION_STANDARD) {
      console.log("🚀🚀🚀 ~ Home ~ location useEffect:")
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
      checkStoreIsolation();
    }
  }, [open_divided]);
  
  // 需要在页面返回到首页的时候执行，第一次页面渲染的时候不执行
  useDidShow(() => {
    if (VERSION_STANDARD && open_divided && !isFirstRender.current) {
      // console.log("🚀🚀🚀 ~ useDidShow ~ useDidShow:")
      checkStoreIsolation()
    }
    // 标记第一次渲染已完成
    isFirstRender.current = false;
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
    //如果存在定位就不再重新定位了
    // if (location === null || Object.keys(location).length === 0) {
    fetchLocation()
    // }

    // 非云店
    if (!VERSION_STANDARD) {
      await fetchWgts()
    } else {
      await fetchStoreInfo(location)
    }
  }

  const fetchWgts = async () => {
    const currentRequestId = ++requestIdRef.current;
    
    setState((draft) => {
      draft.wgts = []
      draft.pageData = []
      draft.filterWgts = []
      draft.loading = true
    })

    try {
      const { config } = await api.shop.getShopTemplate({
        distributor_id: getDistributorId()
      })
      
      // 如果这不是最新的请求,直接返回，避免前一次请求影响渲染结果
      if (currentRequestId !== requestIdRef.current) {
        return;
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
        throw err;
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
    console.log(!location && ((VERSION_STANDARD && openLocation == 1) || VERSION_PLATFORM), 'lllllll1l3')
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
      distributor_id: distributorId// 如果店铺id和经纬度都传会根据哪个去定位传参
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
    console.log("🚀🚀🚀 ~ useDidShow ~ checkStoreIsolation:")
    const distributorId = getDistributorId() || 0
    // console.log("🚀🚀🚀 ~ checkStoreIsolation ~ 分享进来的 dtid:", dtid)
    let params = {
      distributor_id: distributorId// 如果店铺id和经纬度都传会根据哪个去定位传参
    }
    // console.log("🚀🚀🚀 ~ checkStoreIsolation ~ location:", location)
    if (openLocation == 1 && location) {
      const { lat, lng } = location
      params.lat = lat
      params.lng = lng
      // params.distributor_id = undefined
    }
    // 开启了店铺隔离并且登录，获取白名单店铺
    let res, shopDetail
    // 渲染默认的模版和联系店铺的手机号

    // 有带id，就用带id的店铺的模版和手机号
    // 没有带id，在后面的逻辑内，用默认店铺的模版和手机号
    if (distributorId) {
      res = await api.shop.getShop(params)
      dispatch(updateShopInfo(res))
    }

    if (!S.getAuthToken()) { 
      showWhiteLogin()
      return
    }

    if (S.getAuthToken()) {
      // updateAddress()
      params.show_type = 'self'
      // 带self，返回店铺内容store_name => 是绑定的店铺
      shopDetail = await api.shop.getShop(params)
      /**
       * 店铺隔离逻辑
       * is_valid 接口逻辑
       * show_type = 'self' && distributor_id=0 && location，返回最近的且开启白名单的店铺
       * show_type = 'self' && distributor_id=0 && !location，返回默认店铺，是否是白名单店铺？？这个有改掉了，和后端确认中
       * show_type = 'self' && distributor_id>0 ，如果有返回店铺信息，表示这个店铺已经有绑定白名单，没有则没有绑定白名单
       * 没有 show_type  && distributor_id=0 && location，返回没有开启白名单的店铺，如果没有，返回默认店铺， white_hidden==1，表示是默认的店铺，不能进店，但是给我店铺信息用来加载模版和手机号
       * 没有 show_type  && distributor_id=0 && !location，返回没有开启白名单的店，如果没有，返回默认店铺， white_hidden==1，表示是默认的店铺，不能进店，但是给我店铺信息用来加载模版和手机号
       * 没有 show_type && distributor_id>0, 如果这个店铺没有启用，返回默认店铺
       * 没有 show_type && distributor_id>0, 如果这个有启用，返回的是这个店铺是否是白名单的店铺
       * 
       * 找合适店铺的逻辑
       * 1、找最近开启白名单的店铺 
       * 2、没有找到，从所有开启白名单店铺里的找，
       *    2.1 开启定位，找最近的
       *    2.2 没有开启定位，找创建时间最晚的
       * 3、还没找到，找没开启白名单的店铺
       * 4、都没有找到，就用默认的店铺渲染电话和模版
       * 
       * 返回 white_hidden ==1  说明是默认店铺 ，不进店，但是需要取店铺信息作为模版背景和手机号
       * 
       */

      if (shopDetail.store_name && shopDetail.white_hidden != 1) { 
        // 找到店铺了
        dispatch(updateShopInfo(shopDetail))
        dispatch(changeInWhite(true))
        return
      }

      if (!shopDetail.store_name || defalutShop.white_hidden == 1) {
        // 没有找到店铺
        if (distributorId) {
          // 有店铺码 但是这个店铺不是在白名单里, 找其他店铺
          const shop = await getWhiteShop() // 已经加入的最优店铺
          if (shop) {
            if (shop.distributor_id == shopInfo.distributor_id) {
              // 从其他页面返回到首页的时候,已经在当前店铺了
              return
            }
            params.distributor_id = shop.distributor_id
            Taro.showModal({
              content: '抱歉，本店会员才可以访问，如有需要可联系店铺',
              confirmText: '回我的店',
              cancelText: '联系店铺',
              showCancel: !!(open_divided_templateId || shopInfo?.phone),
              success: async (res) => {
                if (res.cancel) {
                  connectWhiteShop(shopInfo?.phone)
                }
                if (res.confirm) {
                  console.log("🚀🚀🚀 ~ res.cancel ~ res.cancel:")
                  // 清空小程序启动时携带的参数
                  Taro.setStorageSync(SG_ROUTER_PARAMS, {})
                  res = await api.shop.getShop(params)
                  dispatch(updateShopInfo(res))
                  dispatch(changeInWhite(true))
                }
              }
            })

            return
          } else {
            // 找附近未开启白名单的店铺
            delete params.show_type
            params.distributor_id = 0
            const defalutShop = await api.shop.getShop(params)
            // console.log("🚀🚀🚀 ~ checkStoreIsolation ~ defalutShop:", defalutShop)
            if(defalutShop.white_hidden == 1) {
              // 没匹配到任何店铺，带有id还是用之前的店铺模版和电话
              // dispatch(updateShopInfo(defalutShop))
              showNoShopModal(shopInfo?.phone)
              return
            } else {
              if (defalutShop.distributor_id == shopInfo.distributor_id) {
                // 从其他页面返回到首页的时候,已经在当前店铺了
                return
              }
              // 部分门店未开启白名单
              Taro.showModal({
                content: '抱歉，本店会员才可以访问，如有需要可电话联系店铺',
                confirmText: '去其他店',
                cancelText: '联系店铺',
                showCancel: !!(open_divided_templateId || shopInfo?.phone),
                success: async (res) => {
                  if (res.cancel) {
                    connectWhiteShop(shopInfo?.phone)
                  }
                  if (res.confirm) {
                    // 清空小程序启动时携带的参数
                    Taro.setStorageSync(SG_ROUTER_PARAMS, {})
                    // res = await api.shop.getShop(params)
                    dispatch(updateShopInfo(defalutShop))
                    dispatch(changeInWhite(true))
                  }
                }
              })
              return
            }
          }
        }

        if (!distributorId) {
          // 已定位
          if (params.lat) {
            delete params.show_type
          
            // 未开启白名单的店铺
            const defalutShop = await api.shop.getShop(params)
            if (defalutShop.white_hidden == 1) {
              dispatch(updateShopInfo(defalutShop))
              showNoShopModal(defalutShop.phone)
            } else {
              // 有定位，存在没有开启白名单的店铺
              dispatch(updateShopInfo(defalutShop))
              dispatch(changeInWhite(true))
            }
            
            return
          }

          // 未定位
          if (!params.lat) {
            const shop = await getWhiteShop()
            if (!shop) {
              // 未加入店铺
              delete params.show_type
              res = await api.shop.getShop(params)
              if (res.white_hidden == 1) {
                // 全部开启白名单
                dispatch(updateShopInfo(res))
                showNoShopModal(res.phone)
              } else {
                // 有部分门店未开启白名单
                dispatch(updateShopInfo(res))
                dispatch(changeInWhite(true))
                return
              }
              return
            } else {
              // 加入最近时间的店铺
              params.distributor_id = shop.distributor_id
              res = await api.shop.getShop(params)
              dispatch(updateShopInfo(res))
              dispatch(changeInWhite(true))
            }
          }
        }
      }
    }
  }

  /***
   * 未注册，开启店铺隔离后需要登录
   * 
   *  */ 
  const showWhiteLogin = async () => {
    if(!open_divided) return
    // 开启了店铺隔离 && 未登录，提示用户登录
    console.log("🚀🚀🚀 ~ showWhiteLogin ~ S.getAuthToken():", S.getAuthToken())

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
                console.log("登录失败，走新用户注册")
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
  const onPolicyChange = async(isShow = false) => {
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
              console.log("登录失败，走新用户注册")
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
      console.log("登录失败，走新用户注册")
      if (loginRef.current && loginRef.current.handleToLogin) {
        loginRef.current.handleToLogin()
      }
    }
  }

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
      >
      </SpLogin>

    </SpPage>
  )
}

export default Home
