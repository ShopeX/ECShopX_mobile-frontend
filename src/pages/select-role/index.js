import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useSelector, useDispatch } from 'react-redux'
import api from '@/api'
import { showToast, VERSION_IN_PURCHASE } from '@/utils'
import { SpFloatPrivacyShort } from '@/components'
import { useLogin } from '@/hooks'
import CompBottomTip from '@/subpages/purchase/comps/comp-bottomTip'
import { updateInviteCode } from '@/store/slices/purchase'

import './index.scss'
function SelectRole(props) {
  const { isLogin, checkPolicyChange } = useLogin({
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })
  const { userInfo = {} } = useSelector((state) => state.user)
  const { appName, appLogo } = useSelector((state) => state.sys)
  const [policyModal, setPolicyModal] = useState(false)
  const [reject, setReject] = useState(false)
  const $instance = getCurrentInstance()
  const { code: invite_code } = $instance.router.params || {}
  const dispatch = useDispatch()

  useEffect(() => {
    checkPrivacy()
    dispatch(updateInviteCode(invite_code))
  }, [])

  const checkPrivacy = async () => {
    const checkRes = await checkPolicyChange()
    if (!checkRes) {
      setPolicyModal(true)
      return
    }
  }

  const handleCloseModal = useCallback(() => {
    setReject(true)
  }, [])

  // 同意隐私协议
  const handleConfirmModal = useCallback(async () => {
    setPolicyModal(false)
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
      validatePhone()
    }
  }

  const validatePhone = async () => {
    try {
      await api.purchase.getEmployeeRelativeBind({ invite_code })
      showToast('验证成功')
      setTimeout(() => {
        Taro.navigateTo({ url: `/subpages/purchase/select-company-activity` })
      }, 2000)
    } catch (e) {
      // Taro.showModal({
      //   title: VERSION_IN_PURCHASE ? '登录失败' : '验证失败',
      //   content: `手机号码错误，请更换手机号`,
      //   confirmColor:'#F4811F',
      //   showCancel: VERSION_IN_PURCHASE,
      //   confirmText: VERSION_IN_PURCHASE ? '重新授权' : '我知道了',
      //   cancelText: '取消',
      //   cancelColor: '#aaa',
      //   success: () => {
      //     Taro.navigateTo({ url: `/subpages/purchase/select-company-activity` })
      //   }
      // })
    }
  }

  const handlePassClick = () => {
    Taro.redirectTo({ url: `/subpages/purchase/select-company-activity` })
  }

  return (
    <View className='select-role'>
      {/* 隐私协议 */}
      <SpFloatPrivacyShort
        open={policyModal}
        reject={reject}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmModal}
      />

      <View className='header'>
        <Image
          className='header-avatar'
          src={appLogo}
          mode='aspectFill'
        />
        <Text className='welcome'>欢迎登录</Text>
        <Text className='title'>{appName}</Text>
      </View>
      <View className='btns'>
        {!invite_code && (
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
        {invite_code && isLogin && VERSION_IN_PURCHASE && // 无商城，已登录亲友验证、绑定
          <>
            <View className='btns-account'>
              已授权账号：<Text className='account'>{userInfo?.mobile}</Text>
            </View>
            <AtButton onClick={validatePhone} circle className='btns-staff button login'>
              确认登录
            </AtButton>
          </>
        }
        {invite_code && isLogin && !VERSION_IN_PURCHASE && // 有商城，已登录亲友验证、绑定
          <>
            <View className='validate-pass'>验证通过</View>
            <AtButton circle className='btns-staff button login' onClick={handlePassClick}>
              继续
            </AtButton>
          </>
        }
        {invite_code && !isLogin && // 有/无商城，未登录亲友验证、绑定
          <AtButton
            openType='getPhoneNumber'
            onGetPhoneNumber={handleBindPhone}
            circle
            className='btns-weixin button'
          >
            微信授权登录
          </AtButton>}
      </View>
      <CompBottomTip />
    </View>
  )
}

SelectRole.options = {
  addGlobalClass: true
}

export default SelectRole
