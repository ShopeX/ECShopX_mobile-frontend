import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import userIcon from '@/assets/imgs/user-icon.png'
import { SpFloatPrivacyShort } from '@/components'
import { useLogin } from '@/hooks'
import './select-role.scss'
import CompBottomTip from './comps/comp-bottomTip'

const initialState = {
  isRole: true,
  isLogin: false,
  policyModal: false,
  userInfo: {
    avatar: '',
    phone: 17777778987
  }
}

function SelectRole(props) {

  const [state, setState] = useImmer(initialState)

  const { isLogin, isRole, policyModal, userInfo } = state
  const $instance = getCurrentInstance()
  const { isLogin: isRouterLogin = false, isRole: isRouterRole = true } = $instance.router.params || {}

  useEffect(() => {
    setState(draft => {
      draft.isLogin = JSON.parse(isRouterLogin)
      draft.isRole = JSON.parse(isRouterRole)
    })
  }, [])

  const handleCloseModal = useCallback(() => {
    setState(draft => {
      draft.policyModal = false
    })
  }, [])

  // 同意隐私协议
  const handleConfirmModal = useCallback(async () => {
    setState(draft => {
      draft.policyModal = false
    })
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

  const handleConfirmClick = async(type)=>{
    if (type === 'friend') {
      Taro.showModal({
        title: '亲友验证说明',
        content: `如果您是亲友，请通过员工分享的活动链接认证；如果您是员工，请在上一页面中点击「我是员工」验证身份`,
        // confirmColor: colorPrimary,
        confirmColor:'#F4811F',
        showCancel: false,
        confirmText: '我知道了'
      })
    } else {
      Taro.navigateTo({
        url: `/subpages/purchase/select-company`
      })
    }
  }

  const handleBindPhone = async (e) => {
    const { encryptedData, iv } = e.detail
    if (encryptedData && iv) {
      console.log(e.detail)
      Taro.navigateTo({ url: `/subpages/purchase/select-company-activity` })
    }
  }

  return (
    <View className='select-role'>
      {/* 隐私协议 */}
      <SpFloatPrivacyShort isOpened={policyModal} onClose={handleCloseModal} />

      <View className='header'>
        <Image
          className='header-avatar'
          src={userInfo.avatar || `${process.env.APP_IMAGE_CDN}/user_icon.png`}
          mode='aspectFill'
        />
        <Text className='welcome'>欢迎登录</Text>
        <Text className='title'>上海商派员工亲友购</Text>
      </View>
      <View className='btns'>
        {isRole && !isLogin && (
          <>
            <AtButton circle className='btns-staff button' onClick={() => handleConfirmClick('staff')}>
              我是员工&nbsp;
              <Text className='iconfont icon-qianwang-011 icon'></Text>
            </AtButton>
            <AtButton circle className='btns-friend button' onClick={() => handleConfirmClick('friend')}>
              我是亲友&nbsp;
              <Text className='iconfont icon-qianwang-011 icon'></Text>
            </AtButton>
          </>
        )}
        {!isRole && isLogin &&
          <>
            <View className='btns-account'>
              已授权账号：<Text className='account'>{userInfo.phone}</Text>
            </View>
            <AtButton circle className='btns-staff button login'>
              确认登录
            </AtButton>
          </>
        }
        {!isRole && !isLogin && <AtButton openType='getPhoneNumber' onGetPhoneNumber={handleBindPhone} circle className='btns-weixin button'>微信授权登录</AtButton>}
      </View>
      <CompBottomTip />
    </View>
  )
}

SelectRole.options = {
  addGlobalClass: true
}

export default SelectRole
