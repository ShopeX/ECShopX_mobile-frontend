import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Video } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { AtCountdown } from 'taro-ui'
import {
  Loading,
  SpPrice,
  FloatMenus,
  FloatMenuItem,
  SpHtmlContent,
  SpHtml,
  SpToast,
  SpNavBar,
  GoodsBuyPanel,
  GoodsEvaluation,
  FloatMenuMeiQia,
  GoodsItem,
  SpCell,
  SpImage,
  SpLoading,
  SpRecommend,
  SpPage
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
import { setPageTitle } from '@/utils/platform'
import doc from '@/doc'
import entry from '@/utils/entry'
import S from '@/spx'
import { Tracker } from '@/service'
import {
  GoodsBuyToolbar,
  ItemImg,
  ImgSpec,
  StoreInfo,
  ActivityPanel,
  SharePanel,
  VipGuide,
  ParamsItem,
  GroupingItem
} from './comps'
import CompVipGuide from './comps/comp-vipguide'
import CompCouponList from './comps/comp-couponlist'
import CompStore from './comps/comp-store'
import CompPackageList from './comps/comp-packagelist'
import CompEvaluation from './comps/comp-evaluation'
import CompBuytoolbar from './comps/comp-buytoolbar'
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../home/wgts'

import './espier-detail.scss'

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
  evaluationList: [],
  evaluationTotal: 0
}

function EspierDetail (props) {
  const $instance = getCurrentInstance()
  const { type, id } = $instance.router.params
  const pageRef = useRef()

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
    if (packageOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [packageOpen])

  const fetch = async () => {
    let data
    if (type == 'pointitem') {
    } else {
      try {
        const itemDetail = await api.item.detail(id, {
          showError: false
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
          </View>

          <View className='goods-info'>
            <View className='price-block'>
              <SpPrice className='goods-price' value={100}></SpPrice>
              <View className='vip-price'>
                会员<SpPrice value={100}></SpPrice>
              </View>
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
              <View className='btn-share'>
                <Text className='iconfont icon-fenxiang-01'></Text>
                <Text className='share-txt'>分享</Text>
              </View>
            </View>
          </View>

          <View className='sku-block'>
            <SpCell title='规格' isLink></SpCell>
          </View>

          <View className='sku-block'>
            {/* {promotionPackage.length > 0 && (
              <SpCell
                title='组合优惠'
                isLink
                onClick={navigateTo.bind(
                  this,
                  `/subpages/marketing/package-list?id=${info.itemId}&distributor_id=${info.distributorId}`
                )}
              >
                {`共${promotionPackage.length}种组合随意搭配`}
              </SpCell>
            )} */}
            <SpCell
              title='组合优惠'
              isLink
              value='共2种组合随意搭配'
              onClick={() => {
                setState((draft) => {
                  draft.packageOpen = true
                })
              }}
            ></SpCell>
            <SpCell title='组合优惠' isLink value='共2种组合随意搭配'></SpCell>
            <SpCell title='组合优惠' isLink value='共2种组合随意搭配'></SpCell>
          </View>

          <View className='goods-params'>
            <View className='params-hd'>商品参数</View>
            <View className='params-bd'>
              <View className='params-item'>
                <View className='params-label'>颜色</View>
                <View className='params-value'>水晶石原色</View>
              </View>
            </View>
          </View>

          <CompEvaluation list={evaluationList}></CompEvaluation>

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
      <View></View>
    </SpPage>
  )
}

export default EspierDetail
