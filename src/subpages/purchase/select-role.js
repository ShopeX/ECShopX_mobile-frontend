import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-role.scss'
import userIcon from '@/assets/imgs/user-icon.png'
import CompBottomTip from './comps/comp-bottomTip'
import { SpPrivacyModal, SpFloatPrivacy } from '@/components'

const initialState = {}

function SelectRole(props) {
  const [userInfo, setUserInfo] = useState({
    avatar: '',
    phone: 17777778987
  })

  const [isRole, setIsRole] = useState(false)

  const [isLogin, setIsLogin] = useState(false)
  const [policyModal, setPolicyModal] = useState(true)

  useEffect(() => {}, [])

  const handleCloseModal = useCallback(() => {
    setPolicyModal(false)
  }, [])

  // 同意隐私协议
  const handleConfirmModal = useCallback(async () => {
    setPolicyModal(false)
    // if (isNewUser) {
    //   return setLoginModal(true)
    // } else {
    //   try {
    //     await login()
    //   } catch (e) {
    //     setLoginModal(true)
    //   }
    // }
  }, [])

  return (
    <View className='select-role'>
      {/* 隐私协议 */}
      <SpFloatPrivacy isOpened={policyModal} onClose={handleCloseModal} />

      <View className='header'>
        <Image
          className='header-avatar'
          src={userInfo.avatar || `${process.env.APP_IMAGE_CDN}/user_icon.png`}
          mode='aspectFill'
        />
        <Text className='welcome'>欢迎登陆</Text>
        <Text className='title'>上海商派员工亲友购</Text>
      </View>
      <View className='btns'>
        {isRole && (
          <>
            <AtButton circle className='btns-staff button'>
              我是员工&nbsp;
              <Text className='iconfont icon-qianwang-011 icon'></Text>
            </AtButton>
            <AtButton circle className='btns-friend button'>
              我是亲友&nbsp;
              <Text className='iconfont icon-qianwang-011 icon'></Text>
            </AtButton>
          </>
        )}
        {!isRole && isLogin ? (
          <>
            <View className='btns-account'>
              已授权账号：<Text className='account'>{userInfo.phone}</Text>
            </View>
            <AtButton circle className='btns-staff button login'>
              确认登陆
            </AtButton>
          </>
        ) : (
          <AtButton circle className='btns-weixin button'>
            微信授权登录
          </AtButton>
        )}
      </View>
      <CompBottomTip />
    </View>
  )
}

SelectRole.options = {
  addGlobalClass: true
}

export default SelectRole
