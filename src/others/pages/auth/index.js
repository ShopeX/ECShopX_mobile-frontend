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
import { Loading } from '@/components'
import api from '@/api'
import S from '@/spx'
import { normalizeQuerys, getAppId } from '@/utils'

import './index.scss'

export default class AuthLogin extends Component {
  $instance = getCurrentInstance()
  constructor(props) {
    super(props)
    this.state = {
      showAuth: false
    }
  }

  componentDidMount() {
    if (!S.getAuthToken()) {
      S.toast('请先登录')
      setTimeout(() => {
        S.login(this)
      }, 2000)
      return
    }
    this.scanCode()
  }

  // 扫码
  scanCode = async () => {
    let { token, scene } = this.$instance.router.params
    if (!token && scene) {
      const { t } = await normalizeQuerys(this.$instance.router.params)
      token = t
    }
    const { code } = await Taro.login()
    const appid = getAppId()
    try {
      const { status } = await api.user.codeAuth({
        code,
        token,
        appid
      })
      if (status) {
        this.setState({
          showAuth: true
        })
        return false
      }
    } catch (e) {}
    setTimeout(() => {
      this.cancel()
    }, 1500)
  }

  // 确认登录
  comfimLogin = async () => {
    let { token, scene } = this.$instance.router.params
    if (!token && scene) {
      const { t } = await normalizeQuerys(this.$instance.router.params)
      token = t
    }
    const { code } = await Taro.login()
    const appid = getAppId()
    try {
      Taro.showLoading({
        title: '授权中'
      })
      const { status } = await api.user.codeAuthConfirm({
        code,
        token,
        appid: extConfig.appid,
        status: 1
      })
      if (status) {
        Taro.hideLoading()
        Taro.showToast({
          title: '授权成功',
          mask: true
        })
      }
    } catch (e) {}
    Taro.hideLoading()
    setTimeout(() => {
      this.cancel()
    }, 1500)
  }

  cancel = () => {
    const pages = Taro.getCurrentPages()
    if (pages.length > 1) {
      Taro.navigateBack()
    } else {
      Taro.redirectTo({
        url: '/pages/index'
      })
    }
  }

  render() {
    const { showAuth } = this.state
    const user = Taro.getStorageSync('userinfo')

    if (!showAuth) {
      return <Loading />
    }

    return (
      <View className='authLogin'>
        <View className='welcome'>尊敬的{user.username}</View>
        <View className='content'>您即将在门店大屏登录并在门店进行购物，请您确认是否登录</View>
        <View className='btnGroup'>
          <View className='comfirm' onClick={this.comfimLogin.bind(this)}>
            确认
          </View>
          <View className='cancel' onClick={this.cancel.bind(this)}>
            取消
          </View>
        </View>
      </View>
    )
  }
}
