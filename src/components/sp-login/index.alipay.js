import Taro from '@tarojs/taro'
import React, { useEffect, useState, useCallback, useRef, useImperativeHandle } from 'react'
import { View, Button } from '@tarojs/components'
import { AtButton, AtCurtain } from 'taro-ui'
import S from '@/spx'
import api from '@/api'
import { classNames, showToast, alipayAutoLogin } from '@/utils'

import { SpPrivacyModal, SpImage } from '@/components'
import { useLogin } from '@/hooks'
import './index.scss'

function SpLogin(props, ref) {
  const { children, className, onChange, newUser = false } = props
  const { isLogin, login, setToken, checkPolicyChange } = useLogin({
    policyUpdateHook: (isUpdate) => {
      // isUpdate && setPolicyModal(true)
    }
  })
  const [isNewUser, setIsNewUser] = useState(false)
  const [policyModal, setPolicyModal] = useState(false)
  const [loginModal, setLoginModal] = useState(false)
  const codeRef = useRef()

  useEffect(() => {
    if (newUser) {
      setIsNewUser(true)
    }
  }, [newUser])

  useEffect(async () => {
    if (loginModal) {
      const { code } = await alipayAutoLogin()
      codeRef.current = code
    }
  }, [loginModal])


  const getPhoneNumber = () => {
    return new Promise((resolve, reject) => {
      my.getPhoneNumber({
        success: (res) => {
          resolve(res)
        },
        fail: (res) => {
          console.error('[sp-login] taro login getPhoneNumber fail')
          reject(res)
        }
      })
    })
  }

  const onGetAuthorize = async () => {
    const res = await getPhoneNumber()
    const encryptedData = JSON.parse(res.response).response;
    if (encryptedData) {
      const code = codeRef.current
      let params = {
        code,
        encryptedData,
        auth_type: 'aliapp'
      }
      Taro.showLoading()

      try {
        const { token } = await api.alipay.alipay_login(params)
        if (token) {
          setToken(token)
          Taro.hideLoading()
          setLoginModal(false)
          showToast('恭喜您，注册成功')
          onChange && onChange()
        }
      } catch (error) {
        Taro.hideLoading()
      }
    }
  }

  const handleCloseModal = useCallback(() => {
    setPolicyModal(false)
  }, [])

  // 同意隐私协议
  const handleConfirmModal = useCallback(async () => {
    setPolicyModal(false)
    if (isNewUser) {
      return setLoginModal(true)
    } else {
      try {
        await login()
      } catch (e) {
        setLoginModal(true)
      }
    }
  }, [])

  // 登录
  const handleClickLogin = async () => {
    const checkRes = await checkPolicyChange()
    if (!checkRes) {
      setPolicyModal(true)
      return
    }
    if (isLogin) {
      onChange && onChange()
    } else {
      setLoginModal(true)
    }
  }

  useImperativeHandle(ref, () => ({
    _setPolicyModal: () => {
      setPolicyModal(true)
    }
  }))


  return (
    <View className={classNames('sp-login', className)}>
      <View onClick={handleClickLogin}>{children}</View>

      {/* 隐私协议 */}
      <SpPrivacyModal
        open={policyModal}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmModal}
      />

      {/* 授权登录 */}
      <AtCurtain
        isOpened={loginModal}
        onClose={() => {
          setLoginModal(false)
        }}
      >
        <View className='login-modal'>
          <View className='login-modal__hd'>
            <View className='nick-name'>''</View>
          </View>
          <View className='login-modal__bd'>登录手机号，查看全部订单和优惠券</View>
          <View className='login-modal__ft'>
            <button className='alipay-button--primary' type='primary' open-type='getAuthorize' scope='phoneNumber' onGetAuthorize={onGetAuthorize}>
              登录
            </button>
          </View>
        </View>
      </AtCurtain>
    </View>
  )
}

SpLogin.options = {
  addGlobalClass: true
}

export default React.forwardRef(SpLogin)
