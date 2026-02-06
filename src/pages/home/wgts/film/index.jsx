/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import { View, Video, Text } from '@tarojs/components'
import { classNames, styleNames, linkPage } from '@/utils'
import { getGlobalBaseStyle } from '../helper'
import './index.scss'

// proportion 与比例 class 的映射：0=16:9, 1=9:16, 2=4:3, 3=3:4, 4=1:1
const RATIO_CLASS_MAP = ['16-9', '9-16', '4-3', '3-4', '1-1']

function WgtFilm(props) {
  const { info } = props

  // 从 params 中获取配置和数据，兼容两种数据结构
  const params = info?.params || info || {}
  const base = params.base || {}
  const config = params.config || {}
  const data = params.data || []

  // 获取外层样式（包含 outerMargin 和背景配置）
  const outerStyle = useMemo(() => {
    return getGlobalBaseStyle(base.outerMargin)
  }, [base])

  // 根据 base.proportion / config.ratio 得到比例 class，用 aspect-ratio mixin 渲染
  const videoWrapClass = useMemo(() => {
    if (config.ratio === 'square') return 'wgt-film__video-wrap--1-1'
    if (config.ratio === 'rectangle') return 'wgt-film__video-wrap--16-9'
    const proportion = base.proportion ?? 0
    const key = RATIO_CLASS_MAP[proportion] || RATIO_CLASS_MAP[0]
    return `wgt-film__video-wrap--${key}`
  }, [base.proportion, config.ratio])

  const objectFit = config.ratio === 'square' ? 'cover' : 'contain'

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
      <View className={classNames('wgt-film__video-wrap', videoWrapClass)}>
        <View className='wgt-film__video-inner'>
          <Video
            className='flim-video'
            direction={90}
            src={data[0].url}
            controls
            objectFit={objectFit}
          />
        </View>
      </View>
    </View>
  )
}

WgtFilm.options = {
  addGlobalClass: true
}

export default React.memo(WgtFilm)
