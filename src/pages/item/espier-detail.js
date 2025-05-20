import React, { useEffect, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useDidShow
} from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Video, ScrollView } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AtCountdown } from 'taro-ui'
import {
  SpPrice,
  SpCell,
  SpImage,
  SpLoading,
  SpRecommend,
  SpHtml,
  SpPage,
  SpSkuSelect,
  SpPoster,
  SpLogin,
  SpFloatMenuItem,
  SpChat,
  SpGoodsPrice,
  SpPrivacyModal,
  SpModalDivided
} from '@/components'
import api from '@/api'
import req from '@/api/req'
import {
  log,
  calcTimer,
  isArray,
  canvasExp,
  normalizeQuerys,
  isAlipay,
  isWeixin,
  isWeb,
  linkPage,
  pickBy,
  classNames,
  navigateTo,
  VERSION_PLATFORM,
  isAPP,
  showToast,
  getDistributorId,
  VERSION_STANDARD
} from '@/utils'
import { fetchUserFavs } from '@/store/slices/user'

import doc from '@/doc'
import entryLaunch from '@/utils/entryLaunch'
import qs from 'qs'
import S from '@/spx'
import { Tracker } from '@/service'
import { useNavigation, useLogin, useLocation, useWhiteShop } from '@/hooks'
import { ACTIVITY_LIST } from '@/consts'
import { SG_ROUTER_PARAMS } from '@/consts/localstorage'
import CompActivityBar from './comps/comp-activitybar'
import CompVipGuide from './comps/comp-vipguide'
import CompCouponList from './comps/comp-couponlist'
import CompStore from './comps/comp-store'
import CompPackageList from './comps/comp-packagelist'
import CompEvaluation from './comps/comp-evaluation'
import CompBuytoolbar from './comps/comp-buytoolbar'
import CompShare from './comps/comp-share'
import CompPromation from './comps/comp-promation'
import CompGroup from './comps/comp-group'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading, WgtHeadline } from '../home/wgts'
import { updateShopInfo, changeInWhite } from '@/store/slices/shop'
import './espier-detail.scss'

const MSpSkuSelect = React.memo(SpSkuSelect)

const initialState = {
  id: null,
  type: null,
  dtid: null,
  info: null,
  curImgIdx: 0,
  play: false,
  isDefault: false,
  defaultMsg: '',
  promotionPackage: [], // 组合优惠
  mainGoods: {},
  makeUpGoods: [], // 组合商品
  packageOpen: false,
  skuPanelOpen: false,
  promotionOpen: false,
  promotionActivity: [],
  sharePanelOpen: false,
  posterModalOpen: false,
  skuText: '',
  // sku选择器类型
  selectType: 'picker',
  evaluationList: [],
  evaluationTotal: 0,
  // 多规格商品选中的规格
  curItem: null,
  recommendList: [],
  policyModal: false, // 添加隐私协议弹窗状态  todozm 如果商品是已下架状态，隐私无法展示
  modalDivided: {
    isShow: false,
    content: '',
    confirmText: '',
    showCancel: true,
    onCancel: null,
    onConfirm: null
  }
}

