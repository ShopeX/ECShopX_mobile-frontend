import React, { useEffect, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useShareTimeline,
  useReady
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
  SpPrivacyModal
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
import { updateShopInfo, changeInWhite} from '@/store/slices/shop'
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
}

function EspierDetail(props) {
  const $instance = getCurrentInstance()
  // const { type, id, dtid } = $instance.router.params
  // const { type, id, dtid } = await entryLaunch.getRouteParams()
  const { getUserInfoAuth } = useLogin()
  const pageRef = useRef()
  const { userInfo } = useSelector((state) => state.user)
  const { colorPrimary, openRecommend, open_divided, openLocation, open_divided_templateId } = useSelector((state) => state.sys)
  const { shopInWhite } = useSelector((state) => state.shop)
  const { getWhiteShop, showNoShopModal, connectWhiteShop } = useWhiteShop()

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
  const { location } = useSelector((state) => state.user)

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
    policyModal
  } = state

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

  useShareAppMessage(async (res) => {
    return getAppShareInfo()
  })

  useShareTimeline(async (res) => {
    return getAppShareInfo()
  })


  const salesmanShare = async() => {
    let params = $instance.router.params
    if (params?.qr=='Y') {
      let param = {
        promoter_user_id: params?.uid,
        promoter_shop_id:params?.dtid,
        promoter_item_id:params?.id
      }
      await api.salesman.salespersonBindusersalesperson(param)
      Taro.setStorageSync('salesmanUserinfo', param)
      console.log(param,'分享成功，业务员已存储1')
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
    fetchLocation()
  }

  // 店铺隔离需要 定位
  const fetchLocation = () => {
    // 开启了店铺隔离，且还没有进入过店铺，说明是第一次进店，需要定位
    if (!location && (VERSION_STANDARD && openLocation == 1) && shopInWhite === undefined) {
      try {
        updateAddress()
      } catch (e) {
        console.error('map location fail:', e)
      }
    }
  }

  // 店铺隔离start
  const checkStoreIsolation = async () => { 

    console.log("🚀🚀🚀 ~ checkStoreIsolation ~ checkStoreIsolation:")

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
    let shopDetail, res
    
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
            params.distributor_id = shop.distributor_id
            Taro.showModal({
              content: '抱歉，本店会员才可以访问，如有需要可联系店铺',
              confirmText: '回我的店',  
              cancelText: '联系店铺',
              showCancel: !!(open_divided_templateId || shopInfo?.phone),
              success: async (res) => {
                if (res.cancel) {
                  connectWhiteShop()
                }
                if (res.confirm) {
                  // 清空小程序启动时携带的参数
                  Taro.setStorageSync(SG_ROUTER_PARAMS, {})
                  res = await api.shop.getShop(params)
                  dispatch(updateShopInfo(res))
                  dispatch(changeInWhite(true))
                  // Taro.navigateTo({
                  //   url: `/pages/index`
                  // })
                }
              }
            })

            return
          } else {
            // 找附近未开启白名单的店铺
            delete params.show_type
            params.distributor_id = 0
          
            const defalutShop = await api.shop.getShop(params)
            if ( defalutShop.white_hidden == 1) {
              // 没任何店铺可以进
              showNoShopModal()
              return
            } else { 
              Taro.showModal({
                content: '抱歉，本店会员才可以访问，如有需要可电话联系店铺',
                confirmText: '去其他店',  
                cancelText: '联系店铺',
                showCancel: !!(open_divided_templateId || shopInfo?.phone),
                success: async (res) => {
                  if (res.cancel) {
                    connectWhiteShop()
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
          if (params.lat) {
            // 已定位 但是还是没返回店铺信息，说明没有绑定过任何一家店铺白名单
            // 取 附近未开白名单的店铺
            delete params.show_type
            
            // 未开启白名单的店铺
            const defalutShop = await api.shop.getShop(params)
            if (defalutShop.white_hidden == 1) {
              // 没任何店铺可以进
              dispatch(updateShopInfo(defalutShop))
              showNoShopModal()
            } else {
              // 有定位，存在没有开启白名单的店铺
              dispatch(updateShopInfo(defalutShop))
              dispatch(changeInWhite(true))
            }
            
            return
          }

          if (!params.lat) {
            // 未定位，从 vaild 接口，就拿不到白名单店铺信息的
            const shop = await getWhiteShop() // 已经加入的最优店铺
            if (!shop) {
              // 没有找到加入的店铺，找没有开白名单的店铺
              delete params.show_type
              res = await api.shop.getShop(params) // ?todozm这里是不是应该取不到？因为没有定位信息
              if (res.white_hidden == 1) {
                // 全部开启白名单
                dispatch(updateShopInfo(defalutShop))
                showNoShopModal()
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


  // 店铺隔离end

  const fetch = async () => {
    let data
    if (type == 'pointitem') {
    } else {
      try {
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
              {console.log('info',info)}
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
    </SpPage>
  )
}

export default EspierDetail
