import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { linkPage, classNames, isWeb } from '@/utils'

import './navigation.scss'

export default class WgtNavigation extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  handleClickItem = linkPage

  render() {
    const { info } = this.props

    if (!info) {
      return null
    }

    const { base, data } = info
    const { windowWidth } = isWeb ? {
      windowWidth: window.innerWidth
    } : Taro.getSystemInfoSync()
    const itemWidth = Math.floor((windowWidth * 2 - (data.length + 1) * 16) / data.length)
    // const itemWidth = 120
    if (itemWidth == 0) {
      return null
    }
    return (
      <View
        className={classNames('wgt wgt-navigation', {
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
        <View className='wgt-bd'>
          {data.map((item, idx) => (
            <View
              className='nav-item'
              key={`nav-item__${idx}`}
              onClick={this.handleClickItem.bind(this, item)}
            >
              <SpImage
                className='nav-img'
                src={item.imgUrl}
                mode='aspectFill'
                width={itemWidth}
                height={itemWidth}
              />
              <View className='nav-name'>{item.content}</View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}
