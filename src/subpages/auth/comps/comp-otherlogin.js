/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useMemo, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { isWxWeb } from '@/utils'
import api from '@/api'
import { useTranslation, $t } from '@/i18n'
import './comp-otherlogin.scss'

import googleIcon from '../assets/oauth/google.svg'
import appleIcon from '../assets/oauth/apple.svg'
import facebookIcon from '../assets/oauth/facebook.svg'
import lineIcon from '../assets/oauth/line.svg'

const OAUTH_ICONS = {
  google: googleIcon,
  apple: appleIcon,
  facebook: facebookIcon,
  line: lineIcon
}

const OAUTH_LABEL_KEYS = {
  google: 'e7a49201.a1b2c3',
  apple: 'e7a49201.d4e5f6',
  facebook: 'e7a49201.g7h8i9',
  line: 'e7a49201.j0k1l2',
  weixin: 'e7a49201.p6q7r8'
}

const PROVIDER_ORDER = ['google', 'apple', 'facebook', 'line', 'weixin']

const isEnabled = (row) => row && (row.status === true || row.status === 'true' || row.status === 1)

const SOCIAL_OAUTH_REDI_KEY = 'ecx_social_oauth_redi_url'

const CompOtherLogin = () => {
  useTranslation()
  const [providers, setProviders] = useState([])

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const list = await api.wx.getTrustLoginList({ version_tag: 'touch' })
        const rows = Array.isArray(list) ? list : []
        setProviders(rows.filter(isEnabled))
      } catch (e) {
        setProviders([])
      }
    }
    loadProviders()
  }, [])

  const handleClickProvider = async (row) => {
    const $instance = getCurrentInstance() || {}
    const { redirect = '' } = $instance?.router?.params || {}
    const redirectUrl =
      !!redirect && redirect !== 'undefined' ? redirect : process.env.APP_HOME_PAGE

    if (row.type === 'weixin') {
      const { oauth_url = '' } = await api.wx.getWxAuth({
        redirect_url: redirectUrl,
        trustlogin_tag: 'weixin',
        version_tag: 'touch'
      })
      if (oauth_url) {
        window.location.replace(oauth_url)
      }
      return
    }

    const { oauth_url = '' } = await api.wx.getWxAuth({
      redirect_url: redirectUrl,
      trustlogin_tag: row.type,
      version_tag: 'touch'
    })
    if (oauth_url) {
      try {
        sessionStorage.setItem(SOCIAL_OAUTH_REDI_KEY, redirectUrl || '')
      } catch (e) {
        // ignore
      }
      window.location.replace(oauth_url)
    }
  }

  const visibleProviders = useMemo(() => {
    const filtered = providers.filter((row) => {
      if (row.type === 'weixin') {
        return isWxWeb
      }
      return PROVIDER_ORDER.includes(row.type)
    })
    return filtered.sort(
      (a, b) => PROVIDER_ORDER.indexOf(a.type) - PROVIDER_ORDER.indexOf(b.type)
    )
  }, [providers])

  if (!visibleProviders.length) {
    return null
  }

  return (
    <View className='comp-other-login' data-testid='auth-other-login-list'>
      <View className='oauth-divider'>
        <View className='oauth-divider__line' />
        <Text className='oauth-divider__text'>{$t('e7a49201.m3n4o5')}</Text>
        <View className='oauth-divider__line' />
      </View>
      <View className='oauth-buttons'>
        {visibleProviders.map((row) => {
          const isWeixin = row.type === 'weixin'
          const labelKey = OAUTH_LABEL_KEYS[row.type]
          const label = labelKey ? $t(labelKey) : row.name || row.type

          return (
            <View
              key={row.type}
              className={`oauth-button oauth-button--${row.type}`}
              data-testid={
                row.type === 'google'
                  ? 'auth-other-login-google'
                  : `auth-other-login-${row.type}`
              }
              onClick={() => handleClickProvider(row)}
            >
              <View className='oauth-button__icon-wrap'>
                {isWeixin ? (
                  <Text className='iconfont icon-weixin oauth-button__wechat-icon' />
                ) : (
                  <Image
                    className='oauth-button__icon'
                    src={OAUTH_ICONS[row.type]}
                    mode='aspectFit'
                  />
                )}
              </View>
              <Text className='oauth-button__label'>{label}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

CompOtherLogin.options = {
  addGlobalClass: true
}

export default CompOtherLogin
