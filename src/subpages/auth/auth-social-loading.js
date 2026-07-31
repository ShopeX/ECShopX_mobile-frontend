/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { SpPage, SpLoading } from '@/components'
import { classNames } from '@/utils'
import api from '@/api'
import { useLogin } from '@/hooks'
import { useTranslation, $t } from '@/i18n'
import { setTokenAndRedirect, getToken, normalizeAuthRedirectParam } from './util'
import './auth-social-loading.scss'

const AuthSocialLoading = () => {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('fd477850.88bdcf') })
    const onLang = () => Taro.setNavigationBarTitle({ title: $t('fd477850.88bdcf') })
    i18n.on('languageChanged', onLang)
    return () => i18n.off('languageChanged', onLang)
  }, [i18n])

  const {
    params: { code, trustlogin_tag, redi_url: rediUrlParam }
  } = $instance?.router || { params: {} }

  const redi_url =
    rediUrlParam ||
    (typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('ecx_social_oauth_redi_url') || ''
      : '')

  const oauthCode = normalizeAuthRedirectParam(code)

  const { getUserInfo } = useLogin()

  const handleLogin = async () => {
    const { token } = await api.wx.socialLoginH5({
      code: oauthCode,
      trustlogin_tag,
      auth_type: 'social_oauth'
    })

    setTokenAndRedirect(token, async () => {
      await getUserInfo()
    }, { rediUrl: redi_url })

    try {
      sessionStorage.removeItem('ecx_social_oauth_redi_url')
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    const token = getToken()
    if (token) {
      setTokenAndRedirect(token)
      return
    }
    if (!oauthCode || !trustlogin_tag) {
      Taro.showToast({ title: $t('bf3f9cd5.26b5bd'), icon: 'none' })
      return
    }
    handleLogin()
  }, [])

  return (
    <SpPage className={classNames('page-auth-social-loading')}>
      <SpLoading>{$t('bf3f9cd5.26b5bd')}</SpLoading>
    </SpPage>
  )
}

export default AuthSocialLoading
