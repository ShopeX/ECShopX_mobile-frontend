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
import { View, Image, Text, ScrollView, Picker } from '@tarojs/components'
import { connect } from 'react-redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer } from 'taro-ui'
import { SpCell } from '@/components'
import api from '@/api'
import { pickBy, classNames } from '@/utils'

import './brand-result.scss'

@withPager
@withBackToTop
export default class BrandResult extends Component {
  constructor(props) {
    super(props)

    this.state = {
      brand_store: '',
      brand_time: ''
    }
  }

  componentDidMount() {}

  async fetch() {}

  handleClickRecord = () => {
    Taro.navigateTo({
      url: '/marketing/pages/reservation/reservation-list'
    })
  }

  render() {
    const { brand_store, brand_time } = this.state

    return (
      <View className='brand-result'>
        <View className='brand-result__title'>
          <Image
            mode='widthFix'
            className='brand-result__title_img'
            src='/assets/imgs/pay_fail.png'
          ></Image>
          <Text className='brand-result__title_status'>预约成功</Text>
          <Text className='brand-result__title_tip'>到店出示二维码即可享受服务</Text>
        </View>
        <View className='brand-result__info'>
          <SpCell title='预约门店' isLink value={brand_store}></SpCell>
          <SpCell title='预约时间' value={brand_time}></SpCell>
        </View>
        <View className='brand-result__btn' onClick={this.handleClickRecord.bind(this)}>
          我的预约记录
        </View>
        <View className='brand-result__btn cancel_btn'>取消预约</View>
      </View>
    )
  }
}
