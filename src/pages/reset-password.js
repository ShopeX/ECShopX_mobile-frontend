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
import { useTranslation, $t } from '@/i18n'
import '@/subpages/auth/forgotpwd.scss'

const PageResetPassword = () => {
  useTranslation()
  const $instance = getCurrentInstance() || {}
  const { token: tokenParam } = $instance?.router?.params || {}

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!validate.isRequired(tokenParam)) {
      showToast($t('b910652f.5819af'))
      return
    }
    if (!validate.isEmailChannelPassword(password)) {
      return showToast($t('b910652f.96246d'))
    }
    const passMsg = validate.validatePass2(password, passwordConfirm)
    if (passMsg) {
      return showToast(passMsg)
    }
    if (submitting) return
    setSubmitting(true)
    try {
      await api.user.emailPasswordResetConfirm({ token: tokenParam, password })
      showToast($t('b910652f.2f1f1d'), () => {
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
        <View className='title'>{$t('b910652f.9c04e9')}</View>
        <View className='desc'>{$t('b910652f.e2fd7c')}</View>
      </View>
      <View className='auth-bd'>
        <AtForm className='form'>
          <View className='form-field'>
            <View className='input-field'>
              <CompPasswordInput
                placeholder={$t('b910652f.96246d')}
                onChange={setPassword}
                value={password}
              />
            </View>
          </View>
          <View className='form-field'>
            <View className='input-field'>
              <CompPasswordInput
                placeholder={$t('b910652f.d98a14')}
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
              {$t('c2581d4c.e83a25')}
            </AtButton>
          </View>
        </AtForm>
      </View>
    </SpPage>
  )
}

export default PageResetPassword
