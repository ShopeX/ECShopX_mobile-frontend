/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { SpPage, SpLoading } from '@/components'
import { classNames, tokenParseH5 } from '@/utils'
import api from '@/api'
import { useLogin } from '@/hooks'
import { useTranslation, $t } from '@/i18n'
import { setTokenAndRedirect, getToken } from './util'
import './auth-loading.scss'

const AuthLoading = () => {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('fd477850.88bdcf') })
    const onLang = () => Taro.setNavigationBarTitle({ title: $t('fd477850.88bdcf') })
    i18n.on('languageChanged', onLang)
    return () => i18n.off('languageChanged', onLang)
  }, [i18n])
  const {
    params: { code, redi_url }
  } = $instance?.router

  const { getUserInfo } = useLogin()

  const getIsNew = async () => {
    const {
      token
      // is_new,
      // pre_login_data: { unionid }
    } = await api.wx.newloginh5({ code, auth_type: 'wx_offiaccount', api_from: 'h5app' })

    const { is_new, unionid } = tokenParseH5(token)

    let url = ''
    //如果是新用户
    if (is_new === 1) {
      url = `/subpages/auth/bindPhone?unionid=${unionid}&redi_url=${redi_url}`
      Taro.redirectTo({
        url
      })
    } else {
      setTokenAndRedirect(token, async () => {
        await getUserInfo()
      })
    }
  }

  useEffect(() => {
    let token = getToken()
    if (token) {
      setTokenAndRedirect(token)
      return
    }
    getIsNew()
  }, [])

  return (
    <SpPage className={classNames('page-auth-loading')}>
      <SpLoading>{$t('bf3f9cd5.26b5bd')}</SpLoading>
    </SpPage>
  )
}

export default AuthLoading
