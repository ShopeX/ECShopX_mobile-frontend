/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/home/wgts/store.js
 * @Date: 2020-07-08 20:08:58
 * @LastEditors: Arvin
 * @LastEditTime: 2021-01-08 18:09:32
 */
import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, ScrollView } from '@tarojs/components'
import './store.scss'

export default class WgtStore extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)
  }

  handleStoreClick = (id) => {
    const url = `/pages/store/index?id=${id}`
    Taro.navigateTo({
      url
    })
  }

  handleGoodsClick = (item) => {
    const url = `/pages/item/espier-detail?id=${item.goodsId}&dtid=${item.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  render() {
    const { info } = this.props
    if (!info) {
      return null
    }

    const { config, base, data } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>{base.title}</View>
            <View className='wgt__subtitle'>{base.subtitle}</View>
          </View>
        )}
        {data.map((item) => (
          <View className='store-wrap'>
            <View className='store-info' onClick={this.handleStoreClick.bind(this, item.id)}>
              <Image className='store-logo' src={item.logo} lazyLoad mode='scaleToFill' />
              <View className='store-name'>{item.name}</View>
            </View>
            <ScrollView scrollX className='store-goods'>
              {item.items.map((goods) => (
                <View
                  className='store-goods__item'
                  onClick={this.handleGoodsClick.bind(this, goods)}
                >
                  <Image
                    className='store-goods__item-thumbnail'
                    src={goods.imgUrl}
                    mode='scaleToFill'
                    lazyLoad
                  />
                  <View className='store-goods__item-price'>¥{(goods.price / 100).toFixed(2)}</View>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </View>
    )
  }
}
