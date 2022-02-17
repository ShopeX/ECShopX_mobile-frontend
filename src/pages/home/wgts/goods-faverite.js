/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/home/wgts/goods-faverite.js
 * @Date: 2020-08-03 14:15:49
 * @LastEditors: Arvin
 * @LastEditTime: 2021-01-26 18:24:32
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { GoodsItem } from '@/components'

import './goods-faverite.scss'

export default class WgtGoodsFaverite extends Component {
  static options = {
    addGlobalClass: true
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  handleClickItem = (item) => {
    const url = `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id || 0}`
    Taro.navigateTo({
      url
    })
  }

  render () {
    const { info } = this.props
    if (!info) {
      return null
    }

    return (
      <View className='wgt_faverite'>
        <View className='wgt wgt-grid'>
          <View className='wgt-head'>
            <View className='wgt-hd'>
              <Text className='wgt-title'>猜你喜欢</Text>
            </View>
          </View>
          <View className='wgt-body with-padding'>
            <View className='grid-goods out-padding grid-goods__type-grid'>
              {info.map((item) => (
                <View key={item.item_id} className='goods-list__item'>
                  <GoodsItem
                    key={item.item_id}
                    info={item}
                    onClick={() => this.handleClickItem(item)}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
