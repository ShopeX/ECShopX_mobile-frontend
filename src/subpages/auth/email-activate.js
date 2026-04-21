/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 邮箱激活邮件链接落地页：进入后立即请求 POST /wxapp/member/email/activate
 */
import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpPage } from '@/components'
import { classNames } from '@/utils'
import { AtButton } from 'taro-ui'
import api from '@/api'
import './email-activate.scss'

const LOGIN_EMAIL_TAB = '/subpages/auth/login?account_mode=email'

function pickActivateErrorMessage(err) {
  if (!err) {
    return '激活失败，请稍后重试或重新从邮件打开本链接。'
  }
  if (err.message && String(err.message).trim()) {
    return String(err.message).trim()
  }
  const d = err.res?.data
  return d?.data?.message || d?.message || '激活失败，请稍后重试或重新从邮件打开本链接。'
}

const EmailActivate = () => {
  const [phase, setPhase] = useState('loading')
  const [successHint, setSuccessHint] = useState('')
  const [errorHint, setErrorHint] = useState('')

  useEffect(() => {
    const run = async () => {
      const router = getCurrentInstance()?.router
      const token = (router?.params?.token ?? '').trim()
      const companyIdRaw = router?.params?.company_id

      if (!token) {
        setPhase('error')
        setErrorHint('激活链接无效或未携带令牌，请从邮件中的「激活」按钮或完整链接重新打开本页。')
        return
      }

      try {
        const payload = {
          token,
          /** 与 req 层一致：抑制全局 Toast，由本页展示失败原因 */
          showError: false
        }
        if (
          companyIdRaw !== undefined &&
          companyIdRaw !== null &&
          String(companyIdRaw).trim() !== ''
        ) {
          payload.company_id = String(companyIdRaw).trim()
        }
        const res = await api.user.memberEmailActivate(payload)
        const msg =
          (res && (res.message || res.msg)) || '您的邮箱账号已激活，请使用注册邮箱与密码登录。'
        setSuccessHint(msg)
        setPhase('success')
      } catch (e) {
        setPhase('error')
        setErrorHint(pickActivateErrorMessage(e))
      }
    }

    run()
  }, [])

  const goLogin = () => {
    Taro.redirectTo({ url: LOGIN_EMAIL_TAB }).catch(() => {
      Taro.navigateTo({ url: LOGIN_EMAIL_TAB })
    })
  }

  const title = phase === 'loading' ? '正在激活' : phase === 'success' ? '激活成功' : '激活失败'

  const desc =
    phase === 'loading' ? '正在提交激活信息，请稍候…' : phase === 'success' ? successHint : ''

  return (
    <SpPage
      className={classNames('page-auth-forgotpwd', 'page-auth-email-activate', {
        'is-full': phase === 'success'
      })}
    >
      <View className='auth-hd'>
        <View className='title'>{title}</View>
        {desc ? <View className='desc'>{desc}</View> : null}
        {phase === 'error' && errorHint ? (
          <Text className='email-activate-error' selectable>
            {errorHint}
          </Text>
        ) : null}
      </View>
      <View className='auth-bd'>
        {phase === 'success' ? (
          <View className='form-submit'>
            <AtButton circle type='primary' className='login-button' onClick={goLogin}>
              立即登录
            </AtButton>
          </View>
        ) : null}
      </View>
    </SpPage>
  )
}

export default EmailActivate
