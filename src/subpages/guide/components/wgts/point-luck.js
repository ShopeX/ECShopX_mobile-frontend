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
import { View, Text } from '@tarojs/components'
import { AtNoticebar } from 'taro-ui'
import api from '@/api'
import { maskMobile, formatTime } from '@/utils'

export default class PointLuck extends Component {
  constructor(props) {
    super(props)
    this.state = {
      announce: null
    }
  }

  componentDidMount() {
    // this.fetch()
  }

  async fetch() {
    const { list } = await api.member.pointDrawLuckAll()
    const announce = list
      .map(
        (t) =>
          `[${formatTime(t.created * 1000)}] 恭喜${t.username} ${maskMobile(t.mobile)} 获得了 ${
            t.item_name
          }`
      )
      .join('　　')
    this.setState({
      announce
    })
  }

  render() {
    const { announce } = this.state
    if (!announce) {
      return null
    }

    return (
      <View className='wgt'>
        <View className='wgt-body with-padding'>
          <AtNoticebar marquee>
            <Text>{announce}</Text>
          </AtNoticebar>
        </View>
      </View>
    )
  }
}
