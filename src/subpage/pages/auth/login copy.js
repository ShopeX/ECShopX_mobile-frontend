import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'

import { SpToast, SpNavBar } from '@/components'

import S from '@/spx'
import api from '@/api'
import { tokenParse } from '@/utils'
// import { Tracker } from '@/service'

import './login.scss'

export default class Login extends Component {
  $instance = getCurrentInstance()
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      isVisible: false
    }
  }

  handleClickReg = () => {
    Taro.navigateTo({
      url: `/subpage/pages/auth/reg`
    })
  }
  componentDidMount () {}

  handleSubmit = async (e) => {
    const { value } = e.detail || e[0].detail
    const data = {
      ...this.state.info,
      ...value
    }

    if (!data.username || !/1\d{10}/.test(data.username)) {
      return S.toast('请输入正确的手机号')
    }

    if (!data.password) {
      return S.toast('请输入密码')
    }

    try {
      const { token } = await api.user.login(data)
      S.setAuthToken(token)
      // 通过token解析openid
      if (token) {
        const userInfo = tokenParse(token)
        Tracker.setVar({
          user_id: userInfo.user_id,
          open_id: userInfo.openid,
          union_id: userInfo.unionid
        })
      }

      const redirect = decodeURIComponent(
        this.$instance.router.params.redirect || process.env.APP_HOME_PAGE
      )
      Taro.redirectTo({
        url: redirect
      })
    } catch (error) {
      return false
    }
  }

  handleChange (name, val) {
    const { info } = this.state
    info[name] = val
  }

  handleBlurMobile = (val) => {
    this.setState({
      info: {
        username: val
      }
    })
  }

  handleClickIconpwd = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible
    })
  }

  handleErrorToastClose = () => {
    // S.closeToast()
  }

  handleClickForgtPwd = () => {
    Taro.navigateTo({
      url: `/subpage/pages/auth/forgotpwd`
    })
  }

  handleNavLeftItemClick = () => {
    // const { redirect } = getCurrentInstance().params
    // if (redirect) {
    //   Taro.redirectTo({
    //     url: decodeURIComponent(redirect)
    //   })
    // }
    //
    // Taro.navigateBack()、
    Taro.redirectTo({
      url: process.env.APP_HOME_PAGE
    })
  }

  render () {
    const { info, isVisible } = this.state

    return (
      <View className='auth-login'>
        <SpNavBar onClickLeftIcon={this.handleNavLeftItemClick} title='登录' />
        <View className='auth-login__reg'>
          <Text onClick={this.handleClickReg}>快速注册</Text>
        </View>
        <AtForm>
          <View className='sec auth-login__form'>
            <AtInput
              title='手机号码'
              name='username'
              maxLength={11}
              type='tel'
              value={info.username}
              placeholder='请输入手机号码'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'username')}
              onBlur={this.handleBlurMobile.bind(this)}
            />
            <AtInput
              title='密码'
              name='password'
              type={isVisible ? 'text' : 'password'}
              value={info.password}
              placeholder='请输入密码'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'password')}
            >
              {isVisible ? (
                <View
                  className='sp-icon sp-icon-yanjing icon-pwd'
                  onClick={this.handleClickIconpwd}
                >
                  {' '}
                </View>
              ) : (
                <View className='sp-icon sp-icon-icon6 icon-pwd' onClick={this.handleClickIconpwd}>
                  {' '}
                </View>
              )}
              <Text className='forgotPwd' onClick={this.handleClickForgtPwd}>
                忘记密码
              </Text>
            </AtInput>
          </View>

          <View className='btns'>
            <AtButton type='primary' onClick={this.handleSubmit.bind(this)}>
              登录
            </AtButton>
          </View>
        </AtForm>

        <SpToast />
      </View>
    )
  }
}
