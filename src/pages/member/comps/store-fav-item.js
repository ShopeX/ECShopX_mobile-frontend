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
import { View, Image } from '@tarojs/components'
import api from '@/api'

import './store-fav-item.scss'

export default class StoreFavItem extends Component {
  static defaultProps = {
    onClick: () => {}
  }

  handleFavRemove = async (id) => {
    const { confirm } = await Taro.showModal({
      title: '提示',
      content: `确认取消关注当前店铺吗`,
      confirmColor: '#0b4137',
      confirmText: '确认',
      cancelText: '取消'
    })
    if (!confirm) return
    const { status } = await api.member.storeFavDel(id)
    if (status) {
      console.log(this.props)
      this.props.onCancel()
    }
  }

  render() {
    const { info, onClick } = this.props

    return (
      <View className='fav-store__item'>
        <View className='fav-store__item-flex' onClick={onClick}>
          <Image className='fav-store__item-brand' src={info.logo} mode='aspectFill' />
          <View className='fav-store__item-info'>
            <View className='store-name'>{info.name}</View>
            <View className='store-fav-count'>{info.fav_num}人关注</View>
          </View>
        </View>
        <View
          className='fav-store__item-cancel'
          onClick={this.handleFavRemove.bind(this, info.distributor_id)}
        >
          取消关注
        </View>
      </View>
    )
  }
}
