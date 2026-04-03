/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { log } from '@/utils'
import {
  WgtImgHotZone,
  WgtShop,
  WgtStoreAlphabet,
  WgtClassify,
  WgtSlider,
  WgtFilm,
  WgtMarquees,
  WgtFullSlider,
  WgtCouponCard,
  WgtSpeedkill,
  WgtGroup,
  WgtHotranking,
  WgtGoods,
  WgtLocationModule,
  WgtContentPartition,
  WgtOrderNavigation
} from '../wgts'
import './home-wgts.scss'

const initialState = {
  localWgts: [],
  searchMethod: null
}
function HomeWgts(props) {
  const { wgts, dtid, onLoad = () => {}, children, copywriting = false } = props
  const [state, setState] = useImmer(initialState)
  const { localWgts, searchMethod } = state

  console.log(wgts, 'wgts')
  // const wgtsRef = useRef()

  // useEffect(() => {
  //   wgtsRef.current.reset()
  // }, [wgts])

  // const fetch = ({ pageIndex, pageSize }) => {
  //   const x = pageSize * pageIndex
  //   const twgt = wgts.slice(x - pageSize, x > wgts.length ? wgts.length : x)
  //   log.debug(
  //     `${pageIndex}; ${pageSize}; ${wgts.length}; ${x - pageSize}; ${
  //       x > wgts.length ? wgts.length : x
  //     }`
  //   )

  //   const storeClick = () => {
  //     Taro.navigateTo({
  //       url: `/subpages/store/item-list?dtid=${dtid}`
  //     })
  //   }
  //   let searchMethod = dtid && storeClick

  //   setState((draft) => {
  //     draft.localWgts[pageIndex - 1] = twgt
  //     draft.searchMethod = searchMethod
  //   })

  //   return {
  //     total: wgts.length
  //   }
  // }

  const storeClick = () => {
    Taro.navigateTo({
      url: `/subpages/store/item-list?dtid=${dtid}`
    })
  }

  return (
    <View className='home-wgts'>
      {wgts.map((item, idx) => {
        return (
          <View
            className='wgt-wrap'
            key={`${item.name}${idx}`}
            data-idx={idx}
            data-name={item.name}
          >
            {item.name === 'slider' && <WgtSlider info={item} />} {/** 轮播 */}
            {item.name === 'imgHotzone' && <WgtImgHotZone info={item} id={item.id || idx} />}
            {/** 热区 */}
            {item.name === 'film' && <WgtFilm info={item} />} {/** 视频 */}
            {item.name === 'marquees' && <WgtMarquees info={item} />} {/** 跑马灯 */}
            {item.name === 'fullSlider' && <WgtFullSlider info={item} index={idx} />}{' '}
            {/** 全屏轮播 */}
            {item.name === 'couponCard' && <WgtCouponCard info={item} id={item.id || idx} />}{' '}
            {/** 优惠券卡片 */}
            {item.name === 'speedkill' && <WgtSpeedkill info={item} id={item.id || idx} />}{' '}
            {/** 秒杀 */}
            {item.name === 'group' && <WgtGroup info={item} id={item.id || idx} />} {/** 拼团 */}
            {item.name === 'hotranking' && <WgtHotranking info={item} id={item.id || idx} />}{' '}
            {/** 热门排行榜 */}
            {item.name === 'goods' && <WgtGoods info={item} id={item.id || idx} />} {/** 商品 */}
            {item.name === 'storeAlphabet' && (
              <WgtStoreAlphabet info={item} id={item.id || idx} />
            )}{' '}
            {/** 字母表店铺 */}
            {item.name === 'classify' && <WgtClassify info={item} id={item.id || idx} />}{' '}
            {/** 分类 */}
            {item.name === 'locationModule' && (
              <WgtLocationModule info={item} id={item.id || idx} />
            )}
            {item.name === 'contentPartition' && (
              <WgtContentPartition info={item} id={item.id || idx} />
            )}
            {item.name === 'orderNavigation' && (
              <WgtOrderNavigation info={item} id={item.id || idx} />
            )}
            {item.name === 'shop' && <WgtShop info={item} id={item.id || idx} />}
          </View>
        )
      })}
      {children}
    </View>
  )
}

HomeWgts.options = {
  addGlobalClass: true
}

HomeWgts.defaultProps = {
  wgts: [],
  dtid: ''
}

export default HomeWgts
