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
  WgtClassify,
  WgtSlider
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
            {item.name === 'slider' && <WgtSlider info={item} />} {/** 轮播 */}
            {item.name === 'imgHotzone' && <WgtImgHotZone info={item} id={item.id || idx} />} {/** 热区 */}
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
