import React, { useEffect } from 'react'
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
  SpCell,
  GoodsEvaluation,
  FloatMenuMeiQia,
  GoodsItem,
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
  pickBy
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
  evaluationList: [],
  evaluationTotal: 0
}

function EspierDetail (props) {
  const $instance = getCurrentInstance()
  const { type, id } = $instance.router.params

  const [state, setState] = useImmer(initialState)
  const { info, play, isDefault, defaultMsg, evaluationList } = state

  useEffect(() => {
    fetch()
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

    setState((draft) => {
      draft.info = {
        ...data,
        subscribe
      }
    })
  }

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
  const onChangeGetCoupon = () => {}

  const onChangeSwiper = (e) => {
    setState((draft) => {
      draft.curImgIdx = e.detail.current
    })
  }

  const { windowWidth } = Taro.getSystemInfoSync()

  return (
    <SpPage
      className='page-item-espierdetail'
      isDefault={isDefault}
      defaultMsg={defaultMsg}
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
              className='btn-video'
              onClick={() => {
                setState((draft) => {
                  play ? (draft.play = false) : (draft.play = true)
                })
              }}
            >
              {play ? '退出视频' : '播放视频'}
            </View>
            <View className='swiper-pagegation'>1/9</View>
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
              onChange={onChangeGetCoupon}
            />

            <View className='goods-name-wrap'>
              <View className='goods-name'>{info.itemName}</View>
              <View className='btn-share'>
                <Text className='iconfont icon-fenxiang-01'></Text>
                <Text className='share-txt'>分享</Text>
              </View>
            </View>
          </View>

          <View className='goods-sku'></View>

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
      <View></View>
    </SpPage>
  )
}

export default EspierDetail
