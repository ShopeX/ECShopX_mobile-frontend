import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { CompOtherLogin, CompPasswordInput, CompInputPhone } from './comps'
import { SpTimer, SpPage } from '@/components'
import { updateUserInfo } from '@/store/slices/user'
import { connect } from 'react-redux'
import api from '@/api'
import { classNames, navigateTo, validate, showToast, tokenParseH5 } from '@/utils'
import { navigationToReg, setToken, setTokenAndRedirect, addListener } from './util'
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
      loginType: 1, // 1=密码; 2=验证码
      logoShow: true,
      is_new: false
    }
    //定时器
    this.timer = null
  }

  componentDidMount () {
    this.getImageVcode()
  }

  componentDidShow () {
    const { redirect } = this.$instance.router.params
    if (S.getAuthToken()) {
      const url = redirect ? decodeURIComponent(redirect) : '/subpages/member/index'
      window.location.href = url
    }
  }

  navigateTo = navigateTo

  handleTimerStart = async (resolve) => {
    const { imgInfo } = this.state
    const { mobile, yzm } = this.state.info
    if (!validate.isMobileNum(mobile)) {
      return showToast('请输入正确的手机号')
    }
    if (!validate.isRequired(yzm)) {
      return showToast('请输入图形验证码')
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

  handleInputChange (name, val, error) {
    const { info } = this.state
    info[name] = val
    if (name == 'mobile') {
      info.is_new = error
    }
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
    const { redirect } = this.$instance.router.params
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
      if (!validate.isPassword(password)) {
        return showToast('密码格式不正确')
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
            url: `/subpages/auth/edit-password?phone=${mobile}&redi_url=${encodeURIComponent(
              redirect
            )}`
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
    const { redirect } = this.$instance.router.params
    navigationToReg(redirect)
  }

  handleForgotPsd = async () => {
    const { redirect } = this.$instance.router.params
    let url = '/subpages/auth/forgotpwd'
    const { mobile } = this.state.info
    if (redirect) {
      url += `?redi_url=${encodeURIComponent(redirect)}`
    }
    if (mobile) {
      url += `&phone=${mobile}`
    }
    Taro.navigateTo({
      url
    })
  }

  getDevice () {
    const ua = navigator.userAgent
    const ios = /iPad|iPhone|iPod/.test(ua)
    return ios
  }

  // 键盘挡输入框
  getElementOffsetTop (el) {
    let top = el.offsetTop
    let cur = el.offsetParent
    while (cur != null) {
      top += cur.offsetTop
      cur = cur.offsetParent
    }
    return top
  }

  handleRemarkFocus = (value, event) => {
    const ios = this.getDevice()
    const dom = event.target
    setTimeout(() => {
      if (ios) {
        document.body.scrollTop = document.body.scrollHeight
      } else {
        // dom.scrollIntoView(false) 微信x5内核不支持
        const body = document.getElementsByTagName('body')[0]
        const clientHeight = body.clientHeight // 可见高
        const fixHeight = clientHeight / 3 // 自定义位置
        const offsetTop = this.getElementOffsetTop(dom)
        body.scrollTop = offsetTop - fixHeight
      }
    }, 300)
  }

  handleRemarkBlur = () => {
    const ios = this.getDevice()
    if (!ios) {
      const body = document.getElementsByTagName('body')[0]
      body.scrollTop = 0
    }
  }

  logoShow = (show) => () => {
    if (!show) {
      this.setState({
        logoShow: false
      })
    } else {
      setTimeout(() => {
        this.setState({
          logoShow: true
        })
      }, 100)
    }
  }

  render () {
    const { info, loginType, imgInfo, logoShow } = this.state

    const passwordLogin = loginType == 1

    const codeLogin = loginType == 2

    //全填写完
    const isFull =
      ((codeLogin && info.mobile && info.yzm && info.vcode) ||
        (passwordLogin &&
          info.mobile &&
          info.password &&
          info.password.length >= 6 &&
          !info.is_new)) &&
      info.mobile.length === 11

    const inputProp = {
      onFocus: this.logoShow(false),
      onBlur: this.logoShow(true)
    }

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
          {/* <View className='desc'>使用已注册的手机号登录</View> */}
        </View>
        <View className='auth-bd'>
          <AtForm className='form'>
            <View className='form-field noborder'>
              <CompInputPhone
                onChange={this.handleInputChange.bind(this, 'mobile')}
                value={info.mobile}
                needValidate={passwordLogin}
              />
            </View>
            {/* 密码登录 */}
            {passwordLogin && (
              <View className='form-field'>
                <View className='input-field'>
                  <CompPasswordInput
                    onChange={this.handleInputChange.bind(this, 'password')}
                    {...inputProp}
                    // onFocus={this.handleRemarkFocus.bind(this)}
                    // onBlur={this.handleRemarkBlur.bind(this)}
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
                    {...inputProp}
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
                    {...inputProp}
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
            {/* {passwordLogin && <View className='form-tip'>{PASSWORD_TIP}</View>} */}
            <View className='btn-text-group'>
              <Text className='btn-text' onClick={this.handleToggleLogin.bind(this)}>
                {passwordLogin ? '验证码登录' : '密码登录'}
              </Text>
              {passwordLogin && (
                <Text className='btn-text forgot-password' onClick={this.handleForgotPsd}>
                  忘记密码？
                </Text>
              )}
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
