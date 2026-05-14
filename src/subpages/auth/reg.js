/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpPage, SpCheckbox, SpInput as AtInput } from '@/components'
import { SpTimer } from '@/subpages/components'
import { classNames, validate, showToast } from '@/utils'
import { useSelector } from 'react-redux'
import { AtForm, AtButton } from 'taro-ui'
import api from '@/api'
import { useImmer } from 'use-immer'
import { useTranslation, $t, ti } from '@/i18n'
import { CompPasswordInput } from './comps'
import { normalizeAuthRedirectParam } from './util'
import './reg.scss'

/** query 里邮箱保留 `@`，避免链接或路由层把 `%40` 当字面量带进输入框；其余字符仍按 URI 编码 */
function encodeEmailForLoginQuery(email) {
  return encodeURIComponent(String(email).trim()).replace(/%40/gi, '@')
}

/** 成功接口体里的 message / msg；无则回退本地默认「注册成功」 */
function pickRegisterSuccessToast(res, fallback) {
  if (!res || typeof res !== 'object') return fallback
  const m = res.message ?? res.msg
  if (m != null && String(m).trim() !== '') return String(m).trim()
  return fallback
}

/** 注册成功后进登录页，并带上账号类型与预填账号（不写入注册返回的 token，由用户在登录页登录） */
function buildPostRegisterLoginUrl(accountMode, fields, routerParams) {
  const qs = [`account_mode=${encodeURIComponent(accountMode)}`]
  if (accountMode === 'mobile' && fields.mobile) {
    qs.push(`mobile=${encodeURIComponent(String(fields.mobile).trim())}`)
  }
  if (accountMode === 'email' && fields.email) {
    qs.push(`email=${encodeEmailForLoginQuery(fields.email)}`)
  }
  const { redi_url, redirect } = routerParams || {}
  const rediPlain = redi_url ? normalizeAuthRedirectParam(redi_url) : ''
  const redirectPlain = redirect ? normalizeAuthRedirectParam(redirect) : ''
  if (rediPlain) {
    qs.push(`redi_url=${encodeURIComponent(rediPlain)}`)
  }
  if (redirectPlain) {
    qs.push(`redirect=${encodeURIComponent(redirectPlain)}`)
  }
  return `/subpages/auth/login?${qs.join('&')}`
}

const initialValue = {
  regMode: 'mobile',
  mobile: '',
  email: '',
  yzm: '',
  vcode: '',
  password: '',
  passwordConfirm: '',
  imgInfo: null,
  checked: false,
  member_register: '',
  privacy: '',
  /** 邮箱注册时后端创建会员可能要求 grade_id；由接口自动解析，不在表单展示 */
  defaultMemberGradeId: null
}

const CODE_SYMBOL = 'sign'

function pickDefaultMemberGradeIdFromCard(data) {
  const list = data?.member_card_list
  if (!Array.isArray(list) || list.length === 0) return null
  const marked = list.find(
    (g) => g.is_default || g.is_default_grade || Number(g.default_grade) === 1
  )
  const id = marked?.grade_id ?? list[0]?.grade_id
  return id != null && id !== '' ? id : null
}

