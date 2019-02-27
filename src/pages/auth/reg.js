import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { SpToast, Timer } from '@/components'
import S from '@/spx'
import api from '@/api'

import './reg.scss'

export default class Reg extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      timerMsg: '获取验证码',
      isForgot: false,
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { forgot } = this.$router.params
    console.log(forgot)
    if(forgot){
      this.setState({
        isForgot: true,
      });
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
    console.log(info)
  }

  handleErrorToastClose = () => {
    S.closeToast()
  }

  handleSendCode = async () => {
    const { mobile } = this.state.info

    if (!/1\d{10}/.test(mobile)) {
      S.toast('请输入正确的手机号')
      return false
    }

    // try {
    //   await api.sendMobileCode(mobile)
    // } catch (e) {
    //   console.log(e)
    // }

    // return true

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

  handleClickAgreement = () => {
    console.log("用户协议")
  }

  render () {
    const { info, timerMsg, isForgot } = this.state

    return (
      <View className='auth-reg'>
        <AtForm
          onSubmit={this.handleSubmit}
        >
          <View className='sec auth-reg__form'>
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
                onStart={this.handleSendCode}
                onUpdateTimer={this.handleUpdateTimer}
                onStop={this.handleTimerStop}
                timerMsg={timerMsg}
              >
              </Timer>
            </AtInput>
            <AtInput
              title='密码'
              name='password'
              value={info.password}
              placeholder='请输入密码'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'password')}
            />
          </View>
          {
            isForgot
              ? <View className='btns'>
                  <AtButton type='primary' formType='submit'>确认</AtButton>
                </View>
              : <View className='btns'>
                <AtButton type='primary' formType='submit'>同意协议并注册</AtButton>
                  <View className='accountAgreement'>
                    已阅读并同意
                    <Text
                      className='accountAgreement__text'
                      onClick={this.handleClickAgreement.bind(this)}
                    >
                      《用户协议》
                    </Text>
                  </View>
                </View>
          }

        </AtForm>
        <SpToast />
      </View>
    )
  }
}
