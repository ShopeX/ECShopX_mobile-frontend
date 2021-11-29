import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components'

import './goods-scroll.scss'

export default class WgtGoodsScroll extends Component {
  static options = {
    addGlobalClass: true,
    info: null
  }

  navigateTo(url) {
    Taro.navigateTo({ url })
  }

  handleClickItem = (item, index) => {
    const url = `/guide/item/espier-detail?id=${item.goodsId}`
    Taro.navigateTo({
      url
    })
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
            <View className='wgt__more' onClick={this.navigateTo.bind(this, '/guide/item/list')}>
              <View className='three-dot'></View>
            </View>
          </View>
        )}
        <View className='wgt-body'>
          <ScrollView className='scroll-goods' scrollX>
            {data.map((item, idx) => (
              <View
                key={idx}
                className='scroll-item'
                onClick={this.handleClickItem.bind(this, item, idx)}
              >
                {config.leaderboard && (
                  <View className='subscript'>
                    <View className='subscript-text'>NO.{idx + 1}</View>
                    <Image className='subscript-img' src='/assets/imgs/paihang.png' />
                  </View>
                )}
                <View className='thumbnail'>
                  <Image className='goods-img' src={item.imgUrl} mode='aspectFill' />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }
}
