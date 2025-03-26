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
  showToast
} from '@/utils'
import { updateShopInfo } from '@/store/slices/shop'
import { updatePurchaseShareInfo, updateInviteCode } from '@/store/slices/purchase'
import S from '@/spx'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation, useLocation, useModal } from '@/hooks'
import doc from '@/doc'
import { SG_ROUTER_PARAMS } from '@/consts/localstorage'
import HomeWgts from './home/comps/home-wgts'
import { WgtHomeHeader, WgtHomeHeaderShop } from './home/wgts'
import { WgtsContext } from './home/wgts/wgts-context'
import CompAddTip from './home/comps/comp-addtip'
import CompFloatMenu from './home/comps/comp-floatmenu'
import { platformTemplateName } from '@/utils/platform'
import req from '@/api/req'
import qs from 'qs'

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
  whiteShop: 0, // 0 没有白名单店铺 1 有白名单店铺
}

function Home() {
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
      updateAddress()
      fetchStoreInfo(location)
    }
  })
  const { showModal } = useModal()
  const [state, setState] = useImmer(initialState)
  const [likeList, setLikeList] = useImmer([])
  const pageRef = useRef()
  const loginRef = useRef()
  const requestIdRef = useRef(0);

  const { initState, openRecommend, openLocation, openStore, appName, openScanQrcode, open_divided, open_divided_templateId } =
    useSelector((state) => state.sys)
  const { shopInfo } = useSelector((state) => state.shop)

  const showAdv = useSelector((member) => member.user.showAdv)
  const { location, whiteList } = useSelector((state) => state.user)
  const { setNavigationBarTitle } = useNavigation()
  const { findNearestWhiteListShop,findLatestCreatedShop, updateAddress } = useLocation()
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
    whiteShop
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
      let config = {}
      if (open_divided && open_divided_templateId && VERSION_STANDARD && whiteShop === 0) {
        const pathparams = qs.stringify({
          template_name: platformTemplateName,
          version: 'v1.0.1',
          page_name: `custom_${open_divided_templateId}`,
          distributor_id: getDistributorId()
        })
        const url = `/pageparams/setting?${pathparams}`
        
        const { config: dividedConfig } = await req.get(url)
        
        // 如果这不是最新的请求,直接返回
        if (currentRequestId !== requestIdRef.current) {
          return;
        }
        
        config = dividedConfig
      } else {
        const { config: defaultConfig } = await api.shop.getShopTemplate({
          distributor_id: getDistributorId()
        })
        
        // 如果这不是最新的请求,直接返回
        if (currentRequestId !== requestIdRef.current) {
          return;
        }
        
        config = defaultConfig
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
    
    if (open_divided) {
      checkStoreIsolation(params)
    } else {
      res = await api.shop.getShop(params)
      dispatch(updateShopInfo(res))
    }
    // showWhiteLogin()
  }

  const checkStoreIsolation = async () => { 
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
    // 开启了店铺隔离并且登录，获取白名单店铺
    let res, whiteShop
    if (S.getAuthToken()) {
      // updateAddress()
      params.show_type = 'self'
      // 带self，返回店铺内容store_name => 是绑定的店铺
      whiteShop = await api.shop.getShop(params) 
      /**
       * 店铺隔离逻辑
       * is_valid 接口逻辑
       * show_type = 'self' && distributor_id=0 && location，返回最近的且开启白名单的店铺
       * show_type = 'self' && distributor_id=0 && !location，不能返回店铺，因为不知道最近的店铺
       * show_type = 'self' && distributor_id>0 ，如果有返回店铺信息，表示这个店铺已经有绑定白名单，没有则没有绑定白名单
       * 没有 show_type  && distributor_id=0 && location，返回没有开启白名单的店铺
       * 没有 show_type  && distributor_id=0 && !location，返回没有开启白名单的店 或者 不能返回店铺，因为没有location？
       * 
       * 找合适店铺的逻辑
       * 1、开启定位，找最近的
       * 2、没有开启定位，找创建时间最晚的
       * 3、店铺列表没有，表示都没有绑定白名单
       */
      if (!whiteShop.store_name) {
        // 没有找到店铺
        
        if (distributorId) {
          // 有店铺码 但是这个店铺不是在白名单里, 找其他店铺
          const shop = await getWhiteShop() // 已经加入的最优店铺
          if (shop) {
            params.distributor_id = shop.distributor_id
            Taro.showModal({
              content: '抱歉，本店会员才可以访问，如有需要可联系店铺',
              confirmText: '联系店铺',  
              cancelText: '回我的店',
              success: async (res) => {
                if (res.confirm) {
                  Taro.makePhoneCall({
                    phoneNumber: shopInfo.phone
                  })
                }
                if (res.cancel) {
                  // 清空小程序启动时携带的参数
                  Taro.setStorageSync(SG_ROUTER_PARAMS, {})
                  res = await api.shop.getShop(params)
                  dispatch(updateShopInfo(res))
                }
              }
            })

            return
          } else {
            // 找附近未开启白名单的店铺
            delete params.show_type
            delete params.distributor_id
          
            const defalutShop = await api.shop.getShop(params)
            params.distributor_id = shop.distributor_id
            if (defalutShop.store_name) {
              Taro.showModal({
                content: '抱歉，本店会员才可以访问，如有需要可电话联系店铺',
                confirmText: '联系店铺',  
                cancelText: '去其他店',
                success: async (res) => {
                  if (res.confirm) {
                    Taro.makePhoneCall({
                      phoneNumber: shopInfo.phone
                    })
                  }
                  if (res.cancel) {
                    // 清空小程序启动时携带的参数
                    Taro.setStorageSync(SG_ROUTER_PARAMS, {})
                    res = await api.shop.getShop(params)
                    dispatch(updateShopInfo(res))
                  }
                }
              })
              return
            }
            // 没任何绑定的店铺
            Taro.showModal({
              content: '抱歉，本店会员才可以访问，如有需要可电话联系店铺',
              confirmText: '联系店铺',
              cancelText: '关闭',
              success: async (res) => {
                if (res.confirm) {
                  // 联系店铺
                  Taro.makePhoneCall({
                    phoneNumber: shopInfo.phone
                  })
                }

                if (res.cancel) {
                  // 关闭退出小程序
                  Taro.exitMiniProgram()
                }
              }
            })
          }
          return
        }

        if (!distributorId && params.lat) {
          // 已定位

          delete params.show_type
          
          // 未开启白名单的店铺
          const defalutShop = await api.shop.getShop(params)
          if (!defalutShop.store_name) {
            Taro.showModal({
              content: '抱歉，本店会员才可以访问，如有需要可电话联系店铺',
              confirmText: '联系店铺',
              cancelText: '关闭',
              success: async (res) => {
                console.log("🚀🚀🚀 ~ success: ~ res:", res)
                if (res.confirm) {
                  // 联系店铺
                  Taro.makePhoneCall({
                    // phoneNumber: res.phoneNumber todozm 对接接口
                    phoneNumber: shopInfo.phone
                  })
                }

                if (res.cancel) {
                  // 关闭退出小程序
                  Taro.exitMiniProgram()
                }
              }
            })
          } else {
            // 有定位，存在没有开启白名单的店铺
            dispatch(updateShopInfo(defalutShop))
          }
          
          return
        }

        if (!params.lat) {
          // 未定位
          const shop = await getWhiteShop()
          if (!shop) {
            // 未加入店铺
            delete params.show_type
            res = await api.shop.getShop(params)
            if (res.store_name) {
              // 部分门店未开启白名单
              dispatch(updateShopInfo(res))
            } else {
              // 全部开启白名单
              Taro.showModal({
                content: '抱歉，本店会员才可以访问，如有需要可电话联系店铺',
                confirmText: '联系店铺',
                cancelText: '关闭',
                success: async (res) => {
                  if (res.confirm) {
                    Taro.makePhoneCall({
                      phoneNumber: shopInfo.phone
                    })
                  }
  
                  if (res.cancel) {
                    // 关闭退出小程序
                    Taro.exitMiniProgram()
                  }
                }
              })
            }
            return
          } else {
            // 加入最近时间的店铺
            params.distributor_id = shop.distributor_id
            res = await api.shop.getShop(params)
            dispatch(updateShopInfo(res))
          }
        }
      } else {
        // 找到店铺了
        setState((draft) => {
          draft.whiteShop = 1
        });
        dispatch(updateShopInfo(whiteShop))
      }
    } else {
      // 店铺隔离未登录，先用默认店铺，进行登录弹窗的展示, 这个拿到的应该是没开启白名单的店铺 todozm，应该要改成后台的模版id
      res = await api.shop.getShop(params)
      dispatch(updateShopInfo(res))
      showWhiteLogin()
    }
  }


  const getWhiteShop = async () => {
    // 获取用户已经加入的白名单店铺，筛选合适的店铺
    const shopList = await fetchShop()
    // 找到最近的白名单店铺
    if (location) {
      const nearestShop = findNearestWhiteListShop(shopList, location);
      if (nearestShop) {
        setState((draft) => {
          draft.whiteShop = 1
        });
        // 使用最近的白名单店铺信息
        return nearestShop;
      }
    } else {
      // 找到创建时间最晚的白名单店铺
      const latestShop = findLatestCreatedShop(shopList);
      if (latestShop) {
        setState((draft) => {
          draft.whiteShop =1
        });
      }
      return latestShop;
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
    // 未登录，未开启定位，进入默认店铺，需要弹窗提示用户登录
    // if (open_divided == 1 && whiteList.length == 0) {
    //   showToast('店铺未开启白名单，请联系管理员开通')
    // }
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


  // 获取店铺列表，主要用于查找白名单店铺
  const fetchShop = async () => {
    let params = {
      page: 1,
      pageSize: 50,
      type: 0,           // 店铺类型，0表示所有类型
      search_type: 2,    // 1=搜索商品；2=搜索门店
      sort_type: 1,      // 排序方式
      show_type: 'self'  // 'self'表示只获取白名单店铺
    }

    console.log(`fetchShop query: ${JSON.stringify(params)}`)
    
    // 调用店铺列表API
    const { 
      list,              // 店铺列表
      total_count: total,// 总数
      defualt_address,   // 默认地址
      is_recommend       // 是否推荐
    } = await api.shop.list(params)

    // 使用 pickBy 函数按照 doc.shop.SHOP_ITEM 的格式处理店铺数据
    const shopList = pickBy(list, doc.shop.SHOP_ITEM)

    console.log("🚀🚀🚀 ~ fetchShop ~ list:", shopList)
    return shopList
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
          updateAddress()
          console.log("🚀🚀🚀 ~ onChange: ~ location:", location)
          fetchStoreInfo(location,true)
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
