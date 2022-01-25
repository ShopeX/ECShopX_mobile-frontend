import Taro from '@tarojs/taro'
import { useState, useCallback } from 'react'
import { View, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import S from '@/spx'
import api from '@/api'
import { isWeixin, isAlipay, classNames, showToast, entryLaunch } from '@/utils'
import { SG_SHARER_UID, SG_TRACK_PARAMS } from '@/consts'
import { Tracker } from '@/service'
import { SpPrivacyModal } from '@/components'
import { useLogin } from '@/hooks'
import './index.scss'

function SpLogin (props) {
  const { children, className, onChange } = props
  const { isLogin, login, updatePolicyTime, setToken } = useLogin({
    policyUpdateHook: () => {
      setPolicyModal(true)
    }
  })
  const [isNewUser, setIsNewUser] = useState(false)
  const [policyModal, setPolicyModal] = useState(false)

  const handleClickLogin = async () => {
    try {
      await login()
    } catch (e) {
      setIsNewUser(true)
    }
  }

  const handleBindPhone = async (e) => {
    const { encryptedData, iv, cloudID } = e.detail
    if (encryptedData && iv) {
      const { code } = await Taro.login()
      const params = {
        code,
        encryptedData,
        iv,
        cloudID,
        user_type: 'wechat',
        auth_type: 'wxapp'
      }
      Taro.showLoading()

      const { uid } = entryLaunch.getLaunchParams()
      if (uid) {
        // 分销绑定
        params['uid'] = uid
      }

      const { token, is_new } = await api.wx.newlogin(params)
      if (token) {
        setToken(token)
      }
      showToast('恭喜您，注册成功')

      // Taro.hideLoading();
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

  return (
    <View className={classNames('sp-login', className)}>
      {isLogin && <View onClick={handleOnChange}>{children}</View>}

      {!isLogin && isNewUser && (
        <Button className='login-btn' openType='getPhoneNumber' onGetPhoneNumber={handleBindPhone}>
          {children}
        </Button>
      )}

      {!isLogin && !isNewUser && <View onClick={handleClickLogin}>{children}</View>}

      <SpPrivacyModal
        open={policyModal}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmModal}
      />
    </View>
  )
}

SpLogin.options = {
  addGlobalClass: true
}

export default SpLogin
