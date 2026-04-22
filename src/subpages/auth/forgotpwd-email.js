/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage, SpInput as AtInput } from '@/components'
import { classNames, validate, showToast } from '@/utils'
import { AtForm, AtButton } from 'taro-ui'
import api from '@/api'
import './forgotpwd.scss'

const PageForgotPwdEmail = () => {
  const $instance = getCurrentInstance() || {}
  const { email: emailParam, redi_url: rediUrlParam } = $instance?.router?.params || {}

  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (emailParam) {
      setEmail(String(emailParam))
    }
  }, [emailParam])

  const handleSend = async () => {
    const trimmed = email.trim()
    if (!validate.isEmail(trimmed)) {
      showToast('请输入正确的电子邮箱')
      return
    }
    if (submitting) return
    setSubmitting(true)
    const reset_base_url =
      (typeof process !== 'undefined' && process.env.APP_RESET_PASSWORD_BASE_URL) ||
      (typeof window !== 'undefined'
        ? `${window.location.origin.replace(/\/$/, '')}/pages`
        : undefined)

    try {
      await api.user.requestEmailPasswordReset({
        email: trimmed,
        ...(reset_base_url ? { reset_base_url } : {})
      })
      showToast('若该邮箱已注册，您将收到重置密码邮件')
    } catch (e) {
      console.log(e)
    } finally {
      setSubmitting(false)
    }
  }

  const isValid = validate.isEmail(email.trim())

  return (
    <SpPage
      className={classNames('page-auth-forgotpwd', {
        'is-full': isValid
      })}
    >
      <View className='auth-hd'>
        <View className='title'>邮箱找回密码</View>
        <View className='desc'>将向您的邮箱发送重置密码链接</View>
      </View>
      <View className='auth-bd'>
        <AtForm className='form'>
          <View className='form-field'>
            <AtInput
              clear
              name='email'
              type='text'
              value={email}
              placeholder='请输入电子邮箱'
              onChange={(val) => setEmail(val)}
            />
          </View>

          <View className='form-submit'>
            <AtButton
              disabled={!isValid || submitting}
              loading={submitting}
              circle
              type='primary'
              className='login-button'
              onClick={handleSend}
            >
              发送重置密码邮件
            </AtButton>
          </View>

          {rediUrlParam ? (
            <View className='btn-text-group' style={{ marginTop: 32 }}>
              <Text />
              <Text
                className='btn-text'
                onClick={() =>
                  Taro.navigateTo({
                    url: `/subpages/auth/login?redirect=${encodeURIComponent(rediUrlParam)}`
                  })
                }
              >
                返回登录
              </Text>
            </View>
          ) : null}
        </AtForm>
      </View>
    </SpPage>
  )
}

export default PageForgotPwdEmail
