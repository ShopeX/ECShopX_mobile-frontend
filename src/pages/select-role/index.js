import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { SpFloatPrivacyShort, SpLogin } from '@/components'
import { AtButton } from 'taro-ui'
import { showToast } from '@/utils'
import { useLogin } from '@/hooks'
import S from '@/spx'
import api from '@/api'
import { useSelector, useDispatch } from 'react-redux'
import CompBottomTip from '@/subpages/purchase/comps/comp-bottomTip'
import { updateInviteCode } from '@/store/slices/purchase'

import './index.scss'

function SelectRole(props) {
  const { isLogin, checkPolicyChange, isNewUser, setToken, login } = useLogin({
    autoLogin: true,
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })
  const { userInfo = {} } = useSelector((state) => state.user)
  const { appName, appLogo } = useSelector((state) => state.sys)
  const [ policyModal, setPolicyModal ] = useState(false)
  const [ reject, setReject ] = useState(false)
  const [ userEnterprises, setUserEnterprises ] = useState([])
  const $instance = getCurrentInstance()
  const { code: invite_code, type = '' } = $instance.router.params || {}
  const dispatch = useDispatch()
  const codeRef = useRef()

  useEffect(() => {
    checkPrivacy()
    dispatch(updateInviteCode(invite_code))
  }, [])

  useEffect(() => {
    if (!S.getAuthToken()) {
      Taro.login({
        success: ({ code }) => {
          codeRef.current = code
        },
        fail: (e) => {
          console.error('[sp-login] taro login fail:', e)
        }
      })
    }
  }, [])

  useEffect(() => {
    if (!type && !invite_code && (userInfo?.is_relative || userInfo?.is_employee)) { // type：渠道是添加身份
      getUserEnterprises()
    }
  }, [userInfo])

  const getUserEnterprises = async () => {
    const data = await api.purchase.getUserEnterprises({ disabled: 0 })
    setUserEnterprises(data)
    if (data?.length > 0) {
      Taro.reLaunch({ url: '/subpages/purchase/select-company-activity' })
    }
  }

  const checkPrivacy = async () => {
    const checkRes = await checkPolicyChange()
    if (!checkRes) {
      setPolicyModal(true)
      return
    }
  }

  const handleCloseModal = () => {
    setReject(true)
  }

  // 同意隐私协议
  const handleConfirmModal = async () => {
    if (!isNewUser) {
      await login()
    }
    setPolicyModal(false)
  }

  const handleConfirmClick = async(type) => {
    if (type === 'friend') {
      Taro.showModal({
        title: '亲友验证说明',
        content: `如果您是亲友，请通过员工分享的活动链接认证；如果您是员工，请在上一页面中点击「我是员工」验证身份`,
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
      const code = codeRef.current
      const params = {
        code,
        encryptedData,
        iv,
        cloudID,
        user_type: 'wechat',
        auth_type: 'wxapp',
        invite_code
      }
      const { token } = await api.wx.newlogin(params)
      setToken(token)
      Taro.showToast({
        icon: 'success',
        title: '验证成功'
      })
      setTimeout(() => {
        Taro.reLaunch({ url: `/subpages/purchase/select-company-activity` })
      }, 2000)
    }
  }

  const validatePhone = async () => {
    try {
      await api.purchase.getEmployeeRelativeBind({ invite_code, showError: false })
      showToast('验证成功')
      setTimeout(() => {
        Taro.reLaunch({ url: `/subpages/purchase/select-company-activity` })
      }, 2000)
    } catch (e) {
      console.log(e)
      Taro.showModal({
        content: e,
        confirmText: '我知道了',
        showCancel: false,
        success: () => {
          Taro.reLaunch({ url: `/subpages/purchase/select-company-activity` })
        }
      })
    }
  }

  const handlePassClick = () => {
    Taro.reLaunch({ url: `/subpages/purchase/select-company-activity` })
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
        {(!invite_code && !isLogin || !invite_code && type || !invite_code && userEnterprises.length == 0) && 
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
        }
        {invite_code && isLogin && userInfo?.is_relative && // 有/无商城，已登录亲友验证、绑定
          <>
            <View className='validate-pass'>验证通过</View>
            <AtButton circle className='btns-staff button login' onClick={handlePassClick}>
              继续
            </AtButton>
          </>
        }
        {invite_code && isLogin && !userInfo?.is_relative &&
          <AtButton
            circle
            className='btns-weixin button'
            onClick={validatePhone}
          >
            微信授权登录
          </AtButton>
        }
        {invite_code && isNewUser && // 有/无商城，未登录亲友验证、绑定
          <AtButton
            openType='getPhoneNumber'
            onGetPhoneNumber={handleBindPhone}
            circle
            className='btns-weixin button'
          >
            微信授权登录
          </AtButton>
        }
      </View>
      <CompBottomTip />
    </View>
  )
}

SelectRole.options = {
  addGlobalClass: true
}

export default SelectRole
