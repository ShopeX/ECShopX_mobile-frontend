import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'
import { AtNoticebar } from 'taro-ui'

import './marquees.scss'

export default class WgtMarquees extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)

    this.state = {
      announce: null
    }
  }

  componentDidMount() {
    const { info } = this.props
    const { config, data } = info

    if (config.direction === 'horizontal') {
      const announce = data.map((t) => t.title).join('　　')
      this.setState({
        announce
      })
    }
  }

  handleClickItem = (id) => {
    if (id) {
      Taro.navigateTo({
        url: `/subpage/pages/recommend/detail?id=${id}`
      })
    }
  }

  render() {
    const { info } = this.props

    if (!info) {
      return null
    }
    const { config, base, data } = info
    const { announce } = this.state

    return (
      <View
        className={classNames(`wgt wgt-marquees`, {
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
        <View className='wgt-body' style={styleNames({
          background: config.bgcolor
        })}>
          {
            config.direction === 'vertical' && <Swiper
              className='marquees'
              autoplay
              circular
              interval={5000}
              duration={300}
              vertical={config.direction}
            >
              {data.map((item, idx) => (
                <SwiperItem key={`marquees-item__${idx}`} className='marquees-item'>
                  <View
                    className='item-text'
                    style={styleNames({
                      color: config.fontcolor
                    })}
                    onClick={this.handleClickItem.bind(this, item.id)}
                  >
                    {item.title}
                  </View>
                </SwiperItem>
              ))}
            </Swiper>
          }

          {
            config.direction === 'horizontal' &&
            <AtNoticebar marquee speed={30}>
              <View
                style={styleNames({
                  color: config.fontcolor
                })}
              >
                {announce}
              </View>
            </AtNoticebar>
          }

        </View>
        {/* {config.label && (
          <View
            className='marquees-label'
            style={styleNames({
              color: config.labelcolor
            })}
          >
            <Text className='iconfont icon-tongzhituiguang'></Text>
            {config.label}
          </View>
        )} */}
        {/* {config.direction === 'vertical' ? ( */}

        {/* ) : (
          <View
            style={styleNames({
              background: config.bgcolor,
              color: config.fontcolor
            })}
          >
            <AtNoticebar marquee>
              <View
                style={styleNames({
                  color: config.fontcolor
                })}
              >
                {announce}
              </View>
            </AtNoticebar>
          </View>
        )} */}
      </View>
    )
  }
}
