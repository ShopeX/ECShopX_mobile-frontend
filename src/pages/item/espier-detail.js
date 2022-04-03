import React, { useEffect, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Video } from '@tarojs/components'
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
  SpGoodsPrice
} from '@/components'
import api from '@/api'
import req from '@/api/req'
import {
  log,
  calcTimer,
  isArray,
  canvasExp,
  normalizeQuerys,
  buriedPoint,
  isAlipay,
  isWeixin,
  isWeb,
  linkPage,
  pickBy,
  classNames,
  navigateTo,
  VERSION_PLATFORM
} from '@/utils'

import doc from '@/doc'
import entryLaunch from '@/utils/entryLaunch'
import qs from 'qs'
import S from '@/spx'
import { Tracker } from '@/service'
import { ACTIVITY_LIST } from '@/consts'
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
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../home/wgts'

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
  recommendList: []
}

function EspierDetail(props) {
  const $instance = getCurrentInstance()
  // const { type, id, dtid } = $instance.router.params
  // const { type, id, dtid } = await entryLaunch.getRouteParams()
  const pageRef = useRef()
  const { userInfo } = useSelector((state) => state.user)
  const { colorPrimary, openRecommend } = useSelector((state) => state.sys)

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
    recommendList
  } = state

  useEffect(() => {
    init()
    if (openRecommend == 1) {
      getRecommendList() // 猜你喜欢
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetch()
    }
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

  const getAppShareInfo = () => {
    const { itemName, imgs } = info
    const query = {
      id,
      dtid
    }
    if (userInfo) {
      query['uid'] = userInfo.uid
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
  }

  const fetch = async () => {
    let data
    if (type == 'pointitem') {
    } else {
      try {
        const itemDetail = await api.item.detail(id, {
          showError: false,
          distributor_id: dtid
        })
        data = pickBy(itemDetail, doc.goods.GOODS_INFO)
      } catch (e) {
        setState((draft) => {
          draft.isDefault = true
          draft.defaultMsg = e.res.data.data.message
        })
        console.log(e.res)
      }
    }

    // 是否订阅
    const { user_id: subscribe = false } = await api.user.isSubscribeGoods(id)

    Taro.setNavigationBarTitle({
      title: data.itemName
    })
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
  }

  const getRecommendList = async () => {
    const { list } = await api.cart.likeList({
      page: 1,
      pageSize: 1000
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
    const { item_id, distributor_id } = info
    Taro.navigateTo({
      url: `/others/pages/home/coupon-home?item_id=${item_id}&distributor_id=${distributor_id}`
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
            <Text className='iconfont icon-home1'></Text>
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
      {!info && <SpLoading />}
      {info && (
        <View className='goods-contents'>
          <View className='goods-pic-container'>
            <Swiper
              className='goods-swiper'
              // current={curImgIdx}
              onChange={onChangeSwiper}
            >
              {info.imgs.map((img, idx) => (
                <SwiperItem key={`swiperitem__${idx}`}>
                  <SpImage
                    mode='aspecFill'
                    src={img}
                    width={windowWidth * 2}
                    height={windowWidth * 2}
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
              info={info.activityInfo}
              type={info.activityType}
              onTimeUp={() => {
                fetch()
              }}
            >
              <SpGoodsPrice info={curItem ? curItem : info} />
            </CompActivityBar>
          )}

          <View className='goods-info'>
            {/* 拼团、秒杀、限时特惠不显示 */}
            {!ACTIVITY_LIST[info.activityType] && <SpGoodsPrice info={curItem ? curItem : info} />}

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
              <View className='goods-name'>{info.itemName}</View>
              {isWeixin && (
                <SpLogin
                  onChange={() => {
                    setState((draft) => {
                      draft.sharePanelOpen = true
                    })
                  }}
                >
                  <View className='btn-share'>
                    <Text className='iconfont icon-fenxiang-01'></Text>
                    <Text className='share-txt'>分享</Text>
                  </View>
                </SpLogin>
              )}
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
                  Taro.navigateTo({ url: `/subpages/marketing/package-list?id=${info.itemId}` })
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

          <View className='goods-params'>
            <View className='params-hd'>商品参数</View>
            <View className='params-bd'>
              {info.itemParams.map((item, index) => (
                <View className='params-item' key={`params-item__${index}`}>
                  <View className='params-label'>{item.attribute_name}</View>
                  <View className='params-value'>{item.attribute_value_name}</View>
                </View>
              ))}
            </View>
          </View>

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
                    {item.name === 'heading' && <WgtHeading info={item} />}
                    {item.name === 'goods' && <WgtGoods info={item} />}
                  </View>
                ))}
              </View>
            ) : (
              <SpHtml content={info.intro} />
            )}
          </View>
        </View>
      )}

      <SpRecommend info={recommendList} />

      {/* 优惠组合 */}
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
    </SpPage>
  )
}

export default EspierDetail
