/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtCurtain } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpImage, SpCheckbox } from '@/components'
import api from '@/api'
import { useTranslation, $t } from '@/i18n'
import './login-curtain.scss'

function LoginCurtain(props) {
  useTranslation()
  const {
    isOpened,
    onClose,
    isNewUser,
    agreeMentChecked,
    onChangePayment,
    handleClickPrivacy,
    handleBindPhone,
    handleUserLogin
  } = props

  const [state, setState] = useImmer({
    icon: '',
    nickname: '',
    logo: '',
    registerName: '',
    privacyName: ''
  })

  useEffect(() => {
    if (isOpened) {
      init()
    }
  }, [isOpened])

  const init = async () => {
    const {
      logo,
      protocol: { member_register, privacy }
    } = await api.shop.getStoreBaseInfo()
    // eslint-disable-next-line no-undef
    const { icon, nickname } = __wxConfig.accountInfo
    setState((draft) => {
      draft.logo = logo
      draft.registerName = member_register
      draft.privacyName = privacy
      draft.icon = icon
      draft.nickname = nickname
    })
  }

  return (
    <AtCurtain isOpened={isOpened} onClose={onClose}>
      <View className='login-modal'>
        <View className='login-modal__hd'>
          <SpImage circle src={state.icon} width={120} height={120} />
          <View className='nick-name'>{state.nickname}</View>
        </View>
        <View className='login-modal__bd'>{$t('7f1268bc.c4c389')}</View>
        <View className='agreement-content'>
          <SpCheckbox checked={agreeMentChecked} onChange={onChangePayment} />
          <View className='agreement-list'>
            <Text className='agreement-name' onClick={() => handleClickPrivacy('member_register')}>
              《{state.registerName}》
            </Text>
            <Text>{$t('7f1268bc.ab20cc')}</Text>
            <Text className='agreement-name' onClick={() => handleClickPrivacy('privacy')}>
              《{state.privacyName}》
            </Text>
          </View>
        </View>
        <View className='login-modal__ft'>
          {isNewUser && (
            <AtButton
              type='primary'
              disabled={!agreeMentChecked}
              openType='getPhoneNumber'
              onGetPhoneNumber={handleBindPhone}
            >
              {$t('7f1268bc.402d19')}
            </AtButton>
          )}
          {!isNewUser && (
            <AtButton type='primary' disabled={!agreeMentChecked} onClick={handleUserLogin}>
              {$t('7f1268bc.402d19')}
            </AtButton>
          )}
        </View>
      </View>
    </AtCurtain>
  )
}

LoginCurtain.options = {
  addGlobalClass: true
}

LoginCurtain.defaultProps = {
  isOpened: false,
  onClose: () => {},
  isNewUser: false,
  agreeMentChecked: false,
  onChangePayment: () => {},
  handleClickPrivacy: () => {},
  handleBindPhone: () => {},
  handleUserLogin: () => {}
}

export default LoginCurtain
