import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { CompOtherLogin } from './comps'
import { SpNavBar, SpTimer, SpPage } from '@/components'
import api from '@/api'
import S from '@/spx'
import { classNames, navigateTo, validate, showToast } from '@/utils'
import './login.scss'

export default class Login extends Component {
  $instance = getCurrentInstance()
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      isVisible: false,
      imgInfo: null,
      loginType: 1 // 1=密码; 2=验证码
    }
  }

  componentDidMount () {
    this.getImageVcode()
  }

  navigateTo = navigateTo

  handleTimerStart = async (resolve) => {
    const { imgInfo } = this.state
    const { mobile, yzm } = this.state.info
    if (!validate.isMobileNum(mobile)) {
      showToast('请输入正确的手机号')
      return
    }
    if (!validate.isRequired(yzm)) {
      showToast('请输入图形验证码')
      return
    }
    try {
      await api.user.regSmsCode({
        type: 'login',
        mobile: mobile,
        yzm: yzm,
        token: imgInfo.imageToken
      })
      showToast('验证码已发送')
      resolve()
    } catch (e) {
      this.getImageVcode()
    }
  }

  handleTimerStop () {}

  handleInputChange (name, val) {
    const { info } = this.state
    info[name] = val
    this.setState({
      info
    })
  }

  handleNavLeftItemClick = () => {
    Taro.redirectTo({
      url: process.env.APP_HOME_PAGE
    })
  }

  handleToggleLogin = () => {
    const { loginType } = this.state
    this.setState({
      loginType: loginType == 1 ? 2 : 1
    })
  }

  getImageVcode = async () => {
    const img_res = await api.user.regImg({ type: 'login' })
    this.setState({
      imgInfo: img_res
    })
  }

  async handleSubmit () {
    const { loginType } = this.state
    const { mobile, password, vcode } = this.state.info
    let params = {
      username: mobile
    }
    if (!validate.isMobileNum(mobile)) {
      showToast('请输入正确的手机号')
      return
    }
    if (loginType == 1) {
      if (!validate.isRequired(password)) {
        showToast('请输入密码')
        return
      }
      params['password'] = password
    } else {
      if (!validate.isRequired(vcode)) {
        showToast('请输入验证码')
        return
      }
      params['vcode'] = vcode
      params['check_type'] = 'mobile'
    }

    try {
      const { token } = await api.user.login(params)
      if (token) {
        S.setAuthToken(token)
        const { redirect } = this.$instance.router.params
        const url = redirect ? decodeURIComponent(redirect) : process.env.APP_HOME_PAGE

        Taro.redirectTo({
          url
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  render () {
    const { info, loginType, imgInfo } = this.state
    return (
      <SpPage
        className={classNames('page-auth-login')}
        onClickLeftIcon={this.handleNavLeftItemClick}
      >
        <View className='auth-hd'>
          <View className='title'>欢迎登录</View>
          <View className='desc'>使用已注册的手机号登录</View>
        </View>
        <View className='auth-bd'>
          <View className='form-title'>中国大陆 +86</View>
          <AtForm className='form'>
            <View className='form-field'>
              <AtInput
                clear
                name='mobile'
                maxLength={11}
                type='tel'
                value={info.mobile}
                placeholder='请输入您的手机号码'
                onChange={this.handleInputChange.bind(this, 'mobile')}
              />
            </View>
            {/* 密码登录 */}
            {loginType == 1 && (
              <View className='form-field'>
                <View className='input-field'>
                  <AtInput
                    clear
                    name='password'
                    value={info.password}
                    placeholder='请输入密码'
                    onChange={this.handleInputChange.bind(this, 'password')}
                  />
                </View>
              </View>
            )}
            {/* 验证码登录，验证码超过1次，显示图形验证码 */}
            {loginType == 2 && (
              <View className='form-field'>
                <View className='input-field'>
                  <AtInput
                    clear
                    name='yzm'
                    value={info.yzm}
                    placeholder='请输入图形验证码'
                    onChange={this.handleInputChange.bind(this, 'yzm')}
                  />
                </View>
                <View className='btn-field'>
                  {imgInfo && (
                    <Image
                      className='image-vcode'
                      src={imgInfo.imageData}
                      onClick={this.getImageVcode.bind(this)}
                    />
                  )}
                </View>
              </View>
            )}
            {loginType == 2 && (
              <View className='form-field'>
                <View className='input-field'>
                  <AtInput
                    clear
                    name='vcode'
                    value={info.vcode}
                    placeholder='请输入验证码'
                    onChange={this.handleInputChange.bind(this, 'vcode')}
                  />
                </View>
                <View className='btn-field'>
                  <SpTimer
                    onStart={this.handleTimerStart.bind(this)}
                    onStop={this.handleTimerStop}
                  />
                </View>
              </View>
            )}
            <View className='btn-text-group'>
              <Text className='btn-text' onClick={this.handleToggleLogin.bind(this)}>
                {loginType == 1 ? '验证码登录' : '密码登录'}
              </Text>
              <Text
                className='btn-text forgot-password'
                onClick={() => Taro.navigateTo({ url: '/subpage/pages/auth/reg' })}
              >
                忘记密码？
              </Text>
            </View>
            <View className='form-submit'>
              <AtButton
                circle
                type='primary'
                className='login-button'
                onClick={this.handleSubmit.bind(this)}
              >
                登 录
              </AtButton>
              <AtButton
                circle
                type='primary'
                className='reg-button'
                onClick={this.handleSubmit.bind(this)}
              >
                注 册
              </AtButton>
            </View>
          </AtForm>
        </View>
        <View className='other-login'>
          <CompOtherLogin />
        </View>
      </SpPage>
    )
  }
}
