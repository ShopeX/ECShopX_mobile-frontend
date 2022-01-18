import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { CompOtherLogin } from './comps'
import { SpTimer, SpPage } from '@/components'
import { updateUserInfo, fetchUserFavs } from '@/store/slices/user'
import { connect } from 'react-redux'
import api from '@/api'
import { classNames, navigateTo, validate, showToast, tokenParseH5 } from '@/utils'
import { navigationToReg, setToken, setTokenAndRedirect } from './util'
import './login.scss'

@connect(
  ({ colors }) => ({
    colors: colors.current
  }),
  (dispatch) => ({ dispatch })
)
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
      params['check_type'] = 'password'
      params['silent'] = 1
      params['auto_register'] = 0
    } else {
      if (!validate.isRequired(vcode)) {
        showToast('请输入验证码')
        return
      }
      params['vcode'] = vcode
      params['check_type'] = 'mobile'
      params['auto_register'] = 1
    }

    params['auth_type'] = 'local'

    try {
      const { token, error_message } = await api.wx.newloginh5(params)

      const { is_new } = tokenParseH5(token)

      if (is_new === 1) {
        if (loginType === 1) {
          return showToast('当前手机号未注册，请先注册！')
        } else {
          setToken(token)
          Taro.navigateTo({
            url: `/subpages/auth/edit-password?phone=${mobile}`
          })
        }
      } else {
        if (error_message) {
          return showToast(error_message)
        }
        const self = this
        setTokenAndRedirect(token, async () => {
          await self.handleUpdateUserInfo()
        }).bind(self)
      }
    } catch (e) {
      console.log(e)
    }
  }

  handleUpdateUserInfo = async () => {
    const { dispatch } = this.props
    const _userInfo = await api.member.memberInfo()
    // 兼容老版本 后续优化
    const { username, avatar, user_id, mobile, open_id } = _userInfo.memberInfo
    Taro.setStorageSync('userinfo', {
      username: username,
      avatar: avatar,
      userId: user_id,
      isPromoter: _userInfo.is_promoter,
      mobile: mobile,
      openid: open_id,
      vip: _userInfo.vipgrade ? _userInfo.vipgrade.vip_type : ''
    })
    dispatch(updateUserInfo(_userInfo))
  }

  handleNavigateReg = async () => {
    navigationToReg()
  }

  handleForgotPsd = async () => {
    let url = '/subpages/auth/forgotpwd'
    const { mobile } = this.state.info
    if (mobile) {
      url += `?phone=${mobile}`
    }
    Taro.navigateTo({
      url
    })
  }

  render () {
    const { info, loginType, imgInfo } = this.state

    const passwordLogin = loginType == 1

    const codeLogin = loginType == 2

    //全填写完
    const isFull =
      (codeLogin && info.mobile && info.yzm && info.vcode) ||
      (passwordLogin && info.mobile && info.password)

    return (
      <SpPage
        className={classNames('page-auth-login', {
          'is-code-login': codeLogin,
          'is-full': isFull
        })}
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
                placeholderClass='input-placeholder'
              />
            </View>
            {/* 密码登录 */}
            {passwordLogin && (
              <View className='form-field'>
                <View className='input-field'>
                  <AtInput
                    clear
                    type='password'
                    name='password'
                    value={info.password}
                    placeholder='请输入密码'
                    onChange={this.handleInputChange.bind(this, 'password')}
                    placeholderClass='input-placeholder'
                  />
                </View>
              </View>
            )}
            {/* 验证码登录，验证码超过1次，显示图形验证码 */}
            {codeLogin && (
              <View className='form-field'>
                <View className='input-field'>
                  <AtInput
                    clear
                    name='yzm'
                    value={info.yzm}
                    placeholder='请输入图形验证码'
                    onChange={this.handleInputChange.bind(this, 'yzm')}
                    placeholderClass='input-placeholder'
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
            {codeLogin && (
              <View className='form-field'>
                <View className='input-field'>
                  <AtInput
                    clear
                    name='vcode'
                    value={info.vcode}
                    placeholder='请输入验证码'
                    onChange={this.handleInputChange.bind(this, 'vcode')}
                    placeholderClass='input-placeholder'
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
                {passwordLogin ? '验证码登录' : '密码登录'}
              </Text>
              <Text className='btn-text forgot-password' onClick={this.handleForgotPsd}>
                忘记密码？
              </Text>
            </View>
            <View className='form-submit'>
              <AtButton
                disabled={!isFull}
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
                onClick={this.handleNavigateReg}
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
