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
import { useTranslation, $t } from '@/i18n'
import './email-activate.scss'

const LOGIN_EMAIL_TAB = '/subpages/auth/login?account_mode=email'

function pickActivateErrorMessage(err) {
  if (!err) {
    return $t('6b6227fd.c6d73a')
  }
  if (err.message && String(err.message).trim()) {
    return String(err.message).trim()
  }
  const d = err.res?.data
  return d?.data?.message || d?.message || $t('6b6227fd.c6d73a')
}

const EmailActivate = () => {
  const { i18n } = useTranslation()
  const [phase, setPhase] = useState('loading')
  const [successHint, setSuccessHint] = useState('')
  const [errorHint, setErrorHint] = useState('')

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('524b7cbb.0a1e72') })
  }, [i18n.language])

  useEffect(() => {
    const run = async () => {
      const router = getCurrentInstance()?.router
      const token = (router?.params?.token ?? '').trim()
      const companyIdRaw = router?.params?.company_id

      if (!token) {
        setPhase('error')
        setErrorHint($t('6b6227fd.dd1730'))
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
        const msg = (res && (res.message || res.msg)) || $t('6b6227fd.9aef4a')
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

  const title =
    phase === 'loading'
      ? $t('6b6227fd.7fb60d')
      : phase === 'success'
      ? $t('6b6227fd.240dec')
      : $t('6b6227fd.912efd')

  const desc = phase === 'loading' ? $t('6b6227fd.368085') : phase === 'success' ? successHint : ''

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
              {$t('6b6227fd.ed2ff8')}
            </AtButton>
          </View>
        ) : null}
      </View>
    </SpPage>
  )
}

export default EmailActivate
