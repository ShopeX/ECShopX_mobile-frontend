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
import { View, Image, Text, Button, Progress } from '@tarojs/components'

import './index.scss'

export default class BargainItem extends Component {
  static defaultProps = {
    info: {}
  }

  constructor(props) {
    super(props)
  }

  handleItem = () => {
    const { info } = this.props
    Taro.navigateTo({
      url: `/boost/pages/detail/index?bargain_id=${info.bargain_id}`
    })
  }

  render() {
    const { info } = this.props
    return (
      <View className='bargainItem'>
        <Image className='img' src={info.item_pics} mode='aspectFill' />
        <View className='info'>
          <View className='title'>{info.item_name}</View>
          <View className='price'>
            <Text className='text'>¥{info.mkt_price}</Text>
            <Text className='text diff'>砍价立减：¥{info.diff_price}</Text>
          </View>
          {/* <View className='progress'>
            <Progress percent={20} activeColor='#a2564c' backgroundColor='#f0eeed' strokeWidth={6} active />
            <View className='interval'>
              <Text className='text'>¥{ info.mkt_price }</Text>
              <Text className='text'>¥{ info.price }</Text>
            </View>
          </View> */}
        </View>
        <View className='act'>
          <Button size='mini' className='btn' onClick={this.handleItem.bind(this)}>
            查看详情
          </Button>
        </View>
      </View>
    )
  }
}
