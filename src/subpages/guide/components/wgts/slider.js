import React, { Component, useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components'
import { SpImage } from '@/components'
import { useImmer } from 'use-immer'
import { classNames } from '@/utils'
import { linkPage } from './helper'

import './slider.scss'

const initialState = {
  currentDot: 0,
  curIdx: 0,
  curContent: ''
}

function WgtSlider(props) {
  const { info } = props
  const { base, config, data } = info
  const [state, setState] = useImmer(initialState)
  const { currentDot, curIdx, curContent } = state

  useEffect(() => {
    setState((draft) => {
      draft.curContent = (data[curIdx] || {}).content
    })
  }, [curIdx])

  const handleClickItem = linkPage

  const dotChange = (e) => {
    const { current } = e.detail
    setState((draft) => {
      draft.currentDot = current
    })
  }

  const swiperChange = (e) => {
    const { current } = e.detail
    setState((draft) => {
      draft.curIdx = current
    })
  }

  if (!info) {
    return null
  }

  return (
    <View
      className={classNames('wgt wgt-slider', {
        'wgt__padded': base.padded
      })}
    >
      {base.title && (
        <View className='wgt-head'>
          <View className='wgt-hd'>
            <Text className='wgt-title'>{base.title}</Text>
            <Text className='wgt-subtitle'>{base.subtitle}</Text>
          </View>
        </View>
      )}

      {config && (
        <View
          className={classNames('slider-swiper-wrap', {
            'padded': config.padded
          })}
        >
          {data[0] && (
            <SpImage
              className={classNames('placeholder-img', {
                'rounded': config.rounded
              })}
              src={data[0].imgUrl}
            />
          )}
          <Swiper
            className='slider-img'
            circular
            autoplay
            current={curIdx}
            interval={config.interval}
            duration={300}
            onChange={dotChange}
            onAnimationFinish={swiperChange}
          >
            {data.map((item, idx) => {
              return (
                <SwiperItem key={`slider-item__${idx}`} className='slider-item'>
                  <View
                    className={classNames('wrapper-img', {
                      'rounded': config.rounded
                    })}
                    onClick={() => handleClickItem(item)}
                  >
                    <SpImage src={item.imgUrl} className='slider-item__img' lazyLoad />
                  </View>
                </SwiperItem>
              )
            })}
          </Swiper>
        </View>
      )}
      {data.length > 1 && (
        <View
          className={classNames(
            'slider-pagination',
            config.dotLocation,
            config.shape,
            config.dotColor,
            {
              'cover': !config.dotCover
            }
          )}
        >
          {config.dot &&
            data.map((dot, dotIdx) => (
              <View
                className={classNames('dot-item', { active: currentDot === dotIdx })}
                key={`dot-item__${dotIdx}`}
              ></View>
            ))}

          {!config.dot && (
            <View className='pagination-count'>
              {currentDot + 1}/{data.length}
            </View>
          )}
        </View>
      )}
      {config.content && curContent && <View className='slider-caption'>{curContent}</View>}
    </View>
  )
}

WgtSlider.options = {
  addGlobalClass: true
}

export default WgtSlider
