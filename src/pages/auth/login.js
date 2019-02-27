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
    }
  }

  handleClickReg= () => {
    Taro.navigateTo({
      url: `/pages/auth/reg`
    })
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

    if (!data.code) {
      return S.toast('请选择验证码')
    }

    if (!data.password) {
      return S.toast('请输入密码')
    }
    console.log(data, 19)
    // const { UserInfo } = await api.user.reg(data)
    // console.log(UserInfo)
  }

  handleChange = (name, val) => {
    const { info } = this.state
    info[name] = val
    console.log(info)
  }

  handleErrorToastClose = () => {
    S.closeToast()
  }

  handleClickForgtPwd = () => {
    Taro.navigateTo({
      url: `/pages/auth/reg?forgot=forgot`
    })
  }

  render () {
    const { info } = this.state

    return (
      <View className='auth-login'>
        <View className='auth-login__reg' onClick={this.handleClickReg}>快速注册</View>
        <AtForm
          onSubmit={this.handleSubmit}
        >
          <View className='sec auth-login__form'>
            <AtInput
              title='手机号码'
              name='mobile'
              maxLength={11}
              value={info.mobile}
              placeholder='请输入手机号码'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'mobile')}
            />
            <AtInput
              title='验证码'
              name='code'
              value={info.code}
              placeholder='请输入验证码'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'code')}
            >
              <Text className='forgotPwd' onClick={this.handleClickForgtPwd}>忘记密码</Text>
            </AtInput>
          </View>

          <View className='btns'>
            <AtButton type='primary' formType='submit'>登录</AtButton>
          </View>
        </AtForm>
        <SpToast />
      </View>
    )
  }
}
