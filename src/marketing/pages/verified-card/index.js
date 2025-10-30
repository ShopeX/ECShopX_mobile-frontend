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
import { View, Text, Image, Navigator, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { SpNavBar } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: {}
    }
  }
  componentDidMount() {
    const { colors } = this.props
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: colors.data[0].marketing
    })
    this.fetch()
  }

  handleClick = () => {
    let { status } = this.state.info
    if (status == 3) {
      Taro.navigateTo({
        url: `/marketing/pages/verified-card/card`
      })
    } else {
      Taro.showToast({
        title: '请先实名认证',
        icon: 'none',
        duration: 2000
      })
    }
  }

  async fetch() {
    const resUser = Taro.getStorageSync('userinfo')
    const { username, avatar } = resUser
    const promoter = await api.distribution.info()
    const pInfo = pickBy(promoter, {
      shop_name: 'shop_name',
      shop_pic: 'shop_pic',
      is_open_promoter_grade: 'is_open_promoter_grade',
      promoter_grade_name: 'promoter_grade_name',
      isOpenShop: 'isOpenShop',
      shop_status: 'shop_status',
      reason: 'reason'
    })
    const res = await api.member.hfpayUserApply()
    const userInfo = pickBy(res, {
      user_name: 'user_name',
      id_card: 'id_card',
      user_mobile: 'user_mobile',
      status: 'status'
    })
    const res2 = await api.member.hfpayBankInfo()
    const bankInfo = pickBy(res2, {
      card_num: 'card_num',
      bank_id: 'bank_id',
      bank_name: 'bank_name'
    })

    let info = { username, avatar, ...pInfo }
    if (userInfo.status == 3) {
      info = { ...info, ...userInfo }
    }
    if (info.card_num) {
      info = { ...info, ...bankInfo }
    }
    this.setState({
      info
    })
  }

  render() {
    const { colors } = this.props
    const { info } = this.state

    return (
      <View className='page-distribution-index'>
        <SpNavBar title='实名认证以及绑定银行卡' leftIconType='chevron-left' />
        <View className='header' style={'background: ' + colors.data[0].marketing}>
          <View className='view-flex view-flex-middle'>
            <Image className='header-avatar' src={info.avatar} mode='aspectFill' />
            <View className='header-info view-flex-item'>
              {info.username}
              {info.is_open_promoter_grade && <Text>（{info.promoter_grade_name}）</Text>}
            </View>
            <Navigator
              className='view-flex view-flex-middle'
              url='/marketing/pages/distribution/setting'
            >
              <Text className='icon-info'></Text>
            </Navigator>
          </View>
        </View>
        <View className='section list share'>
          <Navigator
            className='list-item'
            open-type='navigateTo'
            url='/marketing/pages/verified-card/verified'
          >
            {/* <View className='item-icon icon-weChart'></View> */}
            <View className='list-item-txt'>
              实名认证
              <View className='text-primary'>
                {info.user_name ? `(已认证为"${info.user_name}")` : ''}
              </View>
            </View>
            <View className='icon-arrowRight item-icon-go'></View>
          </Navigator>
          <View className='list-item' onClick={this.handleClick}>
            {/* <View className='item-icon icon-qrcode1'></View> */}
            <View className='list-item-txt'>
              绑定银行卡
              <View className='text-primary'>
                {info.bank_name ? `(${info.bank_name}(*${info.card_num.substr(-1, 4)}))` : ''}
              </View>
            </View>
            <View className='icon-arrowRight item-icon-go'></View>
          </View>
          {/* <Navigator className='list-item' open-type='navigateTo' url={`/marketing/pages/verified-card/card`}>
                        <View className='item-icon icon-weChart'></View>
                        <View className='list-item-txt'>绑定银行卡<View className='text-primary'>{'(农业银行(*8888))'}</View></View>
                        <View className='icon-arrowRight item-icon-go'></View>
                    </Navigator> */}
        </View>
      </View>
    )
  }
}
