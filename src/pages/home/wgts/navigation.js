import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { linkPage, classNames } from '@/utils'

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

    return (
      <View
        className={classNames('wgt wgt-navigation', {
          wgt__padded: base.padded
        })}
      >
        <View className='navigation'>
          {data.map((item, idx) => (
            <View
              className='nav-item'
              key={`nav-item__${idx}`}
              onClick={this.handleClickItem.bind(this, item)}
            >
              <SpImage
                src={item.imgUrl}
                mode='aspectFill'
                className='cuscss-sp-image'
                width={120}
                height={120}
              />
              <View className='nav-name'>{item.content}</View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}
