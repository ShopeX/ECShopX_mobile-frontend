import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpImage } from '@/components'
import api from '@/api'
import { classNames, styleNames, navigateTo } from '@/utils'
import { useLogin } from '@/hooks'

import './index.scss'

const initState = {
  logo: '',
  member_register: '',
  privacy: '',
}

function SpPrivacyModal(props) {
  const { login, updatePolicyTime, getUserInfoAuth } = useLogin()
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
    <View
        className={classNames(
          'sp-float-privacy',
          { 'sp-float-privacy__active': open }
        )}
      >
        <View className='sp-float-privacy__overlay'></View>
        <View className='sp-float-privacy__wrap'>
          <View className='privacy-hd'>个人隐私保护指引</View>
          {!reject &&
            <View className='privacy-bd'>
              为了更好的保障你的个人信息安全及权利行使，并允许我们在必要场景下，合理使用你的个人信息，并充分保障你的合法权，请仔细阅读并理解
              <Text
                className='privacy-txt'
                onClick={handleClickPrivacy.bind(this, 'member_register')}
              >
                《{info?.member_register}》
              </Text>
              和
              <Text
                className='privacy-txt'
                onClick={handleClickPrivacy.bind(this, 'privacy')}
              >
              《{info.privacy}》
              </Text>
              的内容。
            </View>
          }
          {reject &&
            <View className='privacy-bd'>
              你拒绝了{info?.member_register}和{info.privacy}，我们将无法为您提供相应的服务。请同意
              <Text
                className='privacy-txt'
                onClick={handleClickPrivacy.bind(this, 'member_register')}
              >
                《{info?.member_register}》
              </Text>
              和
              <Text
                className='privacy-txt'
                onClick={handleClickPrivacy.bind(this, 'privacy')}
              >
              《{info.privacy}》
              </Text>
              以便我们为你提供更优质的服务！如果你拒绝可自行退出。
            </View>
          }
          {!reject &&
            <View className='privacy-ft'>
              <View className='btn-wrap'>
                <AtButton onClick={handleCancel} className='close'>拒绝</AtButton>
              </View>
              <View className='btn-wrap'>
                <AtButton className='allow' onClick={handleConfirm}>
                  允许
                </AtButton>
              </View>
            </View>
          }
          {reject &&
            <View className='privacy-ft'>
              <View className='btn-wrap'>
                <AtButton className='allow'  onClick={handleConfirm}>
                  同意并继续
                </AtButton>
              </View>
            </View>
          }
        </View>
      </View>
  )
}

SpPrivacyModal.options = {
  addGlobalClass: true
}

export default SpPrivacyModal
