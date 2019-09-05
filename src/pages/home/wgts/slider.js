import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { QnImg } from '@/components'
import { classNames } from '@/utils'
import { linkPage } from './helper'

import './slider.scss'

export default class WgtSlider extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor (props) {
    super(props)

    this.state = {
      curIdx: 0
    }
  }

  handleClickItem = linkPage

  handleSwiperChange = (e) => {
    const { current  } = e.detail

    this.setState({
      curIdx: current
    })
  }

  render () {
    const { info } = this.props
    const { curIdx } = this.state

    if (!info) {
      return null
    }
    const { config, base, data } = info
    const curContent = (data[curIdx] || {}).content

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>{base.title}</View>
            <View className='wgt__subtitle'>{base.subtitle}</View>
          </View>
        )}
        {
          config
            ? <View className={`slider-wrap ${config.padded ? 'padded' : ''}`}>
                <Image
                  mode='widthFix'
                  className='scale-placeholder'
                  src={data[0].imgUrl}
                />
                <Swiper
                  className='slider-img'
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
                          style={`padding: 0 ${config.padded ? Taro.pxTransform(20) : 0}`}
                          onClick={this.handleClickItem.bind(this, item.linkPage, item.id)}
                        >
                          <QnImg
                            img-class='slider-item__img'
                            src={item.imgUrl}
                            mode='widthFix'
                            width='500'
                            lazyLoad
                          />
                        </View>
                      </SwiperItem>
                    )
                  })}
                </Swiper>

                {data.length > 1 && config.dot && (
                  <View className={classNames('slider-dot', { 'dot-size-switch': config.animation}, config.dotLocation, config.dotCover ? 'cover' : 'no-cover', config.dotColor, config.shape)}>
                    {data.map((dot, dotIdx) =>
                      <View
                        className={classNames('dot', { active: curIdx === dotIdx })}
                        key={dotIdx}
                      ></View>
                    )}
                  </View>
                )}

                {data.length > 1 && !config.dot && (
                  <View className={classNames('slider-count', config.dotLocation, config.shape, config.dotColor)}>
                    {curIdx + 1}/{data.length}
                  </View>
                )}
              </View>
            : null
        }
        {config.content && data.length > 0 && (
          <Text className='slider-caption'>{curContent}</Text>
        )}
      </View>
    )
  }
}
