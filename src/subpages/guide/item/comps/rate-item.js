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
import { View, Text, Image } from '@tarojs/components'
import { classNames, formatTime } from '@/utils'

import './rate-item.scss'

export default class RateItem extends Component {
  static defaultProps = {
    info: null
  }

  render() {
    const { info, type } = this.props

    if (!info) {
      return null
    }

    return (
      <View className={classNames('rate-item', type ? `rate-item__type-${type}` : null)}>
        <View className='rate-item__hd'>
          <View className='rate-item__user'>
            <Text className='rate-item__user-name'>{info.user_name}</Text>
          </View>
          <Text className='rate-item__time'>{formatTime(info.reply_time * 1000)}</Text>
        </View>
        <View className='rate-item__bd'>
          <View className='rate-item__content'>
            {info.reply_content ? info.reply_content : '无评价'}
          </View>
          {info.rate_pic && info.rate_pic.length > 0 ? (
            <View className='rate-item__imgs'>
              {info.rate_pic.map((img, idx) => (
                <Image key={`${idx}1`} mode='aspectFill' className='rate-item__img' src={img} />
              ))}
            </View>
          ) : null}
        </View>
      </View>
    )
  }
}
