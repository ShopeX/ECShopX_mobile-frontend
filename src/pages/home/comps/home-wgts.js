/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpScrollView, SpSearch } from '@/components'
import { log } from '@/utils'
import {
  WgtSearchHome,
  WgtFilm,
  WgtMarquees,
  WgtSlider,
  WgtImgHotZone,
  WgtNavigation,
  WgtCoupon,
  WgtGoodsScroll,
  WgtGoodsGrid,
  WgtGoodsGridTab,
  WgtShowcase,
  WgtStore,
  WgtHeadline,
  WgtImgGif,
  WgtHotTopic,
  WgtFloorImg,
  WgtNearbyShop,
  WgtFullSlider,
  WgtOrderNavigation,
  WgtShop
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
            {item.name === 'imgHotzone' && <WgtImgHotZone info={item} />} {/** 热区图 */}
            {item.name === 'shop' && <WgtShop info={item} />} {/** 店铺 */}
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
