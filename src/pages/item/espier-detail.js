import React, { useEffect, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Video, ScrollView } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AtFloatLayout, AtButton } from 'taro-ui'
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
  VERSION_STANDARD,
  pxToRpx
} from '@/utils'
import { fetchUserFavs } from '@/store/slices/user'

import doc from '@/doc'
import entryLaunch from '@/utils/entryLaunch'
import qs from 'qs'
import S from '@/spx'
import { Tracker } from '@/service'
import { useNavigation, useLogin, useLocation } from '@/hooks'
import withPageWrapper from '@/hocs/withPageWrapper'
import { ACTIVITY_LIST } from '@/consts'
import { SG_ROUTER_PARAMS, SG_GUIDE_PARAMS } from '@/consts/localstorage'
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
import {
  WgtFilm,
  WgtSlider,
  WgtWriting,
  WgtGoods,
  WgtHeading,
  WgtHeadline,
  WgtImgHotZone
} from '../home/wgts'
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
  isParameter: false,
  imgHeightList: [] // 用于存储banner高度
}

function EspierDetail(props) {
  const $instance = getCurrentInstance()
  const pageRef = useRef()

  const { userInfo } = useSelector((state) => state.user)
  const { colorPrimary, openRecommend } = useSelector((state) => state.sys)
  const { shopInfo } = useSelector((state) => state.shop)
  const { setNavigationBarTitle } = useNavigation()
  const dispatch = useDispatch()
  const { updateAddress } = useLocation()

  const loginRef = useRef()

  const [state, setState] = useImmer(initialState)
  const {
    info,
    play,
    isDefault,
    defaultMsg,
    evaluationList,
    evaluationTotal,
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
    isParameter,
    imgHeightList
  } = state

  useEffect(() => {
    init()
    entryLaunch.postGuideTask()
  }, [])

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

      if (S.getAuthToken()) {
        // 导购浏览记录
        api.member.itemHistorySave(id)
      }
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
    if (
      packageOpen ||
      skuPanelOpen ||
      sharePanelOpen ||
      posterModalOpen ||
      promotionOpen ||
      isParameter
    ) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [packageOpen, skuPanelOpen, sharePanelOpen, posterModalOpen, promotionOpen, isParameter])

  useEffect(() => {
    if (dtid) {
      init(dtid)
      fetch()
    }
  }, [dtid])

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

  const init = async (newDtid) => {
    const routerParams = await entryLaunch.getRouteParams()
    const { type, id, dtid: routerDtid } = routerParams
    const dtid = newDtid || routerDtid
    setState((draft) => {
      draft.id = id
      draft.type = type
      draft.dtid = dtid
    })
    if (S.getAuthToken()) {
      await dispatch(fetchUserFavs({ distributor_id: dtid }))
    }
  }

  const fetch = async () => {
    let data
    if (type == 'pointitem') {
    } else {
      try {
        console.log('🚀🚀🚀 ~ fetch ~ dtid:', dtid)

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
    const { user_id: subscribe = false } = await api.user.isSubscribeGoods(id, {
      distributor_id: dtid
    })

    // setNavigationBarTitle(data.itemName)

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
    const banner = await getMultipleImageInfo(data.imgs)
    setState((draft) => {
      draft.info = {
        ...data,
        subscribe
      }
      draft.play = data.video ? true : false // 辉绮需求
      draft.imgHeightList = banner
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
const getMultipleImageInfo = async (imageUrls) => {
  const promises = imageUrls.map(url =>
    Taro.getImageInfo({ src: url })
      .then(info => info)
      .catch(error => {
        console.log('获取图片信息失败:', url, error)
        // 返回一个默认高度或 null
        return { width: 0, height: 650 }
      })
  )
  const results = await Promise.all(promises)
  return results.map(info => (info.height) / 2 > 650 ? 650 : info.height / 2)
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
    const { list } = await api.item.packageList({
      item_id: id,
      showError: false,
      distributor_id: dtid
    })
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

  const handleClose = () => {
    setState((draft) => {
      draft.isParameter = !isParameter
    })
  }

  // 领券
  const handleReceiveCoupon = () => {
    const { itemId, distributorId } = info
    Taro.navigateTo({
      url: `/subpages/marketing/coupon-center?item_id=${itemId}&distributor_id=${distributorId}`
    })
  }

  const onChangeSwiper = async (e) => {
    await setState((draft) => {
      draft.curImgIdx = e.detail.current
    })
  }

  const onChangeToolBar = (key) => {
    setState((draft) => {
      draft.skuPanelOpen = true
      draft.selectType = key
    })
  }

  const setSwiperCss = (item) => {
    return {
      height: '100%',
      width: '100%',
      backgroundSize: 'cover',
      backgroundImage: `url(${item})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  }

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
      immersive
      title={info?.itemName}
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
        <ScrollView scrollY className='goods-contents' style='height: 100%;'>
          <View className='goods-pic-container'>
            <Swiper
              className='goods-swiper'
              // current={curImgIdx}
              onChange={onChangeSwiper}
              style={{ height: imgHeightList[curImgIdx] + 'px' }}
            >
              {info.imgs.map((img, idx) => (
                <SwiperItem key={`swiperitem__${idx}`}>
                  <View style={setSwiperCss(img)}>
                    <SpImage mode='scaleToFill' src={img} className='swiperitem__img' />
                  </View>
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
            {info.isMedicine == 1 && info?.medicineData?.is_prescription == 1 && (
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
            )}
            <View className='item-bn-sales'>
              {/* <View className='item-bn'></View> */}
              {info.salesSetting && (
                <View className='item-sales'>{`销量：${info.sales || 0}`}</View>
              )}
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

          {/* {info.itemParams.length > 0 && <View className='goods-params'>
            <View className='params-hd'>商品参数</View>
            <View className='params-bd'>
              {info.itemParams.map((item, index) => (
                <View className='params-item' key={`params-item__${index}`}>
                  <View className='params-label'>{`${item.attribute_name}：`}</View>
                  <View className='params-value'>{item.attribute_value_name}</View>
                </View>
              ))}
            </View>
          </View>} */}

          {info.itemParams.length > 0 && (
            <View className='goods-params-flat'>
              <View className='parameter'>参数</View>
              <View className='parameter-content'>
                {info.itemParams.map((item, index) => {
                  return (
                    <View className='parameter-item'>
                      <View className='attribute'>{item.attribute_value_name}</View>
                      <View className='configuration'>{item.attribute_name}</View>
                    </View>
                  )
                })}
              </View>
              <Text className='iconfont icon-arrowRight' onClick={handleClose} />
            </View>
          )}

          {/* 商品评价 */}
          <CompEvaluation
            list={evaluationList}
            allNum={evaluationTotal}
            itemId={info.itemId}
          ></CompEvaluation>

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
                    {item.name === 'imgHotzone' && <WgtImgHotZone info={item} />}
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

      <AtFloatLayout isOpened={isParameter} title='商品参数' onClose={handleClose}>
        <View className='product-parameter'>
          <View className='product-parameter-all'>
            {info?.itemParams?.map((item, index) => {
              return (
                <View className='product-parameter-item'>
                  <Text className='title'>{item.attribute_name}</Text>
                  <Text className='content'>{item.attribute_value_name}</Text>
                </View>
              )
            })}
          </View>
          <AtButton type='primary' circle onClick={handleClose}>
            确认
          </AtButton>
        </View>
      </AtFloatLayout>
    </SpPage>
  )
}

export default withPageWrapper(EspierDetail)
