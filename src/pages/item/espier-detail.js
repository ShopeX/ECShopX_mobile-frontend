import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import {
  View,
  Text,
  ScrollView,
  Swiper,
  SwiperItem,
  Image,
  Video,
  Canvas,
  RichText
} from '@tarojs/components'
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
import { WgtFilm, WgtSlider, WgtWriting, WgtGoods, WgtHeading } from '../home/wgts'

import './espier-detail.scss'

const initialState = {
  info: null
}

function EspierDetail (props) {
  const $instance = getCurrentInstance()
  const { type, id } = $instance.router.params

  const [state, setState] = useImmer(initialState)
  const { info } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    let data
    if (type == 'pointitem') {
    } else {
      const itemDetail = await api.item.detail(id)
      data = pickBy(itemDetail, doc.goods.GOODS_INFO)
    }

    setState((draft) => {
      draft.info = data
    })

    // 是否订阅
    const { user_id: subscribe } = await api.user.isSubscribeGoods(id)
  }

  return (
    <SpPage className='page-item-espierdetail'>
      {!info && <SpLoading />}
      {info && (
        <View>
          <Swiper
            className='goods-swiper'
            // current={curImgIdx}
            // onChange={this.handleSwiperChange}
          >
            {info.imgs.map((img, idx) => (
              <SwiperItem key={`swiperitem__${idx}`}>
                <SpImage mode='aspecFill' src={img} width={750} height={750}></SpImage>
              </SwiperItem>
            ))}
          </Swiper>

          <View className='goods-info'>
            <View className='price-block'>
              <SpPrice className='goods-price' value={100}></SpPrice>
              <View className='vip-price'>
                会员<SpPrice value={100}></SpPrice>
              </View>
            </View>
            <View className='join-vip'>
              <View className='vip-info'>
                <View>
                  <Text>会员专享</Text>
                  <Text>8.5折</Text>
                </View>
                <View>亲爱的顾客，成为会员即刻享受此优惠</View>
              </View>
              <View className='btn-join'>立即加入</View>
            </View>
            <View>
              <View className='coupon-list'></View>
              <View className='coupon-get'>
                领券<Text className='iconfont'></Text>
              </View>
            </View>
            <View>
              <View className='goods-name'></View>
              <View className='goods-share'>
                <Text className='iconfont'></Text>
                <Text>分享</Text>
              </View>
            </View>
          </View>

          <View className='goods-sku'></View>

          <View className='goods-rate'></View>

          <View className='goods-desc'></View>
        </View>
      )}
      <View></View>
    </SpPage>
  )
}

export default EspierDetail
