/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 * 邮件链接：{reset_base_url}/reset-password?token=...&company_id=...
 */
import React, { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage } from '@/components'
import { classNames, validate, showToast } from '@/utils'
import { AtForm, AtButton } from 'taro-ui'
import api from '@/api'
import { CompPasswordInput } from '@/subpages/auth/comps'
import '@/subpages/auth/forgotpwd.scss'

const PageResetPassword = () => {
  const $instance = getCurrentInstance() || {}
  const { token: tokenParam } = $instance?.router?.params || {}

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!validate.isRequired(tokenParam)) {
      showToast('链接无效或已过期')
      return
    }
    if (!validate.isEmailChannelPassword(password)) {
      return showToast('密码需8-20位且同时包含字母与数字')
    }
    const passMsg = validate.validatePass2(password, passwordConfirm)
    if (passMsg) {
      return showToast(passMsg)
    }
    if (submitting) return
    setSubmitting(true)
    try {
      await api.user.emailPasswordResetConfirm({ token: tokenParam, password })
      showToast('密码已重置', () => {
        Taro.redirectTo({ url: '/subpages/auth/login' })
      })
    } catch (e) {
      console.log(e)
    } finally {
      setSubmitting(false)
    }
  }

  const isValid =
    validate.isRequired(tokenParam) &&
    validate.isEmailChannelPassword(password) &&
    password === passwordConfirm

  return (
    <SpPage
      className={classNames('page-auth-forgotpwd', {
        'is-full': isValid && !submitting
      })}
    >
      <View className='auth-hd'>
        <View className='title'>设置新密码</View>
        <View className='desc'>请设置您的登录密码</View>
      </View>
      <View className='auth-bd'>
        <AtForm className='form'>
          <View className='form-field'>
            <View className='input-field'>
              <CompPasswordInput
                placeholder='密码需8-20位且同时包含字母与数字'
                onChange={setPassword}
                value={password}
              />
            </View>
          </View>
          <View className='form-field'>
            <View className='input-field'>
              <CompPasswordInput
                placeholder='请再次输入新密码'
                onChange={setPasswordConfirm}
                value={passwordConfirm}
              />
            </View>
          </View>
          <View className='form-submit'>
            <AtButton
              disabled={!isValid || submitting}
              loading={submitting}
              circle
              type='primary'
              className='login-button'
              onClick={handleSubmit}
            >
              确认
            </AtButton>
          </View>
        </AtForm>
      </View>
    </SpPage>
  )
}

export default PageResetPassword
