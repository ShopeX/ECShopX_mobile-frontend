import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { View, Text, Image, RootPortal } from '@tarojs/components'
import { SpPrivacyModal, SpPage, SpLogin, SpModal } from '@/components'
import { AtButton } from 'taro-ui'
import { showToast } from '@/utils'
import { useLogin, useModal } from '@/hooks'
import S from '@/spx'
import api from '@/api'
import { useSelector, useDispatch } from 'react-redux'
import CompBottomTip from '@/subpages/purchase/comps/comp-bottomTip'
import { updateInviteCode } from '@/store/slices/purchase'

import './auth.scss'

function PurchaseAuth() {
  const { isLogin, checkPolicyChange, isNewUser, setToken, login } = useLogin({
    autoLogin: true,
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })

  const { userInfo = {} } = useSelector((state) => state.user)
  const { appName, appLogo } = useSelector((state) => state.sys)
  const [policyModal, setPolicyModal] = useState(false)
  const [userEnterprises, setUserEnterprises] = useState([])
  const { params } = useRouter()
  const { code: invite_code, type = '' } = params
  const dispatch = useDispatch()
  const codeRef = useRef()
  const { showModal } = useModal()

  useEffect(() => {
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
    Taro.setNavigationBarTitle({
      title: appName
    })
  }, [appName])

  useEffect(() => {
    if (!type && !invite_code && (userInfo?.is_relative || userInfo?.is_employee)) { // type：渠道是添加身份,不能跳转到活动列表页
      getUserEnterprises()
    }
  }, [userInfo])

  const getUserEnterprises = async () => {
    const data = await api.purchase.getUserEnterprises({ disabled: 0 })
    setUserEnterprises(data)
    if (data?.length > 0) {
      Taro.reLaunch({ url: '/pages/purchase/index' })
    }
  }

  const onRejectPolicy = () => {
    Taro.exitMiniProgram()
  }

  // 同意隐私协议
  const onResolvePolicy = async () => {
    setPolicyModal(false)
    if (!isNewUser) {
      await login()
    }
  }

  const handleConfirmClick = async (type) => {
    if (type === 'friend') {
      const { confirm } = await showModal({
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
    const { encryptedData, iv, cloudID } = e.detail
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
      showToast('验证成功')
      setTimeout(() => {
        Taro.reLaunch({ url: `/pages/purchase/index` })
      }, 700)
    }
  }

  const validatePhone = async () => {
    try {
      await api.purchase.getEmployeeRelativeBind({ invite_code, showError: false })
      showToast('验证成功')
      setTimeout(() => {
        Taro.reLaunch({ url: `/pages/purchase/index` })
      }, 700)
    } catch (e) {
      console.log(e)
      Taro.showModal({
        content: e.message || e,
        confirmText: '我知道了',
        showCancel: false,
        success: () => {
          Taro.reLaunch({ url: `/pages/purchase/index` })
        }
      })
    }
  }

  const handlePassClick = () => {
    Taro.reLaunch({ url: `/pages/purchase/index` })
  }

  return (
    <SpPage className='purchase-auth' >
      {/* 隐私协议 */}
      <SpPrivacyModal open={policyModal} onCancel={onRejectPolicy} onConfirm={onResolvePolicy} />

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

        {!invite_code && (!isLogin || type || userEnterprises.length == 0) &&
          <>
            <AtButton circle className='btns-staff button' onClick={() => handleConfirmClick('staff')}>
              我是员工
            </AtButton>
            <AtButton circle className='btns-friend button' onClick={() => handleConfirmClick('friend')}>
              我是亲友
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
            手机号授权登录
          </AtButton>
        }

        {invite_code && isNewUser && // 有/无商城，未登录亲友验证、绑定
          <AtButton
            openType='getPhoneNumber'
            onGetPhoneNumber={handleBindPhone}
            circle
            className='btns-weixin button'
          >
            手机号授权登录
          </AtButton>
        }
      </View>
      <CompBottomTip />
    </SpPage>
  )
}

PurchaseAuth.options = {
  addGlobalClass: true
}

export default PurchaseAuth
