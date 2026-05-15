/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpImage } from '@/components'
import api from '@/api'
import { classNames, styleNames, navigateTo } from '@/utils'
import { useLogin } from '@/hooks'
import { $t, ti, useTranslation } from '@/i18n'

import './index.scss'

const initState = {
  logo: '',
  member_register: '',
  privacy: ''
}

function SpPrivacyModal(props) {
  useTranslation()
  const { updatePolicyTime } = useLogin()
  const { open = false, reject, onCancel = () => {}, onConfirm = () => {} } = props
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

  return (
    <View className={classNames('sp-float-privacy', { 'sp-float-privacy__active': open })}>
      <View className='sp-float-privacy__overlay'></View>
      <View className='sp-float-privacy__wrap'>
        <View className='privacy-hd'>{$t('ed40c676.5a98bd')}</View>
        {!reject && (
          <View className='privacy-bd'>
            <Text>
              {$t('a6c07484.27b596')}
              <Text
                className='privacy-txt'
                onClick={handleClickPrivacy.bind(this, 'member_register')}
              >
                《{info?.member_register}》
              </Text>
              {$t('a6c07484.ab20cc')}
              <Text className='privacy-txt' onClick={handleClickPrivacy.bind(this, 'privacy')}>
                《{info.privacy}》
              </Text>
              {$t('a6c07484.ccd6fb')}
            </Text>
          </View>
        )}
        {reject && (
          <View className='privacy-bd'>
            <Text>
              {ti('a6c07484.13ba83', [info?.member_register || '', info?.privacy || ''])}
              <Text
                className='privacy-txt'
                onClick={handleClickPrivacy.bind(this, 'member_register')}
              >
                《{info?.member_register}》
              </Text>
              {$t('a6c07484.ab20cc')}
              <Text className='privacy-txt' onClick={handleClickPrivacy.bind(this, 'privacy')}>
                《{info.privacy}》
              </Text>
              {$t('a6c07484.70ec5c')}
            </Text>
          </View>
        )}
        {!reject && (
          <View className='privacy-ft'>
            <View className='btn-wrap'>
              <AtButton onClick={handleCancel} className='close'>
                {$t('7c40f12d.7173f8')}
              </AtButton>
            </View>
            <View className='btn-wrap'>
              <AtButton className='allow' onClick={handleConfirm}>
                {$t('7c40f12d.e6a5c3')}
              </AtButton>
            </View>
          </View>
        )}
        {reject && (
          <View className='privacy-ft'>
            <View className='btn-wrap'>
              <AtButton className='allow' onClick={handleConfirm}>
                {$t('a6c07484.4f7259')}
              </AtButton>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

SpPrivacyModal.options = {
  addGlobalClass: true
}

export default SpPrivacyModal
