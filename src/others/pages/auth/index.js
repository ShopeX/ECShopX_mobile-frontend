/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Loading, SpPage } from '@/components'
import api from '@/api'
import S from '@/spx'
import { normalizeQuerys, getAppId } from '@/utils'
import { $t, ti } from '@/i18n'

import './index.scss'

export default class AuthLogin extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)
    this.state = {
      showAuth: false
    }
  }

  componentDidMount() {
    if (!S.getAuthToken()) {
      S?.toast($t('10293ac1.8d2433'))
      setTimeout(() => {
        S?.login(this)
      }, 2000)
      return
    }
    this.scanCode()
  }

  // 扫码
  scanCode = async () => {
    let { token, scene } = this.$instance?.router?.params
    if (!token && scene) {
      const { t } = await normalizeQuerys(this.$instance?.router?.params)
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
    let { token, scene } = this.$instance?.router?.params
    if (!token && scene) {
      const { t } = await normalizeQuerys(this.$instance?.router?.params)
      token = t
    }
    const { code } = await Taro.login()
    const appid = getAppId()
    try {
      Taro.showLoading({
        title: $t('d21cb6e4.93da6c')
      })
      const { status } = await api.user.codeAuthConfirm({
        code,
        token,
        appid,
        status: 1
      })
      if (status) {
        Taro.hideLoading()
        Taro.showToast({
          title: $t('d21cb6e4.68f38c'),
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

    // if (!showAuth) {
    //   return <Loading />
    // }

    return (
      <SpPage className='authLogin' loading={!showAuth}>
        <View className='min-h-full'>
          <View className='welcome'>{ti('d21cb6e4.a7603f', [user.username])}</View>
          <View className='content'>{$t('d21cb6e4.b94b2e')}</View>
          <View className='btnGroup'>
            <View className='comfirm' onClick={this.comfimLogin.bind(this)}>
              {$t('61e2d21a.e83a25')}
            </View>
            <View className='cancel' onClick={this.cancel.bind(this)}>
              {$t('61e2d21a.625fb2')}
            </View>
          </View>
        </View>
      </SpPage>
    )
  }
}
