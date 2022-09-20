import Taro from '@tarojs/taro'
import React, { useEffect, useState, useCallback } from 'react'
import { View, Button } from '@tarojs/components'
import { AtButton, AtCurtain } from 'taro-ui'
import S from '@/spx'
import api from '@/api'
import { isWeixin, isAlipay, classNames, showToast, entryLaunch } from '@/utils'
import { SG_SHARER_UID, SG_TRACK_PARAMS, SG_ROUTER_PARAMS, SG_GUIDE_PARAMS } from '@/consts'
import { Tracker } from '@/service'
import { SpPrivacyModal, SpImage } from '@/components'
import { useLogin } from '@/hooks'
import './index.scss'

function SpLogin(props) {
  const { children, className, onChange, newUser = false } = props
  const { isLogin, login, updatePolicyTime, setToken } = useLogin({
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })

  const [isNewUser, setIsNewUser] = useState(false)
  const [policyModal, setPolicyModal] = useState(false)
  const [loginModal, setLoginModal] = useState(false)

  useEffect(() => {
    if (newUser) {
      setIsNewUser(true)
    }
  }, [newUser])

  const handleClickLogin = async () => {
    try {
      await login()
      onChange && onChange()
    } catch (e) {
      setIsNewUser(true)
    }
  }

  const handleBindPhone = async (e) => {
    const { encryptedData, iv, cloudID } = e.detail
    if (encryptedData && iv) {
      const { code } = await Taro.login()
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
          showToast('恭喜您，注册成功')
          onChange && onChange()
        }
      } catch (error) {
        Taro.hideLoading()
      }
    }
  }

  const handleOnChange = () => {
    onChange && onChange()
  }

  const handleCloseModal = useCallback(() => {
    setPolicyModal(false)
  }, [])

  const handleConfirmModal = useCallback(async () => {
    // 自动登录
    try {
      await login()
      onChange && onChange()
    } catch (e) {
      console.log(e)
      setIsNewUser(true)
    }
    setPolicyModal(false)
  }, [])

  const handleClick = () => {
    if (isLogin) {
      onChange && onChange()
    } else {
      setLoginModal(true)
    }
  }

  console.log('newUser:', newUser, isNewUser)

  const { icon, nickname } = __wxConfig.accountInfo

  return (
    <View className={classNames('sp-login', className)}>
      <View onClick={handleClick}>{children}</View>
      {/* {isLogin && <View onClick={handleOnChange}>{children}</View>}

      {!isLogin && isNewUser && (
        <Button className='login-btn' openType='getPhoneNumber' onGetPhoneNumber={handleBindPhone}>
          {children}
        </Button>
      )}

      {!isLogin && !isNewUser && <View onClick={handleClickLogin}>{children}</View>} */}

      <SpPrivacyModal
        open={policyModal}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmModal}
      />

      <AtCurtain isOpened={loginModal}>
        <View className='login-modal'>
          <View className='login-modal__hd'>
            <SpImage circle src={icon} width={120} height={120} />
            <View className='nick-name'>{nickname}</View>
          </View>
          <View className='login-modal__bd'>登录手机号，查看全部订单和优惠券</View>
          <View className='login-modal__ft'>
            <AtButton type='primary' />
          </View>
        </View>
      </AtCurtain>
    </View>
  )
}

SpLogin.options = {
  addGlobalClass: true
}

export default SpLogin
