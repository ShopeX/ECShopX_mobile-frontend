import Taro from '@tarojs/taro'
import React, { useEffect, useState, useCallback, useRef, useImperativeHandle } from 'react'
import { View, Button } from '@tarojs/components'
import { AtButton, AtCurtain } from 'taro-ui'
import { useImmer } from 'use-immer'
import S from '@/spx'
import api from '@/api'
import { isWeixin, isAlipay, classNames, showToast, entryLaunch } from '@/utils'
import { SG_SHARER_UID, SG_TRACK_PARAMS, SG_ROUTER_PARAMS, SG_GUIDE_PARAMS } from '@/consts'
import { Tracker } from '@/service'
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

  useEffect(() => {
    if (loginModal) {
      Taro.login({
        success: ({ code }) => {
          codeRef.current = code
        },
        fail: (e) => {
          console.error('[sp-login] taro login fail:', e)
        }
      })
    }
  }, [loginModal])

  const handleBindPhone = async (e) => {
    const { encryptedData, iv, cloudID } = e.detail
    if (encryptedData && iv) {
      const code = codeRef.current
      let params = {
        code,
        encryptedData,
        iv,
        cloudID,
        user_type: 'wechat',
        auth_type: 'wxapp'
      }
      // 内购分享码
      const { code: purchaseCode } = Taro.getStorageSync(SG_ROUTER_PARAMS)
      if (purchaseCode) {
        params = {
          ...params,
          purchanse_share_code: purchaseCode
        }
      }
      Taro.showLoading()

      // const { uid } = entryLaunch.getLaunchParams()
      const { uid } = Taro.getStorageSync(SG_ROUTER_PARAMS)
      const { gu_user_id } = Taro.getStorageSync(SG_GUIDE_PARAMS)
      if (uid) {
        // 分销绑定
        params['uid'] = uid
      }
      // gu_user_id: 欢迎语上带过来的员工编号, 同work_user_id
      if (gu_user_id) {
        params['channel'] = 1
        params['work_userid'] = gu_user_id
      }

      try {
        const { token, is_new } = await api.wx.newlogin(params)
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

  // eslint-disable-next-line no-undef
  const { icon, nickname } = __wxConfig.accountInfo

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
            <SpImage circle src={icon} width={120} height={120} />
            <View className='nick-name'>{nickname}</View>
          </View>
          <View className='login-modal__bd'>登录手机号，查看全部订单和优惠券</View>
          <View className='login-modal__ft'>
            <AtButton type='primary' openType='getPhoneNumber' onGetPhoneNumber={handleBindPhone}>
              登录
            </AtButton>
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
