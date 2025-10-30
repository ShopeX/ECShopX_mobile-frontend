// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { SpGoodsItem, SpImage } from '@/components'

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
    const url = `/subpages/guide/item/espier-detail?id=${item.goodsId}`
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
            <View
              className='wgt__more'
              onClick={this.navigateTo.bind(this, '/subpages/guide/item/list')}
            >
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
                    <SpImage className='subscript-img' src='paihang.png' />
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
