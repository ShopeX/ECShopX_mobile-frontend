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
import { View, OfficialAccount } from '@tarojs/components'
import { connect } from 'react-redux'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class AccountOfficial extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    isLink: false,
    value: null,
    border: true,
    title: '',
    arrow: 'right',
    onClick: () => {},
    onHandleError: () => {}
  }
  constructor(props) {
    super(props)

    this.state = {
      isShowAccount: false
    }
  }
  componentDidMount() {}

  componentDidShow() {
    this.handleClickError()
    this.handleClickLoad()
  }

  handleClickClose = () => {
    this.props.onClick()
  }

  handleClickLoad = (res) => {
    console.log('res', res)
    if (res && res.detail) {
      this.setState({
        isShowAccount: true
      })
      let status_cur = res.detail.status
      this.props.onHandleError(status_cur)
    }
  }

  handleClickError = (error) => {
    console.log('error', error)
    if (error && error.detail) {
      let status_cur = error.detail.status
      this.props.onHandleError(status_cur)
    }
  }

  render() {
    const { isShowAccount } = this.state
    const { colors, isClose } = this.props
    return (
      <View className='account-view'>
        {isShowAccount && isClose && (
          <View
            className='zoom-btn icon-close iconfont'
            onClick={this.handleClickClose.bind(this)}
          ></View>
        )}
      </View>
    )
  }
}
