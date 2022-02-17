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

  constructor (props) {
    super(props)

    this.state = {
      curIdx: 0,
      index: 0
    }
  }

  static options = {
    addGlobalClass: true
  }

  handleClickItem = linkPage

  handleSwiperChange (e) {
    const { current } = e.detail
    this.setState({
      curIdx: current
    })
  }

  render () {
    const { info } = this.props
    const { curIdx, index } = this.state
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
        {config ? (
          <View className={`slider-wrap ${config.padded ? 'padded' : ''}`}>
            {data[0] && (
              <Image mode='widthFix' className='scale-placeholder' lazyLoad src={data[0].imgUrl} />
            )}
            <Swiper
              className='slider-img'
              circular
              autoplay
              current={curIdx}
              interval={config.interval}
              duration={300}
              onChange={this.handleSwiperChange.bind(this)}
            >
              {data.map((item, idx) => {
                return (
                  <SwiperItem
                    key={`${idx}1`}
                    className={`slider-item ${config.rounded ? 'rounded' : null}`}
                  >
                    <View
                      // style={`padding: 0 ${config.padded ? Taro.pxTransform(20) : 0}`}
                      className='wrapper-img'
                      onClick={this.handleClickItem.bind(this, item)}
                    >
                      <SpImage
                        img-class='slider-item__img'
                        src={item.imgUrl}
                        mode='widthFix'
                        width='718'
                        height='100%'
                        lazyLoad
                      />
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
                    key={`${dotIdx}1`}
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
        ) : null}
        {config.content && curContent && <View className='slider-caption'>{curContent}</View>}
      </View>
    )
  }
}