function EspierDetail(props) {
  const $instance = getCurrentInstance()
  // const { type, id, dtid } = $instance.router.params
  // const { type, id, dtid } = await entryLaunch.getRouteParams()
  const { getUserInfoAuth } = useLogin()
  const pageRef = useRef()
  const isFromPhoneCallBack = useRef(false);     // 防止苹果手机返回不展示弹窗，但是安卓展示多次弹窗

  const { userInfo } = useSelector((state) => state.user)
  const { colorPrimary, openRecommend, open_divided, openLocation, open_divided_templateId } = useSelector((state) => state.sys)
  const { shopInWhite, shopInfo } = useSelector((state) => state.shop)
  const { getWhiteShop, connectWhiteShop } = useWhiteShop({
    onPhoneCallComplete: () => {
      isFromPhoneCallBack.current = true
      checkStoreIsolation()
    }
  })
  const { setNavigationBarTitle } = useNavigation()
  const dispatch = useDispatch()
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
      checkStoreIsolation()
    }
  })
  const { updateAddress } = useLocation()

  const loginRef = useRef()

  const [state, setState] = useImmer(initialState)
  const {
    info,
    play,
    isDefault,
    defaultMsg,
    evaluationList,
    curImgIdx,
    promotionPackage,
    packageOpen,
    skuPanelOpen,
    promotionOpen,
    promotionActivity,
    sharePanelOpen,
    posterModalOpen,
    mainGoods,
    makeUpGoods,
    skuText,
    selectType,
    id,
    type,
    dtid,
    curItem,
    recommendList,
    policyModal,
    modalDivided
  } = state

  // 添加一个 ref 来追踪是否是首次渲染
  const isFirstRender = useRef(true)

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (open_divided) {
      checkStoreIsolation()
    }
  }, [open_divided])

  useEffect(() => {
    const { path } = $instance.router
    if (id && path === '/pages/item/espier-detail') {
      fetch()
    }
    salesmanShare()
  }, [userInfo])

  useEffect(() => {
    if (id) {
      fetch()
      getPackageList()
      getEvaluationList()
    }
  }, [id])

  useEffect(() => {
    let video
    if (isWeixin) {
      video = Taro.createVideoContext('goods-video')
    } else if (isWeb) {
      video = document.getElementById('goods-video')
    }

    if (!video) {
      return
    }

    if (play) {
      setTimeout(() => {
        console.log('video:', video)
        video.play()
      }, 200)
    } else {
      isWeixin ? video.stop() : video.pause()
    }
  }, [play])

  useEffect(() => {
    if (packageOpen || skuPanelOpen || sharePanelOpen || posterModalOpen || promotionOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [packageOpen, skuPanelOpen, sharePanelOpen, posterModalOpen, promotionOpen])

  // 添加一个新的 useEffect 来监听 dtid 变化
  useEffect(() => {
    if (dtid) {
      console.log("🚀🚀🚀 ~ useEffect ~ dtid:", dtid)
      fetch()
    }
  }, [dtid])

  // 修改监听 shopInfo 的 useEffect
  useEffect(() => {
    if (!VERSION_STANDARD && !open_divided) {
      return
    }
    // 跳过首次渲染时的 shopInfo
    if (isFirstRender.current) {
      return
    }

    if (shopInfo?.distributor_id) {
      setState((draft) => {
        draft.dtid = shopInfo.distributor_id
      })
    }
  }, [shopInfo])


  // 需要在页面返回到首页的时候执行，第一次页面渲染的时候不执行
  useDidShow(() => {
    if (VERSION_STANDARD && open_divided && !isFirstRender.current && !isFromPhoneCallBack.current) {
      checkStoreIsolation()
    }
    // 标记第一次渲染已完成
    isFirstRender.current = false;
    isFromPhoneCallBack.current = false
  })

  useShareAppMessage(async (res) => {
    return getAppShareInfo()
  })

  useShareTimeline(async (res) => {
    return getAppShareInfo()
  })

  const salesmanShare = async () => {
    let params = $instance.router.params
    if (params?.qr == 'Y') {
      let param = {
        promoter_user_id: params?.uid,
        promoter_shop_id: params?.dtid,
        promoter_item_id: params?.id
      }
      await api.salesman.salespersonBindusersalesperson(param)
      Taro.setStorageSync('salesmanUserinfo', param)
      console.log(param, '分享成功，业务员已存储1')
    }
  }

  const getAppShareInfo = () => {
    const { itemName, imgs } = info
    const query = {
      id,
      dtid
    }
    if (userInfo) {
      query['uid'] = userInfo.user_id
    }
    const path = `/pages/item/espier-detail?${qs.stringify(query)}`
    log.debug(`share path: ${path}`)
    return {
      title: itemName,
      imageUrl: imgs.length > 0 ? imgs[0] : [],
      path
    }
  }

  const init = async () => {
    const { type, id, dtid } = await entryLaunch.getRouteParams()
    setState((draft) => {
      draft.id = id
      draft.type = type
      draft.dtid = dtid
    })
    if (S.getAuthToken()) {
      await dispatch(fetchUserFavs())
    }
  }


  // 店铺隔离start
  const checkStoreIsolation = async () => {
    const distributorId = getDistributorId() || 0
    const { dtid: routerDtid } = Taro.getStorageSync(SG_ROUTER_PARAMS)
    // let params = {
    //   distributor_id: distributorId
    // }
    // 开启了店铺隔离并且登录，获取白名单店铺
    // let res, distributorPhone;
    // 渲染路由携带的店铺id的手机号
    let defalutShop
    if (distributorId != shopInfo.distributor_id) {
      defalutShop = await api.shop.getShop({ distributor_id: distributorId })
      dispatch(updateShopInfo(defalutShop))
    }
    // if (distributorId) {
    //   res = await api.shop.getShop(params)
    //   distributorPhone = res.phone
    // }

    if (!S.getAuthToken()) {
      showWhiteLogin()
      return
    }

    if (S.getAuthToken()) {
      // updateAddress()
      // 分享带有tdid访问，每次都应该判断提示 要切换店铺，但是如果分享的tdid是没开启店铺隔离的店，那么应该可以进店才对。
      // 除非之前已经在白名单的店铺里了
      // 如果分享的店铺id不是现在的店铺id，
      // if ((shopInWhite && routerDtid == shopInfo.distributor_id) || (!routerDtid && shopInWhite)) {
      //   // 在有效店铺，如果店铺没变，直接进店
      //   // 直接进店铺切换店铺的话，没有 routerDtid，但是也需要直接进店
      //   return
      // }

      // 分享带有tdid访问，每次都应该判断提示
      // if (routerDtid && (shopInWhite && routerDtid != shopInfo.distributor_id)) {
      //   // 虽然是在有效店铺，如果店铺变化，判断是否可以进店, 
      //   // 可能是没开启白名单的店铺，直接进店，如果继续走下面的逻辑，会提示回我的店的问题
      //   const { status } = await api.shop.checkUserInWhite({ distributor_id: routerDtid })
      //   dispatch(changeInWhite(status))
      //   if (status) {
      //     return
      //   }
      // }

      // params.show_type = 'self'
      // // 带self，返回店铺内容store_name => 是绑定的店铺
      // const shopDetail = await api.shop.getShop(params)
      // console.log("🚀🚀🚀 ~ checkStoreIsolation ~ shopDetail:", shopDetail)

      // if (shopDetail.store_name && shopDetail.white_hidden != 1) {
      //   // 找到店铺了
      //   dispatch(updateShopInfo(shopDetail))
      //   dispatch(changeInWhite(true))
      //   return
      // }

      // if (!shopDetail.store_name || defalutShop.white_hidden == 1) {
      // 没有找到店铺

      if (distributorId) {
        const { status } = await api.shop.checkUserInWhite({ distributor_id: distributorId })
        dispatch(changeInWhite(status))
        console.log('🚀🚀🚀 ~ checkStoreIsolation ~ status:', status)
        if (status) {
          return
        }
        // 有店铺码 这个码一定是商品页的路由参数店铺ID） 但是这个店铺不是在白名单里, 找其他店铺
        const shop = await getWhiteShop() // 已经加入的最优店铺
        if (shop) {
          // todozm 下面这个不懂，应该可以用新逻辑
          // if (!routerDtid && shop.distributor_id == shopInfo.distributor_id) {
          //   // 必须有，重新渲染商品信息
          //   Taro.setStorageSync(SG_ROUTER_PARAMS, {})
          //   dispatch(updateShopInfo(shopInfo))
          //   dispatch(changeInWhite(true))
          //   return
          // }
          // params.distributor_id = shop.distributor_id

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
          showNoShopModal(defalutShop?.phone || shopInfo?.phone)
        }
      }

      if (!distributorId) {
        // 没有携带店铺码，直接进店铺，不提示
        // 带self，返回店铺内容store_name => 是绑定的店铺
        const shopDetail = await api.shop.getShop({ show_type: 'self', distributor_id: 0 })

        // 目前的接口无法判断默认店铺是否开启白名单，如果需要加这个判断，需要改接口
        // 现在的逻辑：默认的店铺，没有开启白名单，跳落地页。开启了白名单，可以进
        // 如果带有店铺id进店，店铺没开白名单，才是进店铺
        // 如果携带了店铺id，进店，只有默认店铺是白名单店，并且开启了白名单，是可以进默认店的

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
      // } 
    }
  }

  /***
   * 未注册，开启店铺隔离后需要登录
   * 
   *  */
  const showWhiteLogin = async () => {
    if (!open_divided) return
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


  // 店铺隔离end

  const fetch = async () => {
    let data
    if (type == 'pointitem') {
    } else {
      try {
        console.log("🚀🚀🚀 ~ fetch ~ dtid:", dtid)

        const itemDetail = await api.item.detail(id, {
          showError: false,
          distributor_id: dtid
        })
        data = pickBy(itemDetail, doc.goods.ESPIER_DETAIL_GOODS_INFO)
        if (data.approveStatus == 'instock') {
          setState((draft) => {
            draft.isDefault = true
            draft.defaultMsg = '商品已下架'
          })
        }
      } catch (e) {
        setState((draft) => {
          draft.isDefault = true
          draft.defaultMsg = e.res.data.data.message
        })
        console.log(e.res)
      }
    }

    // 是否订阅
    const { user_id: subscribe = false } = await api.user.isSubscribeGoods(id, { distributor_id: dtid })

    setNavigationBarTitle(data.itemName)

    console.log(ACTIVITY_LIST[data.activityType])
    if (ACTIVITY_LIST[data.activityType]) {
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: colorPrimary,
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
    setState((draft) => {
      draft.info = {
        ...data,
        subscribe
      }
      draft.promotionActivity = data.promotionActivity
    })

    if (isAPP() && userInfo) {
      try {
        Taro.SAPPShare.init({
          title: data.itemName,
          content: data.brief,
          pic: `${data.img}?time=${new Date().getTime()}`,
          link: `${process.env.APP_CUSTOM_SERVER}/pages/item/espier-detail?id=${data.itemId}&dtid=${data.distributorId}&company_id=${data.companyId}`,
          path: `/pages/item/espier-detail?company_id=${data.company_id}&id=${data.v}&dtid=${data.distributor_id}&uid=${userInfo.user_id}`,
          price: data.price,
          weibo: false,
          miniApp: true
        })
        log.debug('app share init success...')
      } catch (e) {
        console.error(e)
      }
    }

    if (openRecommend == 1) {
      getRecommendList() // 猜你喜欢
    }
  }

  const getRecommendList = async () => {
    const { list } = await api.cart.likeList({
      page: 1,
      pageSize: 30
    })
    setState((draft) => {
      draft.recommendList = list
    })
  }

  // 获取包裹
  const getPackageList = async () => {
    const { list } = await api.item.packageList({ item_id: id, showError: false })
    setState((draft) => {
      draft.promotionPackage = list
    })
  }

  // 获取评论
  const getEvaluationList = async () => {
    const { list, total_count } = await api.item.evaluationList({
      page: 1,
      pageSize: 2,
      item_id: id
    })
    setState((draft) => {
      draft.evaluationList = list
      draft.evaluationTotal = total_count
    })
  }

  // 领券
  const handleReceiveCoupon = () => {
    const { itemId, distributorId } = info
    Taro.navigateTo({
      url: `/subpages/marketing/coupon-center?item_id=${itemId}&distributor_id=${distributorId}`
    })
  }

  const onChangeSwiper = (e) => {
    setState((draft) => {
      draft.curImgIdx = e.detail.current
    })
  }

  const onChangeToolBar = (key) => {
    setState((draft) => {
      draft.skuPanelOpen = true
      draft.selectType = key
    })
  }

  const { windowWidth } = Taro.getSystemInfoSync()

  let sessionFrom = {}
  if (info) {
    sessionFrom['商品'] = info.itemName
    if (userInfo) {
      sessionFrom['昵称'] = userInfo.username
    }
  }

  return (
    <SpPage
      className='page-item-espierdetail'
      scrollToTopBtn
      isDefault={isDefault}
      defaultMsg={defaultMsg}
      ref={pageRef}
      renderFloat={
        <View>
          <SpFloatMenuItem
            onClick={() => {
              Taro.navigateTo({ url: '/subpages/member/index' })
            }}
          >
            <Text className='iconfont icon-huiyuanzhongxin'></Text>
          </SpFloatMenuItem>
          <SpChat sessionFrom={JSON.stringify(sessionFrom)}>
            <SpFloatMenuItem>
              <Text className='iconfont icon-headphones'></Text>
            </SpFloatMenuItem>
          </SpChat>
        </View>
      }
      renderFooter={
        <CompBuytoolbar
          info={info}
          onChange={onChangeToolBar}
          onSubscribe={() => {
            fetch()
          }}
        />
      }
    >
      {/* <Canvas id="canvas2" type="2d" onReady={onCanvasReady} /> */}
      {!info && <SpLoading />}
      {info && (
        <ScrollView scrollY className='goods-contents' style="height: 100%;">
          <View className='goods-pic-container'>
            <Swiper
              className='goods-swiper'
              // current={curImgIdx}
              onChange={onChangeSwiper}
            >
              {console.log('info', info)}
              {info.imgs.map((img, idx) => (
                <SwiperItem key={`swiperitem__${idx}`}>
                  <SpImage
                    mode='widthFix'
                    src={img}
                    width={windowWidth * 2}
                  // height={windowWidth * 2}
                  ></SpImage>
                </SwiperItem>
              ))}
            </Swiper>

            {info.imgs.length > 1 && (
              <View className='swiper-pagegation'>{`${curImgIdx + 1}/${info.imgs.length}`}</View>
            )}

            {info.video && play && (
              <View className='video-container'>
                <Video
                  direction={90}
                  id='goods-video'
                  className='item-video'
                  src={info.video}
                  showCenterPlayBtn={false}
                />
              </View>
            )}

            {info.video && (
              <View
                className={classNames('btn-video', {
                  playing: play
                })}
                onClick={() => {
                  setState((draft) => {
                    play ? (draft.play = false) : (draft.play = true)
                  })
                }}
              >
                {!play && <SpImage className='play-icon' src='play2.png' width={50} height={50} />}
                {play ? '退出视频' : '播放视频'}
              </View>
            )}
          </View>

          {/* 拼团、秒杀、限时特惠显示活动价 */}
          {ACTIVITY_LIST[info.activityType] && (
            <CompActivityBar
              info={{
                ...info.activityInfo,
                priceObj: curItem ? curItem : info
              }}
              type={info.activityType}
              onTimeUp={() => {
                fetch()
              }}
            >
              <SpGoodsPrice info={curItem ? curItem : info} />
            </CompActivityBar>
          )}

          <View className='goods-info'>
            <View className='goods-info-title'>
              {/* 拼团、秒杀、限时特惠不显示 */}
              {!ACTIVITY_LIST[info.activityType] && (
                <SpGoodsPrice info={curItem ? curItem : info} />
              )}
            </View>

            <CompVipGuide
              info={{
                ...info.vipgradeGuideTitle,
                memberPrice: info.memberPrice
              }}
            />

            <CompCouponList
              info={
                info.couponList.list.length > 3
                  ? info.couponList.list.slice(0, 3)
                  : info.couponList.list
              }
              onClick={handleReceiveCoupon}
            />

            <View className='goods-name-wrap'>
              <View className='goods-name'>
                <View className='title'>{info.itemName}</View>
                <View className='brief'>{info.brief}</View>
              </View>
              {(isWeixin || isAPP()) && (
                // {(
                <View className='btn-share-wrap'>
                  <View
                    onClick={async () => {
                      if (isAPP()) {
                        Taro.SAPPShare.open()
                      } else {
                        // await getUserInfoAuth()
                        setState((draft) => {
                          draft.sharePanelOpen = true
                        })
                      }
                    }}
                  >
                    <View className='btn-share'>
                      <Text className='iconfont icon-fenxiang-01'></Text>
                      <Text className='share-txt'>分享</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
            {
              info.isMedicine == 1 && info?.medicineData?.is_prescription == 1 &&
              <View className='item-pre'>
                <View className='item-pre-title'>
                  <Text className='medicine'>处方药</Text>
                  <Text>处方药须凭处方在药师指导下购买和使用</Text>
                </View>
                <View className='item-pre-content'>
                  <View className='title'>用药提示</View>
                  <View className='content'>
                    {/* <Text>功能主治：</Text> */}
                    {/* <Text className='content-title'>根据法规要求，请咨询药师了解处方药详细信息</Text> */}
                    <Text className='content-title'>{info?.medicineData?.use_tip}</Text>
                  </View>
                </View>
              </View>
            }
            <View className='item-bn-sales'>
              {/* <View className='item-bn'></View> */}
              {info.salesSetting && <View className='item-sales'>{`销量：${info.sales || 0}`}</View>}
              {info.store_setting && <View className='kc'>库存：{info.store}</View>}
            </View>
          </View>

          <CompGroup info={info} />

          {!info.nospec && (
            <View className='sku-block'>
              <SpCell
                title='规格'
                isLink
                onClick={() => {
                  setState((draft) => {
                    draft.skuPanelOpen = true
                    draft.selectType = 'picker'
                  })
                }}
              >
                <Text className='cell-value'>{skuText}</Text>
              </SpCell>
            </View>
          )}

          <View className='sku-block'>
            {promotionPackage.length > 0 && (
              <SpCell
                title='组合优惠'
                isLink
                onClick={() => {
                  Taro.navigateTo({
                    url: `/subpages/marketing/package-list?id=${info.itemId}&distributor_id=${info.distributorId}`
                  })
                  // setState((draft) => {
                  //   draft.packageOpen = true
                  // })
                }}
              >
                <Text className='cell-value'>{`共${promotionPackage.length}种组合随意搭配`}</Text>
              </SpCell>
            )}
            {promotionActivity.length > 0 && (
              <SpCell
                title='优惠活动'
                isLink
                onClick={() => {
                  setState((draft) => {
                    draft.promotionOpen = true
                  })
                }}
              >
                {promotionActivity.map((item, index) => (
                  <View className='promotion-tag' key={`promotion-tag__${index}`}>
                    {item.promotionTag}
                  </View>
                ))}
              </SpCell>
            )}
          </View>

          {info.itemParams.length > 0 && <View className='goods-params'>
            <View className='params-hd'>商品参数</View>
            <View className='params-bd'>
              {info.itemParams.map((item, index) => (
                <View className='params-item' key={`params-item__${index}`}>
                  <View className='params-label'>{`${item.attribute_name}：`}</View>
                  <View className='params-value'>{item.attribute_value_name}</View>
                </View>
              ))}
            </View>
          </View>}

          {/* 商品评价 */}
          <CompEvaluation list={evaluationList} itemId={info.itemId}></CompEvaluation>

          {/* 店铺 */}
          {VERSION_PLATFORM && <CompStore info={info.distributorInfo} />}

          <View className='goods-desc'>
            <View className='desc-hd'>
              <Text className='desc-title'>宝贝详情</Text>
            </View>
            {isArray(info.intro) ? (
              <View>
                {info.intro.map((item, idx) => (
                  <View className='wgt-wrap' key={`wgt-wrap__${idx}`}>
                    {item.name === 'film' && <WgtFilm info={item} />}
                    {item.name === 'slider' && <WgtSlider info={item} />}
                    {item.name === 'writing' && <WgtWriting info={item} />}
                    {/* {item.name === 'heading' && <WgtHeading info={item} />} */}
                    {item.name === 'headline' && <WgtHeadline info={item} />}
                    {item.name === 'goods' && <WgtGoods info={item} />}
                  </View>
                ))}
              </View>
            ) : (
              <SpHtml content={info.intro} />
            )}
          </View>
        </ScrollView>
      )}

      <SpRecommend info={recommendList} />

      {/* 组合优惠 */}
      <CompPackageList
        open={packageOpen}
        onClose={() => {
          setState((draft) => {
            draft.packageOpen = false
          })
        }}
        info={{
          mainGoods,
          makeUpGoods
        }}
      />

      {/* 促销优惠活动 */}
      <CompPromation
        open={promotionOpen}
        info={promotionActivity}
        onClose={() => {
          setState((draft) => {
            draft.promotionOpen = false
          })
        }}
      />

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

      {/* 分享 */}
      <CompShare
        open={sharePanelOpen}
        onClose={() => {
          setState((draft) => {
            draft.sharePanelOpen = false
          })
        }}
        onCreatePoster={() => {
          setState((draft) => {
            draft.sharePanelOpen = false
            draft.posterModalOpen = true
          })
        }}
        onShareEdit={() => {
          const { itemId, companyId, distributorId } = info
          Taro.navigateTo({
            url: `/subpage/pages/editShare/index?id=${itemId}&dtid=${distributorId}&company_id=${companyId}`
          })
        }}
      />

      {/* 海报 */}
      {posterModalOpen && (
        <SpPoster
          info={info}
          type='goodsDetial'
          onClose={() => {
            setState((draft) => {
              draft.posterModalOpen = false
            })
          }}
        />
      )}

      {/* 添加隐私协议弹窗 */}
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
          updateAddress()
          checkStoreIsolation()
        }}
        onPolicyClose={() => {
          onPolicyChange(false)
        }}
      />
      {modalDivided.isShow && <SpModalDivided
        content={modalDivided.content}
        cancelText={modalDivided.cancelText}
        confirmText={modalDivided.confirmText}
        showCancel={modalDivided.showCancel}
        onCancel={modalDivided.onCancel}
        onConfirm={modalDivided.onConfirm}
      />}
    </SpPage>
  )
}

export default EspierDetail
