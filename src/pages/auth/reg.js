import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
// import { SpCell } from '@/components'
import S from '@/spx'
import api from '@/api'

import './reg.scss'

export default class Reg extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {}
    }
  }

  handleSubmit = (e) => {
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
    const { UserInfo } = api.user.reg(data)
    console.log(UserInfo)
  }

  handleChange = (name, val) => {
    const { info } = this.state
    info[name] = val
    console.log(info)
  }

  handleClickAgreement = () => {
    console.log("用户协议")
  }

  render () {
    const { info } = this.state

    return (
      <View className='address-edit'>
        <AtForm
          onSubmit={this.handleSubmit}
        >
          <View className='sec address-edit__form'>
            <AtInput
              title='手机号码'
              name='mobile'
              maxLength={11}
              value={info.mobile}
              onChange={this.handleChange.bind(this, 'mobile')}
            />
            <AtInput
              title='验证码'
              name='code'
              value={info.code}
              onChange={this.handleChange.bind(this, 'code')}
            />
            <AtInput
              title='密码'
              name='password'
              value={info.password}
              onChange={this.handleChange.bind(this, 'password')}
            />
          </View>

          <View className='btns'>
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
        </AtForm>
      </View>
    )
  }
}
