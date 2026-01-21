/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState, useEffect, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'
import { AtNoticebar } from 'taro-ui'
import { getGlobalBaseStyle } from '../helper'
import './index.scss'

function WgtMarquees(props) {
  const { info } = props
  const [announce, setAnnounce] = useState(null)

  // 从 params 中获取配置和数据，兼容两种数据结构
  // 1. 新结构：info.params.config, info.params.data, info.params.base
  // 2. 旧结构：info.config, info.data, info.base
  const params = info?.params || info || {}
  const base = params.base || {}
  const config = params.config || {}
  const data = params.data || []

  useEffect(() => {
    // 横向滚动时，将多个标题拼接成一个字符串
    if (config.direction === 'horizontal' && data && data.length > 0) {
      const announceText = data.map((t) => t.title).join('　　')
      setAnnounce(announceText)
    }
  }, [config.direction, data])

  // 获取外层样式（包含 outerMargin 和背景配置）
  const outerStyle = useMemo(() => {
    return getGlobalBaseStyle(base.outerMargin)
  }, [base])

  const handleClickItem = (id) => {
    if (id) {
      Taro.navigateTo({
        url: `/pages/recommend/detail?id=${id}`
      })
    }
  }

  if (!info || !data || data.length === 0) {
    return null
  }

  return (
    <View
      className={classNames('wgt wgt-marquees', {
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
        className='wgt-body'
        style={styleNames({
          background: config.bgcolor
        })}
      >
        {config.direction === 'vertical' && (
          <Swiper className='marquees' autoplay circular interval={5000} duration={300} vertical>
            {data.map((item, idx) => (
              <SwiperItem key={`marquees-item__${idx}`} className='marquees-item'>
                <View
                  className='item-text'
                  style={styleNames({
                    color: config.fontcolor
                  })}
                  onClick={() => handleClickItem(item.id)}
                >
                  {item.title}
                </View>
              </SwiperItem>
            ))}
          </Swiper>
        )}

        {config.direction === 'horizontal' && (
          <AtNoticebar marquee speed={30}>
            <View
              style={styleNames({
                color: config.fontcolor
              })}
            >
              {announce}
            </View>
          </AtNoticebar>
        )}
      </View>
    </View>
  )
}

WgtMarquees.options = {
  addGlobalClass: true
}

export default React.memo(WgtMarquees)