const Reg = () => {
  const { i18n } = useTranslation()
  const regModeEffectSkip = useRef(true)
  const [state, setState] = useImmer(initialValue)

  const {
    regMode,
    mobile,
    email,
    yzm,
    vcode,
    password,
    passwordConfirm,
    imgInfo,
    checked,
    member_register,
    privacy,
    defaultMemberGradeId
  } = state

  const { colorPrimary } = useSelector((state) => state.sys)

  const handleInputChange = (name) => (val) => {
    setState((state) => {
      state[name] = val
    })
  }

  const setRegMode = (mode) => {
    setState((draft) => {
      draft.regMode = mode
      draft.yzm = ''
      draft.vcode = ''
    })
  }

  const handleNavigateForgotEmail = () => {
    const redi_url = getCurrentInstance()?.router?.params?.redi_url
    const parts = []
    if (redi_url) {
      parts.push(`redi_url=${encodeURIComponent(normalizeAuthRedirectParam(redi_url))}`)
    }
    const e = email.trim()
    if (e) {
      parts.push(`email=${encodeURIComponent(e)}`)
    }
    const url =
      parts.length > 0
        ? `/subpages/auth/forgotpwd-email?${parts.join('&')}`
        : '/subpages/auth/forgotpwd-email'
    Taro.navigateTo({ url })
  }

  const getImageVcode = async () => {
    const img_res = await api.user.regImg({ type: CODE_SYMBOL })
    setState((state) => {
      state.imgInfo = img_res
    })
  }

  const handleSmsTimerStart = async (done) => {
    if (!validate.isMobileNum(mobile)) {
      showToast($t('4e9d53b5.a32ab5'))
      return
    }
    if (!validate.isRequired(yzm)) {
      showToast($t('4e9d53b5.e70066'))
      return
    }
    if (!imgInfo?.imageToken) {
      showToast('请稍候再试')
      getImageVcode()
      return
    }
    try {
      await api.user.regSmsCode({
        type: CODE_SYMBOL,
        mobile: mobile,
        yzm: yzm,
        token: imgInfo.imageToken
      })
      showToast('验证码已发送')
      done()
    } catch (e) {
      getImageVcode()
    }
  }

  const handleSubmit = async () => {
    if (!checked) {
      const res = await Taro.showModal({
        title: $t('4e9d53b5.02d981'),
        content: ti('4e9d53b5.0ce185', [member_register, privacy]),
        showCancel: true,
        cancelText: '拒绝',
        confirmText: '同意',
        confirmColor: colorPrimary
      })
      if (!res.confirm) return
    }

    if (regMode === 'mobile') {
      if (!validate.isMobileNum(mobile)) {
        showToast('请输入正确的手机号')
        return
      }
      if (!validate.isRequired(vcode)) {
        showToast('请输入验证码')
        return
      }
      if (!validate.isRequired(password)) {
        showToast('请输入密码')
        return
      }
      if (!validate.isPassword(password)) {
        return showToast('密码格式不正确')
      }
      try {
        const regRes = await api.user.reg({
          auth_type: 'local',
          check_type: CODE_SYMBOL,
          mobile,
          password,
          vcode,
          sex: 0,
          user_type: 'local'
        })
        const routerParams = getCurrentInstance()?.router?.params || {}
        showToast(pickRegisterSuccessToast(regRes, '注册成功'), () => {
          Taro.redirectTo({
            url: buildPostRegisterLoginUrl('mobile', { mobile }, routerParams)
          })
        })
      } catch (e) {
        console.log(e)
      }
      return
    }

    if (!validate.isEmail(email.trim())) {
      showToast('请输入正确的电子邮箱')
      return
    }
    if (!validate.isRequired(yzm)) {
      showToast('请输入图形验证码')
      return
    }
    if (!imgInfo?.imageToken) {
      showToast('请稍候再试')
      getImageVcode()
      return
    }
    if (!validate.isEmailChannelPassword(password)) {
      return showToast('密码需8-20位且同时包含字母与数字')
    }
    const passMsg = validate.validatePass2(password, passwordConfirm)
    if (passMsg) {
      return showToast(passMsg)
    }
    try {
      const emailPayload = {
        email: email.trim(),
        password,
        password_confirmation: passwordConfirm,
        token: imgInfo.imageToken,
        yzm,
        sex: 0,
        user_type: 'local'
      }
      if (defaultMemberGradeId != null && defaultMemberGradeId !== '') {
        emailPayload.grade_id = defaultMemberGradeId
      }
      const emailRegRes = await api.user.memberEmailRegister(emailPayload)
      const routerParams = getCurrentInstance()?.router?.params || {}
      const emailTrim = email.trim()
      showToast(pickRegisterSuccessToast(emailRegRes, '注册成功'), () => {
        Taro.redirectTo({
          url: buildPostRegisterLoginUrl('email', { email: emailTrim }, routerParams)
        })
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handleSelect = () => {
    setState((_state) => {
      _state.checked = !checked
    })
  }

  const fetchPrivacyData = async () => {
    const {
      protocol: { member_register, privacy }
    } = await api.shop.getStoreBaseInfo()

    setState((v) => {
      v.member_register = member_register
      v.privacy = privacy
    })
  }

  /** 解析注册默认会员等级，避免接口报「缺少默认等级」（与手机号注册创建会员逻辑对齐） */
  const fetchDefaultMemberGradeId = async () => {
    const envId = process.env.APP_DEFAULT_MEMBER_GRADE_ID
    if (envId !== undefined && envId !== null && String(envId).trim() !== '') {
      setState((d) => {
        d.defaultMemberGradeId = String(envId).trim()
      })
      return
    }
    let gradeId = null
    try {
      const card = await api.member.getMemberCard()
      gradeId = pickDefaultMemberGradeIdFromCard(card)
    } catch (e) {
      console.log(e)
    }
    if (gradeId == null) {
      try {
        const shop = await api.shop.getStoreBaseInfo()
        gradeId =
          shop?.default_member_grade_id ??
          shop?.member_default_grade_id ??
          shop?.register_default_grade_id ??
          null
      } catch (e) {
        console.log(e)
      }
    }
    if (gradeId != null && gradeId !== '') {
      setState((d) => {
        d.defaultMemberGradeId = gradeId
      })
    }
  }

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: '注册' })
  }, [])

  useEffect(() => {
    getImageVcode()
    fetchPrivacyData()
    fetchDefaultMemberGradeId()
  }, [])

  useEffect(() => {
    if (regModeEffectSkip.current) {
      regModeEffectSkip.current = false
      return
    }
    getImageVcode()
  }, [regMode])

  const isFullMobile = mobile && yzm && vcode && password
  const isFullEmail =
    email &&
    yzm &&
    password &&
    passwordConfirm &&
    validate.isEmail(email.trim()) &&
    validate.isEmailChannelPassword(password)

  const isFull = regMode === 'mobile' ? isFullMobile : isFullEmail

  return (
    <SpPage
      className={classNames('page-auth-reg', {
        'is-full': isFull
      })}
    >
      <View className='auth-hd'>
        <View className='title'>{$t('4e9d53b5.8c4312')}</View>
      </View>
      <View className='auth-bd'>
        <View className='reg-type-tabs'>
          <View
            className={classNames('reg-type-tab', { 'reg-type-tab--active': regMode === 'mobile' })}
            onClick={() => setRegMode('mobile')}
          >
            手机号注册
          </View>
          <View
            className={classNames('reg-type-tab', { 'reg-type-tab--active': regMode === 'email' })}
            onClick={() => setRegMode('email')}
          >
            邮箱注册
          </View>
        </View>
        <AtForm className='form'>
          {regMode === 'mobile' ? (
            <>
              <View className='form-field'>
                <AtInput
                  clear
                  name='mobile'
                  maxLength={11}
                  type='tel'
                  value={state.mobile}
                  placeholder='请输入您的手机号码'
                  onChange={handleInputChange('mobile')}
                />
              </View>

              <View className='form-field'>
                <View className='input-field'>
                  <AtInput
                    clear
                    name='yzm'
                    value={state.yzm}
                    placeholder={'请输入图形验证码'}
                    onChange={handleInputChange('yzm')}
                  />
                </View>
                <View className='btn-field'>
                  {imgInfo && (
                    <Image
                      className='image-vcode'
                      src={imgInfo.imageData}
                      onClick={getImageVcode}
                    />
                  )}
                </View>
              </View>

              <View className='form-field'>
                <View className='input-field'>
                  <AtInput
                    clear
                    name='vcode'
                    value={state.vcode}
                    placeholder={'请输入验证码'}
                    onChange={handleInputChange('vcode')}
                  />
                </View>
                <View className='btn-field'>
                  <SpTimer
                    key='reg-mobile-timer'
                    defaultMsg='发送验证码'
                    msg='重新发送'
                    onStart={handleSmsTimerStart}
                  />
                </View>
              </View>

              <View className='form-field'>
                <View className='input-field'>
                  <CompPasswordInput
                    placeholder={'请输入密码'}
                    onChange={handleInputChange('password')}
                    value={state.password}
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              <View className='form-field'>
                <AtInput
                  clear
                  name='email'
                  type='text'
                  value={state.email}
                  placeholder='请输入电子邮箱'
                  onChange={handleInputChange('email')}
                />
              </View>

              <View className='form-field'>
                <View className='input-field'>
                  <AtInput
                    clear
                    name='email-yzm'
                    value={state.yzm}
                    placeholder={'请输入图形验证码'}
                    onChange={handleInputChange('yzm')}
                  />
                </View>
                <View className='btn-field'>
                  {imgInfo && (
                    <Image
                      className='image-vcode'
                      src={imgInfo.imageData}
                      onClick={getImageVcode}
                    />
                  )}
                </View>
              </View>

              <View className='form-field'>
                <View className='input-field'>
                  <CompPasswordInput
                    placeholder={'密码需8-20位且同时包含字母与数字'}
                    onChange={handleInputChange('password')}
                    value={state.password}
                  />
                </View>
              </View>

              <View className='form-field'>
                <View className='input-field'>
                  <CompPasswordInput
                    placeholder='请再次确认登录密码'
                    onChange={handleInputChange('passwordConfirm')}
                    value={state.passwordConfirm}
                  />
                </View>
              </View>
            </>
          )}

          {regMode === 'email' && (
            <View className='btn-text-group btn-text-group--end'>
              <Text className='btn-text' onClick={handleNavigateForgotEmail}>
                忘记密码？
              </Text>
            </View>
          )}

          <View className='form-submit'>
            <AtButton
              disabled={!isFull}
              circle
              type='primary'
              className='login-button'
              onClick={handleSubmit}
            >
              {$t('4e9d53b5.3179ba')}
            </AtButton>
          </View>

          <View className='form-text'>
            <SpCheckbox checked={checked} onChange={handleSelect} />
            <View>
              {$t('4e9d53b5.b840cb')}
              <Text
                className='primary-color'
                onClick={() =>
                  Taro.navigateTo({
                    url: '/subpages/auth/reg-rule?type=member_register'
                  })
                }
              >
                《{member_register}》
              </Text>
              、
              <Text
                className='primary-color'
                onClick={() =>
                  Taro.navigateTo({
                    url: '/subpages/auth/reg-rule?type=privacy'
                  })
                }
              >
                《{privacy}》
              </Text>
            </View>
          </View>
        </AtForm>
      </View>
    </SpPage>
  )
}

export default Reg
