/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtForm, AtButton } from 'taro-ui'
import { SpPage, SpInput as AtInput, SpFloatLayout } from '@/components'
import { SpTimer } from '@/subpages/components'
import { updateUserInfo } from '@/store/slices/user'
import { connect } from 'react-redux'
import S from '@/spx'
import api from '@/api'
import { classNames, navigateTo, validate, showToast, tokenParseH5 } from '@/utils'
import { CompOtherLogin, CompPasswordInput, CompInputPhone } from './comps'
import { navigationToReg, setToken, setTokenAndRedirect, addListener } from './util'
import './login.scss'

/** 注册页 redirect 带来的 email query（可能与 reg 侧 `encodeEmailForLoginQuery` 成对使用） */
function decodeLoginEmailQueryParam(raw) {
  const s = String(raw ?? '').trim()
  if (!s) return ''
  try {
    return decodeURIComponent(s.replace(/\+/g, ' '))
  } catch (e) {
    return s
  }
}

@connect(
  ({ colors }) => ({
    colors: colors.current
  }),
  (dispatch) => ({ dispatch })
)
export default class Login extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      info: {},
      isVisible: false,
      imgInfo: null,
      loginType: 1, // 1=密码; 2=验证码
      accountMode: 'mobile', // mobile | email
      logoShow: true,
      is_new: false,
      showEmailNotActivatedHint: false,
      showResendActivateModal: false,
      imgInfoActivate: null,
      resendActivateYzm: ''
    }
    //定时器
    this.timer = null
    /** 是否已从路由应用注册成功带回的 account_mode / email / mobile（避免重复覆盖） */
    this._loginRouterPrefilled = false
  }

  /** 注册成功 redirect 登录页时携带 account_mode、email、mobile；H5 部分环境下 params 在 didShow 才就绪 */
  prefillLoginFromRouter = () => {
    if (this._loginRouterPrefilled) return
    const params = getCurrentInstance()?.router?.params || this.$instance?.router?.params || {}
    const account_mode = params.account_mode
    const emailParam = params.email
    const mobileParam = params.mobile

    let nextMode = null
    if (account_mode === 'email' || account_mode === 'mobile') {
      nextMode = account_mode
    } else if (emailParam != null && String(emailParam).trim() !== '') {
      nextMode = 'email'
    } else if (mobileParam != null && String(mobileParam).trim() !== '') {
      nextMode = 'mobile'
    }

    const hasEmail = emailParam != null && String(emailParam).trim() !== ''
    const hasMobile = mobileParam != null && String(mobileParam).trim() !== ''

    if (!nextMode && !hasEmail && !hasMobile) return

    this._loginRouterPrefilled = true

    const updates = {}
    if (nextMode) {
      updates.accountMode = nextMode
    }

    const info = { ...this.state.info }
    if (hasEmail) {
      info.email = decodeLoginEmailQueryParam(emailParam)
    }
    if (hasMobile) {
      info.mobile = String(mobileParam).trim()
    }
    updates.info = info

    this.setState(updates, () => {
      this.getImageVcode()
    })
  }

  componentDidMount() {
    this.prefillLoginFromRouter()
    if (!this._loginRouterPrefilled) {
      this.getImageVcode()
    }
  }

  componentDidShow() {
    Taro.setNavigationBarTitle({ title: '登录' })
    const { redirect } = this.$instance?.router?.params
    if (S.getAuthToken()) {
      const url = redirect ? decodeURIComponent(redirect) : '/subpages/member/index'
      window.location.href = url
    }
    // 部分环境下 query 仅在 didShow 就绪，用于补一次「注册成功带回邮箱」的预填
    this.prefillLoginFromRouter()
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
    if (!imgInfo?.imageToken) {
      showToast('图形验证码未就绪，请刷新重试')
      this.getImageVcode()
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

  /** POST /member/email/code purpose=login */
  handleEmailLoginTimerStart = async (resolve) => {
    const { imgInfo } = this.state
    const { email, yzm } = this.state.info
    const emailTrim = (email || '').trim()
    if (!validate.isEmail(emailTrim)) {
      return showToast('请输入正确的电子邮箱')
    }
    if (!validate.isRequired(yzm)) {
      return showToast('请输入图形验证码')
    }
    if (!imgInfo?.imageToken) {
      showToast('图形验证码未就绪，请刷新重试')
      this.getImageVcode()
      return
    }
    try {
      await api.user.memberEmailCode({
        email: emailTrim,
        purpose: 'login',
        token: imgInfo.imageToken,
        yzm
      })
      showToast('验证码已发送')
      this.setState((prev) => ({
        info: { ...prev.info, yzm: '' }
      }))
      await this.getImageVcode()
      resolve()
    } catch (e) {
      this.getImageVcode()
    }
  }

  handleTimerStop() {}

  handleInputChange(name, val, error) {
    const { info } = this.state
    info[name] = val
    if (name == 'mobile') {
      info.is_new = error
    }
    const patch = { info }
    if (name === 'email') {
      patch.showEmailNotActivatedHint = false
    }
    this.setState(patch)
  }

  /** 从 req 拒绝结果里取文案 / code（与 req.js reqError 及后端多种包体兼容） */
  pickApiErrorMeta(err) {
    const d = err?.res?.data
    const inner = d && d.data
    const message =
      (err && err.message && String(err.message).trim()) ||
      (inner && (inner.message || inner.msg)) ||
      (d && (d.message || d.msg)) ||
      ''
    const code =
      (inner && (inner.code || inner.error_code)) || (d && (d.code || d.error_code)) || ''
    return { message: String(message || '').trim(), code: String(code || '').trim() }
  }

  /** 未激活邮箱：文案或错误码（含「邮箱未验证」等） */
  isEmailNotActivatedText(text) {
    const t = String(text || '').trim()
    if (!t) return false
    if (/email_not_verified|email_not_activated|email_must_be_verified/i.test(t)) return true
    if (
      /邮箱未验证|邮箱未激活|电子邮箱未验证|账号未验证|未验证邮箱|请先验证邮箱|尚未激活|尚未验证/i.test(
        t
      )
    )
      return true
    if (/未激活|未验证/.test(t) && /邮|邮箱|email|激活|验证/i.test(t)) return true
    if (
      /not\s*verified|not\s*activated|must\s*verify|verify\s*(your\s*)?email|complete\s*activation/i.test(
        t
      )
    )
      return true
    return false
  }

  isEmailNotActivatedError(err) {
    const { message, code } = this.pickApiErrorMeta(err)
    if (this.isEmailNotActivatedText(code)) return true
    if (this.isEmailNotActivatedText(message)) return true
    return false
  }

  getResendActivateImageVcode = async () => {
    const img_res = await api.user.regImg({ type: 'sign' })
    this.setState({ imgInfoActivate: img_res })
  }

  handleOpenResendActivateModal = async () => {
    try {
      const imgInfoActivate = await api.user.regImg({ type: 'sign' })
      this.setState({
        showResendActivateModal: true,
        imgInfoActivate,
        resendActivateYzm: ''
      })
    } catch (e) {
      showToast(e.message || '图形验证码未就绪，请刷新重试')
    }
  }

  handleCloseResendActivateModal = () => {
    this.setState({
      showResendActivateModal: false,
      imgInfoActivate: null,
      resendActivateYzm: ''
    })
  }

  handleResendActivateYzmChange = (val) => {
    this.setState({ resendActivateYzm: val })
  }

  handleConfirmResendActivate = async () => {
    const { imgInfoActivate, resendActivateYzm } = this.state
    const emailTrim = (this.state.info.email || '').trim()
    if (!validate.isEmail(emailTrim)) {
      return showToast('请输入正确的电子邮箱')
    }
    if (!validate.isRequired(resendActivateYzm)) {
      return showToast('请输入图形验证码')
    }
    if (!imgInfoActivate?.imageToken) {
      showToast('图形验证码未就绪，请刷新重试')
      this.getResendActivateImageVcode()
      return
    }
    const activationBase =
      typeof window !== 'undefined' && window.location && window.location.origin
        ? window.location.origin.replace(/\/$/, '')
        : ''
    const resendPayload = {
      email: emailTrim,
      purpose: 'activate',
      token: imgInfoActivate.imageToken,
      yzm: (resendActivateYzm || '').trim(),
      showError: false
    }
    if (activationBase) {
      resendPayload.activation_base_url = activationBase
    }
    try {
      await api.user.memberEmailCode(resendPayload)
      showToast('激活邮件已发送，请查收邮箱')
      this.handleCloseResendActivateModal()
    } catch (e) {
      showToast(e.message || '发送失败，请稍后重试')
      try {
        const img = await api.user.regImg({ type: 'sign' })
        this.setState({ imgInfoActivate: img, resendActivateYzm: '' })
      } catch (err) {
        showToast(err.message || '图形验证码未就绪，请刷新重试')
      }
    }
  }

  handleNavLeftItemClick = () => {
    try {
      Taro.navigateBack()
    } catch (e) {
      Taro.redirectTo({
        url: process.env.APP_HOME_PAGE
      })
    }
  }

  handleToggleLogin = () => {
    const { loginType } = this.state
    const next = loginType == 1 ? 2 : 1
    this.setState(
      {
        loginType: next
      },
      () => {
        if (next === 2) {
          this.getImageVcode()
        }
      }
    )
  }

  handleAccountModeChange = (accountMode) => {
    this.setState(
      (prev) => ({
        accountMode,
        showEmailNotActivatedHint: false,
        info: {
          ...prev.info,
          yzm: '',
          vcode: '',
          password: ''
        }
      }),
      () => {
        if (accountMode === 'mobile' || this.state.loginType === 2) {
          this.getImageVcode()
        }
      }
    )
  }

  getImageVcode = async () => {
    const img_res = await api.user.regImg({ type: 'login' })
    this.setState({
      imgInfo: img_res
    })
  }

  async handleSubmit() {
    const { source_id, monitor_id, latest_source_id, latest_monitor_id } =
      Taro.getStorageSync('sourceInfo') // 千人千码参数
    const { redirect } = this.$instance?.router?.params
    const { loginType, accountMode } = this.state
    const { mobile, email, password, vcode } = this.state.info
    let params = {}

    if (accountMode === 'email') {
      const emailTrim = (email || '').trim()
      if (!validate.isEmail(emailTrim)) {
        showToast('请输入正确的电子邮箱')
        return
      }
      if (loginType == 1) {
        if (!validate.isRequired(password)) {
          showToast('请输入密码')
          return
        }
        if (!validate.isEmailChannelPassword(password)) {
          return showToast('请输入密码（8-20位，须含字母与数字）')
        }
        params = {
          username: emailTrim,
          password,
          check_type: 'password',
          silent: 1,
          auto_register: 0,
          auth_type: 'local'
        }
      } else {
        if (!validate.isRequired(vcode)) {
          showToast('请输入验证码')
          return
        }
        params = {
          username: emailTrim,
          vcode,
          check_type: 'email_otp',
          auto_register: 1,
          auth_type: 'local'
        }
      }
    } else {
      params = {
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
    }

    if (source_id) {
      params['source_id'] = source_id
    }
    if (monitor_id) {
      params['monitor_id'] = monitor_id
    }
    if (latest_source_id) {
      params['latest_source_id'] = latest_source_id
    }
    if (latest_monitor_id) {
      params['latest_monitor_id'] = latest_monitor_id
    }

    const loginPayload = accountMode === 'email' ? { ...params, showError: false } : params

    try {
      const { token, error_message } = await api.wx.newloginh5(loginPayload)

      const { is_new } = tokenParseH5(token)

      if (is_new === 1) {
        if (accountMode === 'email') {
          this.setState({ showEmailNotActivatedHint: false })
          if (loginType === 1) {
            return showToast('该邮箱尚未注册，请先注册或使用验证码登录')
          }
          setToken(token)
          const emailTrim = (this.state.info.email || '').trim()
          Taro.navigateTo({
            url: `/subpages/auth/edit-password?phone=${encodeURIComponent(
              emailTrim
            )}&redi_url=${encodeURIComponent(redirect || '')}`
          })
          return
        }
        if (loginType === 1) {
          return showToast('当前手机号未注册，请先注册！')
        }
        setToken(token)
        Taro.navigateTo({
          url: `/subpages/auth/edit-password?phone=${mobile}&redi_url=${encodeURIComponent(
            redirect || ''
          )}`
        })
        return
      } else {
        if (error_message) {
          if (accountMode === 'email') {
            this.setState({
              showEmailNotActivatedHint: this.isEmailNotActivatedText(error_message)
            })
          }
          return showToast(error_message)
        }
        this.setState({ showEmailNotActivatedHint: false })
        const self = this
        setTokenAndRedirect(token, async () => {
          await self.handleUpdateUserInfo()
        }).bind(self)
      }
    } catch (e) {
      console.log(e)
      if (accountMode === 'email') {
        const { message: apiMsg } = this.pickApiErrorMeta(e)
        const msg = apiMsg || (e && e.message) || ''
        this.setState({
          showEmailNotActivatedHint: this.isEmailNotActivatedError(e)
        })
        if (msg) {
          showToast(msg)
        }
      }
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
    const { redirect } = this.$instance?.router?.params
    navigationToReg(redirect)
  }

  handleForgotPsd = async () => {
    const { redirect } = this.$instance?.router?.params
    const { accountMode } = this.state
    const { mobile, email } = this.state.info

    if (accountMode === 'email') {
      const parts = []
      if (redirect) {
        parts.push(`redi_url=${encodeURIComponent(redirect)}`)
      }
      if (email) {
        parts.push(`email=${encodeURIComponent(email.trim())}`)
      }
      const url =
        parts.length > 0
          ? `/subpages/auth/forgotpwd-email?${parts.join('&')}`
          : '/subpages/auth/forgotpwd-email'
      Taro.navigateTo({ url })
      return
    }

    const parts = []
    if (redirect) {
      parts.push(`redi_url=${encodeURIComponent(redirect)}`)
    }
    if (mobile) {
      parts.push(`phone=${mobile}`)
    }
    const url =
      parts.length > 0 ? `/subpages/auth/forgotpwd?${parts.join('&')}` : '/subpages/auth/forgotpwd'
    Taro.navigateTo({ url })
  }

  getDevice() {
    const ua = navigator.userAgent
    const ios = /iPad|iPhone|iPod/.test(ua)
    return ios
  }

  // 键盘挡输入框
  getElementOffsetTop(el) {
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

  render() {
    const {
      info,
      loginType,
      imgInfo,
      logoShow,
      accountMode,
      showEmailNotActivatedHint,
      showResendActivateModal,
      imgInfoActivate,
      resendActivateYzm
    } = this.state

    const passwordLogin = loginType == 1

    const codeLogin = loginType == 2

    const emailTrim = (info.email || '').trim()
    const isFullMobile =
      accountMode === 'mobile' &&
      ((codeLogin && info.mobile && info.yzm && info.vcode) ||
        (passwordLogin &&
          info.mobile &&
          info.password &&
          info.password.length >= 6 &&
          !info.is_new)) &&
      info.mobile &&
      info.mobile.length === 11

    const isFullEmailPassword =
      accountMode === 'email' &&
      passwordLogin &&
      validate.isEmail(emailTrim) &&
      info.password &&
      validate.isEmailChannelPassword(info.password)

    const isFullEmailOtp =
      accountMode === 'email' && codeLogin && validate.isEmail(emailTrim) && info.yzm && info.vcode

    const isFull = isFullMobile || isFullEmailPassword || isFullEmailOtp

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
        <View style={{ padding: '0 32px' }}>
          <View className='auth-hd'>
            <View className='title'>{'欢迎登录'}</View>
            {/* <View className='desc'>使用已注册的手机号登录</View> */}
          </View>
          <View className='auth-bd'>
            <View className='login-type-tabs'>
              <View
                className={classNames('login-type-tab', {
                  'login-type-tab--active': accountMode === 'mobile'
                })}
                onClick={() => this.handleAccountModeChange('mobile')}
              >
                {'手机号登录'}
              </View>
              <View
                className={classNames('login-type-tab', {
                  'login-type-tab--active': accountMode === 'email'
                })}
                onClick={() => this.handleAccountModeChange('email')}
              >
                {'邮箱登录'}
              </View>
            </View>
            <AtForm className='form'>
              {accountMode === 'mobile' ? (
                <>
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
                          value={info.password}
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
                          placeholder={'请输入图形验证码'}
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
                          placeholder={'请输入验证码'}
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
                  <View className='btn-text-group'>
                    <Text className='btn-text' onClick={this.handleToggleLogin.bind(this)}>
                      {passwordLogin ? '验证码登录' : '密码登录'}
                    </Text>
                    {passwordLogin && (
                      <Text className='btn-text forgot-password' onClick={this.handleForgotPsd}>
                        {'忘记密码？'}
                      </Text>
                    )}
                  </View>
                </>
              ) : (
                <>
                  <View className='form-field'>
                    <AtInput
                      clear
                      name='email'
                      type='text'
                      value={info.email}
                      placeholder={'请输入登录邮箱'}
                      onChange={this.handleInputChange.bind(this, 'email')}
                      placeholderClass='input-placeholder'
                      {...inputProp}
                    />
                  </View>
                  {passwordLogin && (
                    <View className='form-field'>
                      <View className='input-field'>
                        <CompPasswordInput
                          placeholder={'请输入密码（8-20位，须含字母与数字）'}
                          onChange={this.handleInputChange.bind(this, 'password')}
                          {...inputProp}
                          value={info.password}
                        />
                      </View>
                    </View>
                  )}
                  {codeLogin && (
                    <View className='form-field'>
                      <View className='input-field'>
                        <AtInput
                          clear
                          name='email-yzm'
                          value={info.yzm}
                          placeholder={'请输入图形验证码'}
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
                          name='email-vcode'
                          value={info.vcode}
                          placeholder={'请输入邮箱验证码'}
                          onChange={this.handleInputChange.bind(this, 'vcode')}
                          placeholderClass='input-placeholder'
                          {...inputProp}
                        />
                      </View>
                      <View className='btn-field'>
                        <SpTimer
                          key='login-email-timer'
                          onStart={this.handleEmailLoginTimerStart.bind(this)}
                          onStop={this.handleTimerStop}
                        />
                      </View>
                    </View>
                  )}
                  <View className='btn-text-group'>
                    <Text className='btn-text' onClick={this.handleToggleLogin.bind(this)}>
                      {passwordLogin ? '验证码登录' : '密码登录'}
                    </Text>
                    {(passwordLogin || showEmailNotActivatedHint) && (
                      <Text
                        className='btn-text forgot-password'
                        onClick={
                          showEmailNotActivatedHint
                            ? this.handleOpenResendActivateModal
                            : this.handleForgotPsd
                        }
                      >
                        {showEmailNotActivatedHint ? '未收到激活邮件？' : '忘记密码？'}
                      </Text>
                    )}
                  </View>
                </>
              )}
              <View className='form-submit'>
                <AtButton
                  disabled={!isFull}
                  circle
                  type='primary'
                  className='login-button'
                  onClick={this.handleSubmit.bind(this)}
                >
                  {'登 录'}
                </AtButton>
                <AtButton
                  circle
                  type='primary'
                  className='reg-button'
                  onClick={this.handleNavigateReg}
                >
                  {'注 册'}
                </AtButton>
              </View>
            </AtForm>
          </View>
          <View className='other-login'>
            <CompOtherLogin />
          </View>
        </View>

        <SpFloatLayout
          className='login-resend-activate-modal'
          title={'重发激活邮件'}
          open={showResendActivateModal}
          onClose={this.handleCloseResendActivateModal}
          renderFooter={
            <View className='resend-activate-footer'>
              <AtButton circle onClick={this.handleCloseResendActivateModal}>
                {'取消'}
              </AtButton>
              <AtButton circle type='primary' onClick={this.handleConfirmResendActivate}>
                {'确认'}
              </AtButton>
            </View>
          }
        >
          <View className='resend-activate-body'>
            <Text className='resend-activate-body__text'>{'是否向该邮箱重新发送激活邮件？'}</Text>
            <View className='form-field resend-activate-captcha'>
              <View className='input-field'>
                <AtInput
                  clear
                  name='resend-activate-yzm'
                  value={resendActivateYzm}
                  placeholder={'请输入图形验证码'}
                  onChange={this.handleResendActivateYzmChange}
                  placeholderClass='input-placeholder'
                />
              </View>
              <View className='btn-field'>
                {imgInfoActivate && (
                  <Image
                    className='image-vcode'
                    mode='aspectFit'
                    src={imgInfoActivate.imageData}
                    onClick={this.getResendActivateImageVcode}
                  />
                )}
              </View>
            </View>
          </View>
        </SpFloatLayout>
      </SpPage>
    )
  }
}
