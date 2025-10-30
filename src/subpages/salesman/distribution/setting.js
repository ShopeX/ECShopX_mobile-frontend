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
import { View, Text } from '@tarojs/components'
import { SpNavBar } from '@/components'
import api from '@/api'

import './setting.scss'

export default class DistributionSetting extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: {},
      shop_name: '',
      isEdit: false
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    const res = await api.distribution.info()
    const { parent_info = null, bind_date, mobile, shop_name = '' } = res

    this.setState({
      info: {
        parent_info,
        bind_date,
        mobile
      },
      shop_name
    })
  }

  handleChange = (val) => {
    this.setState({
      shop_name: val
    })
  }

  handleClick = () => {
    const { isEdit, shop_name } = this.state
    this.setState({
      isEdit: !isEdit
    })
    if (isEdit) {
      api.distribution.update({ shop_name })
    }
  }

  render() {
    const { info, shop_name, isEdit } = this.state

    return (
      <View className='page-distribution-setting'>
        <SpNavBar title='会员资料' leftIconType='chevron-left' />
        <View className='content-padded'>会员资料</View>
        <View className='section'>
          <View className='list'>
            <View className='list-item'>
              <View className='label'>推荐人</View>
              <View className='list-item-txt text-right'>
                {info.parent_info ? (
                  <Text>
                    {info.parent_info.nickname || info.parent_info.username}(
                    {info.parent_info.mobile})
                  </Text>
                ) : (
                  <Text>--</Text>
                )}
              </View>
            </View>
            <View className='list-item'>
              <View className='label'>注册时间</View>
              <View className='list-item-txt text-right'>{info.bind_date}</View>
            </View>
            <View className='list-item'>
              <View className='label'>手机号</View>
              <View className='list-item-txt text-right'>
                {info.mobile ? <Text>{info.mobile}</Text> : <Text>--</Text>}
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
