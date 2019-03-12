import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { SpToast } from '@/components'

import S from '@/spx'
import api from '@/api'

import './login.scss'

export default class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      isVisible: false,
      urlBack: ''
    }
  }

  handleClickReg= () => {
    Taro.navigateTo({
      url: `/pages/auth/reg`
    })
  }
  componentDidMount() {
    const { redirect } = this.$router.params
    this.setState({
      urlBack: redirect
    })
    console.log(this.$router, this.$router.params, redirect, 44)
  }

  handleSubmit = async (e) => {
    const { value } = e.detail
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
    console.log(data, 19)
    await api.user.login(data).then(res => {
      const { urlBack } = this.state
      S.setAuthToken(res.token)
      console.log(res, 43)
      Taro.redirectTo({
        url: urlBack
      })
    })
  }

  handleChange = (name, val) => {
    const { info } = this.state
    info[name] = val
    console.log(info)
  }

  handleClickIconpwd = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible,
    });
  }

  handleErrorToastClose = () => {
    S.closeToast()
  }

  handleClickForgtPwd = () => {
    Taro.navigateTo({
      url: `/pages/auth/forgotpwd`
    })
  }

  render () {
    const { info, isVisible } = this.state

    return (
      <View className='auth-login'>
        <View className='auth-login__reg' onClick={this.handleClickReg}>快速注册</View>
        <AtForm
          onSubmit={this.handleSubmit}
        >
          <View className='sec auth-login__form'>
            <AtInput
              title='手机号码'
              name='username'
              maxLength={11}
              value={info.mobile}
              placeholder='请输入手机号码'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'username')}
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
              {
                isVisible
                  ? <View className='sp-icon sp-icon-yanjing icon-pwd' onClick={this.handleClickIconpwd}> </View>
                  : <View className='sp-icon sp-icon-icon6 icon-pwd' onClick={this.handleClickIconpwd}> </View>
              }
              <Text className='forgotPwd' onClick={this.handleClickForgtPwd}>忘记密码</Text>
            </AtInput>
          </View>

          <View className='btns'>
            {
              Taro.getEnv() === 'WEAPP'
                ? <AtButton type='primary' formType='submit'>登录</AtButton>
                : null
            }
            {
              Taro.getEnv() === 'WEB'
                ? <AtButton type='primary' onClick={this.handleSubmit} formType='submit'>登录</AtButton>
                : null
            }
          </View>
        </AtForm>
        <SpToast />
      </View>
    )
  }
}
