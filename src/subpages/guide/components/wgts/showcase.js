import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components'
import { navigateTo } from '@/utils'
import { linkPage } from './helper'

import './showcase.scss'

export default class WgtShowCase extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  navigateTo = navigateTo

  handleClickItem(item, index) {
    linkPage(item.linkPage, item.id, item)
  }

  render() {
    const { info } = this.props
    if (!info) {
      return null
    }

    const { base, data, config } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>
              <Text>{base.title}</Text>
              <View className='wgt__subtitle'>{base.subtitle}</View>
            </View>
            <View className='wgt__more' onClick={this.navigateTo.bind(this, '/subpages/guide/item/list')}>
              <View className='three-dot'></View>
            </View>
          </View>
        )}
        <View className={`showcase-scheme-${config.style}`}>
          <View className='scheme-item'>
            <View className='layout layout-1' onClick={this.handleClickItem.bind(this, data[0], 0)}>
              <Image className='show-img' src={data[0].imgUrl} mode='scaleToFill' />
            </View>
          </View>
          <View className='scheme-item'>
            <View className='layout layout-2' onClick={this.handleClickItem.bind(this, data[1], 1)}>
              <Image className='show-img' src={data[1].imgUrl} mode='scaleToFill' />
            </View>
            <View className='layout layout-3' onClick={this.handleClickItem.bind(this, data[2], 2)}>
              <Image className='show-img' src={data[2].imgUrl} mode='scaleToFill' />
            </View>
          </View>
        </View>
      </View>
    )
  }
}
