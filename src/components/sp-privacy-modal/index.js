/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, RootPortal } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import api from '@/api'
import { $t, useTranslation } from '@/i18n'
import { classNames, styleNames } from '@/utils'
import { useLogin, useThemsColor } from '@/hooks'

import './index.scss'

const initState = {
  logo: '',
  member_register: '',
  privacy: ''
}

function SpPrivacyModal(props) {
  useTranslation()
  const { themeColor } = useThemsColor()
  const { login, updatePolicyTime, getUserInfoAuth } = useLogin()
  const { open = false, onCancel = () => {}, onConfirm = () => {} } = props
  const [info, setInfo] = useImmer(initState)
  useEffect(() => {
    if (open) {
      fetchPrivacyData()
    }
  }, [open])

  const fetchPrivacyData = async () => {
    const { logo, protocol } = await api.shop.getStoreBaseInfo()
    const { member_register, privacy } = protocol

    setInfo((v) => {
      v.logo = logo
      v.member_register = member_register
      v.privacy = privacy
    })
  }

  const handleClickPrivacy = (type) => {
    Taro.navigateTo({
      url: `/subpages/auth/reg-rule?type=${type}`
    })
  }

  const handleConfirm = () => {
    updatePolicyTime()
    onConfirm()
  }

  const handleCancel = () => {
    onCancel()
  }

  // RootPortal 脱离 SpPage，根节点需注入 themeColor()，子树内 var(--color-primary) 才能生效
  const modal = (
    <View
      className={classNames('sp-privacy-modal', {
        'open': open
      })}
      style={styleNames(themeColor())}
    >
      <View className='sp-privacy-modal__overlay'></View>
      <View className='modal-container'>
        <View className='modal-hd'>
          <Text className='title'>{$t('42a6f4da.9184c0')}</Text>
        </View>
        <View className='modal-bd'>
          <Text>{$t('c1881067.fe728a')}</Text>
          <Text className='policy-txt' onClick={handleClickPrivacy.bind(this, 'member_register')}>
            《{info.member_register}》
          </Text>
          <Text>{$t('ed40c676.b50566')}</Text>
          <Text className='policy-txt' onClick={handleClickPrivacy.bind(this, 'privacy')}>
            《{info.privacy}》
          </Text>
          <Text>{$t('ed40c676.4d67be')}</Text>
        </View>
        <View className='modal-ft'>
          <View className='btn-wrap'>
            <AtButton className='cancel-btn' onClick={handleCancel}>
              {$t('7c40f12d.7173f8')}
            </AtButton>
          </View>
          <View className='btn-wrap'>
            <AtButton className='confirm-btn' circle onClick={handleConfirm}>
              {$t('ed40c676.e61f2c')}
            </AtButton>
          </View>
        </View>
      </View>
    </View>
  )

  // 微信小程序：scroll-view 内图片等同层渲染节点可能盖住普通 fixed 层；挂到页面根节点保证最顶层
  if (process.env.TARO_ENV === 'weapp') {
    return <RootPortal>{modal}</RootPortal>
  }

  return modal
}

SpPrivacyModal.options = {
  addGlobalClass: true
}

export default SpPrivacyModal
