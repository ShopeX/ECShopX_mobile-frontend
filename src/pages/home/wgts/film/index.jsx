/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState, useEffect, useMemo } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Video, Text } from '@tarojs/components'
import { classNames, styleNames, linkPage } from '@/utils'
import { getGlobalBaseStyle } from '../helper'
import './index.scss'

const $instance = getCurrentInstance()

function WgtFilm(props) {
  const { info } = props
  const [screenWidth, setScreenWidth] = useState(null)

  // 从 params 中获取配置和数据，兼容两种数据结构
  // 1. 新结构：info.params.config, info.params.data, info.params.base
  // 2. 旧结构：info.config, info.data, info.base
  const params = info?.params || info || {}
  const base = params.base || {}
  const config = params.config || {}
  const data = params.data || []

  useEffect(() => {
    const res = Taro.getSystemInfoSync()
    setScreenWidth(res.screenWidth)
  }, [])

  // 获取外层样式（包含 outerMargin 和背景配置）
  const outerStyle = useMemo(() => {
    return getGlobalBaseStyle(base.outerMargin)
  }, [base])

  // 计算视频尺寸
  const videoSize = useMemo(() => {
    if (!screenWidth) {
      return { width: '100%', height: 'auto', objectFit: 'contain' }
    }

    // 计算实际可用宽度（减去边距）
    const padding = config.padded || base.padded ? 32 : 0 // 16px * 2
    const availableWidth = screenWidth - padding

    const aspectRatios = [16 / 9, 9 / 16, 4 / 3, 3 / 4, 1 / 1]
    const { proportion = 0 } = base
    let ratio = aspectRatios[proportion]

    let w = '100%',
      h
    let objectFit = 'contain'
    const defaultHeight = Math.round(availableWidth / ratio)

    if (config.width && config.height) {
      ratio = config.width / config.height
      if (ratio <= 10 / 16) {
        h = defaultHeight
      } else {
        objectFit = 'cover'
        h = Math.round(availableWidth / ratio)
      }
    } else {
      h = defaultHeight
    }

    if (config.ratio === 'square') {
      // 1:1
      objectFit = 'cover'
      h = availableWidth
    } else if (config.ratio === 'rectangle') {
      // 16:9
      h = defaultHeight
    }

    return {
      width: w,
      height: `${h}px`,
      objectFit
    }
  }, [
    screenWidth,
    base.proportion,
    base.padded,
    config.width,
    config.height,
    config.ratio,
    config.padded
  ])

  const handleClickItem = linkPage

  if (!info || !data || data.length === 0 || !data[0].url) {
    return null
  }

  return (
    <View
      className={classNames('wgt wgt-film', {
        'wgt__padded': base.padded
      })}
      style={styleNames(outerStyle)}
    >
      {base.title && (
        <View className='wgt-head'>
          <View className='wgt-hd'>
            <Text className='wgt-title'>{base.title}</Text>
            {base.subtitle && <Text className='wgt-subtitle'>{base.subtitle}</Text>}
          </View>
        </View>
      )}
      <View
        className={classNames('slider-wrap')}
        style={styleNames({
          width: videoSize.width,
          height: videoSize.height
        })}
      >
        <Video
          className='flim-video'
          direction={90}
          src={data[0].url}
          controls
          objectFit={videoSize.objectFit}
        />
      </View>
    </View>
  )
}

WgtFilm.options = {
  addGlobalClass: true
}

export default React.memo(WgtFilm)
