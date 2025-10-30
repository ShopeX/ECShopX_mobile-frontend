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
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import { normalizeQuerys } from '@/utils'

import './landing.scss'

@connect(
  () => ({}),
  (dispatch) => ({
    onUserLanding: (land_params) => dispatch({ type: 'user/landing', payload: land_params })
  })
)
export default class Landing extends Component {
  $instance = getCurrentInstance()
  constructor(props) {
    super(props)

    this.state = {
      ...this.state
    }
  }
  async componentDidMount() {
    const query = await normalizeQuerys(this.$instance.router.params)

    this.props.onUserLanding(query)

    this.fetch()
  }

  async fetch() {
    Taro.redirectTo({
      url: '/subpages/auth/reg'
    })
  }

  render() {
    return (
      <View className='page-member-integral'>
        <View>跳转中...</View>
      </View>
    )
  }
}
