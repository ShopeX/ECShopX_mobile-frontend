import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import S from '@/spx'
import { log } from '@/utils'

import './wxauth.scss'

export default class WxAuth extends Component {
  state = {
    isAuthShow: false
  }

  componentDidMount () {
    // this.autoLogin()
  }

  async autoLogin () {
    const { authSetting } = await Taro.getSetting()
    if (authSetting['scope.userInfo']) {
      const { code } = await Taro.login()

      try {
        const { token } = await api.wx.login({ code })
        if (token) {
          S.setAuthToken(token)
          return this.redirect()
        }
      } catch (e) {}
    }

    this.setState({
      isAuthShow: true
    })
  }

  redirect () {
    const redirect = this.$router.params.redirect
    let redirect_url = redirect
      ? decodeURIComponent(redirect)
      : '/pages/home/index'

    Taro.redirectTo({
      url: redirect_url
    })
  }

  handleGetUserInfo = async (res) => {
    const loginParams = res.detail
    const { iv, encryptedData, rawData, signature } = loginParams

    if (!iv || !encryptedData) {
      Taro.showModal({
        title: '授权提示',
        content: `${APP_NAME}需要您的授权才能正常运行`,
        showCancel: false,
        confirmText: '知道啦'
      })

      return
    }

    const { code } = await Taro.login()

    Taro.showLoading({
      mask: true,
      title: '正在加载...'
    })

    try {
      const { token, open_id, union_id } = await api.wx.prelogin({
        code,
        iv,
        encryptedData,
        rawData,
        signature
      })

      S.setAuthToken(token)
      // 跳转注册绑定
      Taro.redirectTo({
        url: `/pages/auth/reg?code=${code}&open_id=${open_id}&union_id=${union_id}`
      })
    } catch (e) {
      console.info(e)
      Taro.showToast({
        title: '授权失败，请稍后再试',
        icon: 'none'
      })
    }

    Taro.hideLoading()
  }

  render () {
    const { isAuthShow } = this.state

    return (
      <View className='page-wxauth'>
        {isAuthShow && (
          <View className='sec-auth'>
            <Text className='auth-hint'>需要您的授权才能继续</Text>
            <AtButton
              type='primary'
              openType='getUserInfo'
              onGetUserInfo={this.handleGetUserInfo}
            >点此授权</AtButton>
          </View>
        )}
      </View>
    )
  }
}
