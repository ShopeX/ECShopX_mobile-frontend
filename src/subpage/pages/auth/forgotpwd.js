import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { SpToast, SpTimer, SpNavBar } from '@/components'
import S from '@/spx'
import api from '@/api'

import './forgotpwd.scss'

export default class Forgotpwd extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      timerMsg: '获取验证码',
      isVisible: false,
      imgVisible: false,
      imgInfo: {}
    }
  }
  componentDidMount () {
    this.fetch()
  }

  handleClickImgcode = async () => {
    const query = {
      type: 'forgot_password'
    }
    try {
      const img_res = await api.user.regImg(query)
      this.setState({
        imgInfo: img_res
      })
    } catch (error) {
      return false
    }
  }

  async fetch () {
    this.handleClickImgcode()
    this.count = 0
  }

  handleSubmit = async (e) => {
    const { value } = e.detail
    const data = {
      ...this.state.info,
      ...value
    }
    if (!data.mobile || !/1\d{10}/.test(data.mobile)) {
      return S.toast('请输入正确的手机号')
    }

    if (!data.vcode) {
      return S.toast('请选择验证码')
    }

    if (!data.password) {
      return S.toast('请输入密码')
    }

    try {
      await api.user.forgotPwd(data)
      Taro.showToast({
        title: '修改成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.redirectTo({
          url: APP_AUTH_PAGE
        })
      }, 700)
    } catch (error) {
      return false
    }
  }

  handleChange = (name, val) => {
    const { info } = this.state
    info[name] = val
    if (name === 'mobile') {
      if (val.length === 11 && this.count === 0) {
        this.count = 1
        this.setState({
          imgVisible: true
        })
      }
    }
  }

  handleClickIconpwd = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible
    })
  }

  handleErrorToastClose = () => {
    S.closeToast()
  }

  handleTimerStart = async (resolve) => {
    if (this.state.isTimerStart) return
    const { mobile, yzm } = this.state.info
    const { imgInfo } = this.state

    if (!/1\d{10}/.test(mobile)) {
      return S.toast('请输入正确的手机号')
    }

    if (!(mobile.length === 11 && yzm)) {
      return S.toast('请输入手机号和图形验证码')
    }

    const query = {
      type: 'forgot_password',
      mobile: mobile,
      yzm: yzm,
      token: imgInfo.imageToken
    }

    try {
      await api.user.regSmsCode(query)
      S.toast('发送成功')
    } catch (error) {
      return false
    }

    resolve()
  }

  handleUpdateTimer = (val) => {
    const timerMsg = `${val}s`
    this.setState({
      timerMsg
    })
  }

  handleTimerStop = () => {
    this.setState({
      timerMsg: '重新获取'
    })
  }

  render () {
    const { info, timerMsg, isVisible, imgVisible, imgInfo } = this.state

    return (
      <View className='auth-forgotpwd'>
        <SpNavBar title='忘记密码' leftIconType='chevron-left' />
        <AtForm onSubmit={this.handleSubmit}>
          <View className='sec auth-forgotpwd__form'>
            <AtInput
              title='手机号码'
              name='mobile'
              type='number'
              maxLength={11}
              value={info.mobile}
              placeholder='请输入手机号码'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'mobile')}
            />
            {imgVisible ? (
              <AtInput
                title='图片验证码'
                name='yzm'
                value={info.yzm}
                placeholder='请输入图片验证码'
                onFocus={this.handleErrorToastClose}
                onChange={this.handleChange.bind(this, 'yzm')}
              >
                <Image src={`${imgInfo.imageData}`} onClick={this.handleClickImgcode} />
              </AtInput>
            ) : null}
            <AtInput
              title='验证码'
              name='vcode'
              value={info.vcode}
              placeholder='请输入验证码'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'vcode')}
            >
              <SpTimer
                onStart={this.handleTimerStart}
                onUpdateTimer={this.handleUpdateTimer}
                onStop={this.handleTimerStop}
                timerMsg={timerMsg}
              />
            </AtInput>
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
            </AtInput>
          </View>
          <View className='btns'>
            {process.env.TARO_ENV === 'weapp' ? (
              <AtButton type='primary' formType='submit'>
                确认
              </AtButton>
            ) : (
              <AtButton type='primary' onClick={this.handleSubmit} formType='submit'>
                确认
              </AtButton>
            )}
          </View>
        </AtForm>

        <SpToast />
      </View>
    )
  }
}
