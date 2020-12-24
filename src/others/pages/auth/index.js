/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/others/pages/auth/index.js
 * @Date: 2020-10-29 15:36:41
 * @LastEditors: Arvin
 * @LastEditTime: 2020-12-24 11:12:42
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Loading } from '@/components'
import api from '@/api'
import S from '@/spx'
import { normalizeQuerys } from '@/utils'

import './index.scss'

export default class AuthLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showAuth: false
    }
  }

  componentDidMount () {
    if (!S.getAuthToken()) {
      S.toast('请先登录')
      setTimeout(() => {
        S.login(this)
      }, 2000)
      return
    }
    this.scanCode()    
  }

  // 扫码
  scanCode = async () => {
    let { token, scene } = this.$router.params
    if (!token && scene) {
      const t = normalizeQuerys(this.$router.params)
      token = t
    }
    const { code } = await Taro.login()
    const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    try {
      const { status } = await api.user.codeAuth({
        code,
        token,
        appid: extConfig.appid
      })
      if (status) {
        this.setState({
          showAuth: true
        })
        return false
      }
    } catch (e) {}
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  // 确认登录
  comfimLogin = async () => {
    let { token, scene } = this.$router.params
    if (!token && scene) {
      const t = normalizeQuerys(this.$router.params)
      token = t
    }
    const { code } = await Taro.login()
    const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}    
    try {
      Taro.showLoading({
        title: '授权中'
      })
      const { status } = await api.user.codeAuthConfirm({
        code,
        token,
        appid: extConfig.appid,
        status: 1
      })
      if (status) {
        Taro.hideLoading()
        Taro.showToast({
          title: '授权成功',
          mask: true
        })
      }
    } catch (e) {
    }
    Taro.hideLoading()
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)    
  }

  cancel = () => {
    Taro.navigateBack()
  }
  
  render () {
    const { showAuth } = this.state
    const user = Taro.getStorageSync('userinfo')

    if (!showAuth) {
      return <Loading />
    }

    return (
      <View className='authLogin'>
        <View className='welcome'>尊敬的{ user.username }</View>
        <View className='content'>
          您即将在门店大屏登录并在门店进行购物，请您确认是否登录
        </View>
        <View className='btnGroup'>
          <View className='comfirm' onClick={this.comfimLogin.bind(this)}>确认</View>
          <View className='cancel' onClick={this.cancel.bind(this)}>取消</View>
        </View>
      </View>
    )
  }
}