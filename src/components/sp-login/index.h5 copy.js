import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtButton } from 'taro-ui'
import S from '@/spx'
import api from '@/api'
import { showToast, classNames, navigateTo } from '@/utils'
// import { Tracker } from '@/service'
import './index.scss'

@connect(
  () => ({}),
  (dispatch) => ({
    setMemberInfo: (memberInfo) => dispatch({ type: 'member/init', payload: memberInfo })
  })
)
export default class SpLogin extends Component {
  $instance = getCurrentInstance();
  static options = {
    addGlobalClass: true
  }

  constructor(props) {
    super(props)
    this.state = {
      token: S.getAuthToken()
    }
  }

  componentDidMount() {}

  handleOnChange() {
    this.props.onChange && this.props.onChange()
  }

  handleOAuthLogin() {
    const { path } = this.$instance.router
    Taro.navigateTo({
      url: `/subpage/pages/auth/login?redirect=${encodeURIComponent(path)}`
    })
  }

  render() {
    const { token } = this.state
    return (
      <View className={classNames('sp-login', this.props.className)}>
        {token && <View onClick={this.handleOnChange.bind(this)}>{this.props.children}</View>}

        {!token && (
          <AtButton className='login-btn' onClick={this.handleOAuthLogin.bind(this)}>
            {this.props.children}
          </AtButton>
        )}
      </View>
    )
  }
}
