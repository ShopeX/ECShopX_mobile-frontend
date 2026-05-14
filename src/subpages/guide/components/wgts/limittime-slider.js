/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { classNames } from '@/utils'
import { $t, i18n } from '@/i18n'
import { linkPage } from './helper'
import './limittime-slider.scss'

export default class WgtLimittimeSlider extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)

    this.state = {
      curIdx: 0
    }
  }

  componentDidMount() {
    this._onLanguageChanged = () => this.forceUpdate()
    i18n.on('languageChanged', this._onLanguageChanged)
  }

  componentWillUnmount() {
    if (this._onLanguageChanged) {
      i18n.off('languageChanged', this._onLanguageChanged)
    }
  }

  handleClickItem = linkPage

  handleSwiperChange = (e) => {
    const { current } = e.detail

    this.setState({
      curIdx: current
    })
  }

  render() {
    const { info } = this.props
    const { curIdx } = this.state

    if (!info) {
      return null
    }

    const { config, base, data } = info
    const curContent = (data[curIdx] || {}).content

    return (
      <View className={`wgt wgt-limit ${base.padded ? 'wgt__padded' : null}`}>
        <View className='wgt-limit__header'>
          <View className='wgt-limit__title'>
            {$t('154374b8.7a6f17')}
            {base.title}
          </View>
          <View className='wgt-limit__subtitle'>
            {$t('154374b8.8e79fe')}
            {base.subtitle}
          </View>
        </View>
        <View className={`slider-wrap ${config.padded ? 'padded' : ''}`}>
          <Swiper
            className='slider-img'
            style={`height: ${Taro.pxTransform(config.height * 2)}`}
            circular
            autoplay
            current={curIdx}
            interval={config.interval}
            duration={300}
            onChange={this.handleSwiperChange}
          >
            {data.map((item, idx) => {
              return (
                <SwiperItem
                  key={idx}
                  className={`slider-item ${config.rounded ? 'rounded' : null}`}
                >
                  <View
                    style={`padding: 0 ${Taro.pxTransform(config.sliderSpace || 0)}`}
                    onClick={this.handleClickItem.bind(this, item)}
                  >
                    <Image mode='widthFix' className='slider-item__img' src={item.imgUrl} />
                  </View>
                </SwiperItem>
              )
            })}
          </Swiper>

          {data.length > 1 && config.dot && (
            <View
              className={classNames(
                'slider-dot',
                { 'dot-size-switch': config.animation },
                config.dotLocation,
                config.dotCover ? 'cover' : 'no-cover',
                config.dotColor,
                config.shape
              )}
            >
              {data.map((dot, dotIdx) => (
                <View
                  className={classNames('dot', { active: curIdx === dotIdx })}
                  key={dotIdx}
                ></View>
              ))}
            </View>
          )}

          {data.length > 1 && !config.dot && (
            <View
              className={classNames(
                'slider-count',
                config.dotLocation,
                config.shape,
                config.dotColor
              )}
            >
              {curIdx + 1}/{data.length}
            </View>
          )}
        </View>
        {config.content && data.length > 0 && <Text className='slider-caption'>{curContent}</Text>}
      </View>
    )
  }
}
