import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components'
import { SpImage } from '@/components'
import { classNames, linkPage } from '@/utils'
import { WgtPlateType } from './index'

import './slider.scss'

export default class WgtSlider extends Component {
  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)

    this.state = {
      currentDot: 0,
      curIdx: 0,
      index: 0
    }
  }

  static options = {
    addGlobalClass: true
  }

  handleClickItem = linkPage

  dotChange(e) {
    const { current } = e.detail
    this.setState({
      currentDot: current
    })
  }

  swiperChange = (e) => {
    const { current } = e.detail
    this.setState({
      curIdx: current
    })
  }

  render() {
    const { info } = this.props
    const { curIdx, index, currentDot } = this.state
    if (!info) {
      return null
    }
    const { config, base, data } = info
    const curContent = (data[curIdx] || {}).content
    return (
      <View
        className={classNames('wgt wgt-slider', {
          wgt__padded: base.padded
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
              onChange={this.dotChange.bind(this)}
              onAnimationFinish={this.swiperChange.bind(this)}
            >
              {data.map((item, idx) => {
                return (
                  <SwiperItem key={`slider-item__${idx}`} className='slider-item'>
                    <View
                      // style={`padding: 0 ${config.padded ? Taro.pxTransform(20) : 0}`}
                      className={classNames('wrapper-img', {
                        'rounded': config.rounded
                      })}
                      onClick={this.handleClickItem.bind(this, item)}
                    >
                      <SpImage src={item.imgUrl} lazyLoad />
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
}
