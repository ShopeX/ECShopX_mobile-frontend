import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { SpToast, Timer } from '@/components'
import S from '@/spx'
import api from '@/api'

import './forgotpwd.scss'

export default class Forgotpwd extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      timerMsg: '获取验证码',
      isVisible: false
    }
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
    // if(this.state.isForgot){
    //
    // }
    // const { UserInfo } = await api.user.reg(data)
    // console.log(UserInfo)
  }

  handleChange = (name, val) => {
    const { info } = this.state
    info[name] = val
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

  handleTimerStart = (resolve) => {
    if (this.state.isTimerStart) return
    const { mobile } = this.state.info

    if (!/1\d{10}/.test(mobile)) {
      return S.toast('请输入正确的手机号')
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
    const { info, timerMsg, isVisible } = this.state

    return (
      <View className='auth-forgotpwd'>
        <AtForm
          onSubmit={this.handleSubmit}
        >
          <View className='sec auth-forgotpwd__form'>
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
              <Timer
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
              {
                isVisible
                  ? <View className='sp-icon sp-icon-yanjing icon-pwd' onClick={this.handleClickIconpwd}> </View>
                  : <View className='sp-icon sp-icon-icon6 icon-pwd' onClick={this.handleClickIconpwd}> </View>
              }
            </AtInput>
          </View>
          <View className='btns'>
            {
              Taro.getEnv() === 'WEAPP'
                ? <AtButton type='primary' formType='submit'>确认</AtButton>
                : null
            }
            {
              Taro.getEnv() === 'WEB'
                ? <AtButton type='primary' onClick={this.handleSubmit} formType='submit'>确认</AtButton>
                : null
            }
          </View>
        </AtForm>

        <SpToast />
      </View>
    )
  }
}
