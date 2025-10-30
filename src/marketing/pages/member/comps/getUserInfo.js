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
import { Button, View } from '@tarojs/components'

export default class GetUserInfoBtn extends Component {
  constructor(props) {
    super(props)
    this.setState({
      canIUseGetUserProfile: false
    })
  }

  componentDidMount() {
    if (wx.getUserProfile) {
      this.setState({
        canIUseGetUserProfile: true
      })
    }
  }

  static options = {
    addGlobalClass: true
  }

  // getUserProfile 新事件
  handleGetUserProfile = () => {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (data) => {
        const res = {
          detail: data
        }
        this.handleGetUserInfo(res)
      },
      fail: () => {
        this.handleGetUserInfo({})
      }
    })
  }

  handleGetUserInfo = async (res) => {
    const { onGetUserInfo } = this.props
    onGetUserInfo && onGetUserInfo(res)
  }

  render() {
    const { isGetUserInfo = false } = this.props
    const { canIUseGetUserProfile } = this.state

    return (
      <View className='btnContent'>
        {isGetUserInfo ? (
          this.props.children
        ) : (
          <View className='content'>
            {canIUseGetUserProfile ? (
              <Button
                className='getInfoBtn'
                hoverClass='none'
                onClick={this.handleGetUserProfile.bind(this)}
              >
                {this.props.children}
              </Button>
            ) : (
              <Button
                className='getInfoBtn'
                openType='getUserInfo'
                hoverClass='none'
                onGetUserInfo={this.handleGetUserInfo.bind(this)}
              >
                {this.props.children}
              </Button>
            )}
          </View>
        )}
      </View>
    )
  }
}
