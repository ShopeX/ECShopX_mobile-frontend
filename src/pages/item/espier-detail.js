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
  SpLogin
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
  linkPage,
  pickBy,
  classNames,
  navigateTo
} from '@/utils'

import doc from '@/doc'
import entry from '@/utils/entry'
import qs from 'qs'
import S from '@/spx'
import { Tracker } from '@/service'
import CompVipGuide from './comps/comp-vipguide'
import CompCouponList from './comps/comp-couponlist'
import CompStore from './comps/comp-store'
import CompPackageList from './comps/comp-packagelist'
import CompEvaluation from './comps/comp-evaluation'
import CompBuytoolbar from './comps/comp-buytoolbar'
import CompShare from './comps/comp-share'
import CompPromation from './comps/comp-promation'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../home/wgts'

import './espier-detail.scss'

const MSpSkuSelect = React.memo(SpSkuSelect)

const initialState = {
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
  sharePanelOpen: false,
  posterModalOpen: false,
  evaluationList: [],
  evaluationTotal: 0
}

function EspierDetail (props) {
  const $instance = getCurrentInstance()
  const { type, id, dtid } = $instance.router.params
  const pageRef = useRef()
  const { userInfo } = useSelector((state) => state.user)

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
    sharePanelOpen,
    posterModalOpen,
    mainGoods,
    makeUpGoods
  } = state

  useEffect(() => {
    fetch()
    getPackageList()
    getEvaluationList()
  }, [])

  useEffect(() => {
    const video = Taro.createVideoContext('goods-video')
    if (play) {
      setTimeout(() => {
        console.log('video:', video)
        video.play()
      }, 200)
    } else {
      video.stop()
    }
  }, [play])

  useEffect(() => {
    if (packageOpen || skuPanelOpen || sharePanelOpen || posterModalOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [packageOpen, skuPanelOpen, sharePanelOpen, posterModalOpen])

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
    setState((draft) => {
      draft.info = {
        ...data,
        subscribe
      }
    })
  }

  // 获取包裹
  const getPackageList = async () => {
    const { list } = await api.item.packageList({ item_id: id, showError: false })
    if (list.length > 0) {
      const {
        itemLists,
        mainItem,
        main_package_price,
        package_price: packagePrice
      } = await api.item.packageDetail(list[0].package_id)
      setState((draft) => {
        draft.promotionPackage = list
        draft.mainGoods = pickBy(mainItem, doc.goods.PACKGOODS_INFO)
        draft.makeUpGoods = pickBy(itemLists, doc.goods.PACKGOODS_INFO)
      })
    }
  }

  // 获取评论
  const getEvaluationList = async () => {
    const { id } = $instance.router.params
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

  const { windowWidth } = Taro.getSystemInfoSync()

  return (
    <SpPage
      className='page-item-espierdetail'
      scrollToTopBtn
      isDefault={isDefault}
      defaultMsg={defaultMsg}
      ref={pageRef}
      renderFooter={<CompBuytoolbar info={info} />}
    >
      {!info && <SpLoading />}
      {info && (
        <View>
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

          <View className='goods-info'>
            <View className='price-block'>
              <SpPrice className='goods-price' value={info.price}></SpPrice>
              {info.memberPrice && (
                <View className='vip-price'>
                  会员<SpPrice value={info.memberPrice}></SpPrice>
                </View>
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
              <View className='goods-name'>{info.itemName}</View>
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
            </View>
          </View>

          <View className='sku-block'>
            <SpCell
              title='规格'
              isLink
              onClick={() => {
                setState((draft) => {
                  draft.skuPanelOpen = true
                })
              }}
            ></SpCell>
          </View>

          <View className='sku-block'>
            {promotionPackage.length > 0 && (
              <SpCell
                title='组合优惠'
                isLink
                onClick={() => {
                  setState((draft) => {
                    draft.packageOpen = true
                  })
                }}
              >
                <Text className='cell-value'>{`共${makeUpGoods.length}种组合随意搭配`}</Text>
              </SpCell>
            )}
            <SpCell
              title='优惠活动'
              isLink
              onClick={() => {
                setState((draft) => {
                  draft.promotionOpen = true
                })
              }}
            >
              {info.promotionActivity.map((item, index) => (
                <View className='promotion-tag'>{item.promotion_tag}</View>
              ))}
            </SpCell>
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
          <CompEvaluation list={evaluationList}></CompEvaluation>

          {/* 店铺 */}
          <CompStore info={info.distributorInfo} />

          <View className='goods-desc'>
            <View className='desc-hd'>
              <Text className='desc-title'>宝贝详情</Text>
            </View>
            <SpHtml content={info.intro} />
          </View>
        </View>
      )}

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
      <CompPromation open={promotionOpen} />

      {/* Sku选择器 */}
      <MSpSkuSelect
        open={skuPanelOpen}
        info={info}
        onClose={() => {
          setState((draft) => {
            draft.skuPanelOpen = false
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
