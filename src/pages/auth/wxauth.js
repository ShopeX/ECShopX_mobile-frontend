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
    this.autoLogin()
  }

  async autoLogin () {
    const { code } = await Taro.login()
    try {
      const { token } = await api.wx.login({ code })
      if (!token) throw new Error(`token is not defined: ${token}`)

      S.setAuthToken(token)
      return this.redirect()
    } catch (e) {
      console.log(e)
      this.setState({
        isAuthShow: true
      })
    }
  }

  redirect () {
    const redirect = this.$router.params.redirect
    let redirect_url = redirect
      ? decodeURIComponent(redirect)
      : '/pages/member/index'

    Taro.redirectTo({
      url: redirect_url
    })
  }

  handleGetUserInfo = async (res) => {
    const loginParams = res.detail
    const { iv, encryptedData, rawData, signature, userInfo } = loginParams

    if (!iv || !encryptedData) {
      Taro.showModal({
        title: '授权提示',
        content: `需要您的授权才能购物`,
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
      const uid = Taro.getStorageSync('distribution_shop_id')
      let params = {
        code,
        iv,
        encryptedData,
        rawData,
        signature,
        userInfo
      }
      if (uid) {
        Object.assign(params, {inviter_id: uid})
      }
      const { token, open_id, union_id, user_id } = await api.wx.prelogin(params)

      S.setAuthToken(token)

      // 绑定过，跳转会员中心
      if (user_id) {
        await this.autoLogin()
        return
      }

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

  handleBackHome = () => {
    Taro.navigateBack()
  }

  render () {
    const { isAuthShow } = this.state
    const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}

    return (
      <View className='page-wxauth'>
        {isAuthShow && (
          <View className='sec-auth'>
            <View className='auth-title'>用户授权</View>
            <Text className='auth-hint'>{extConfig.wxa_name}申请获得你的公开信息（昵称、头像等）</Text>
            <View className='auth-btns'>
              <AtButton
                type='primary'
                lang='zh_CN'
                openType='getUserInfo'
                onGetUserInfo={this.handleGetUserInfo}
              >授权允许</AtButton>
              <AtButton className='back-btn' type='default' onClick={this.handleBackHome.bind(this)}>拒绝</AtButton>
            </View>
          </View>
        )}
      </View>
    )
  }
}
