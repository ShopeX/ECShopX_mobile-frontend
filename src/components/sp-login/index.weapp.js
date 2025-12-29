/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'
import { View, Text, Button } from '@tarojs/components'
import { AtButton, AtCurtain } from 'taro-ui'
import { useImmer } from 'use-immer'
import S from '@/spx'
import api from '@/api'
import { isWeixin, isAlipay, classNames, showToast, entryLaunch } from '@/utils'
import { SG_SHARER_UID, SG_TRACK_PARAMS, SG_ROUTER_PARAMS, SG_GUIDE_PARAMS } from '@/consts'
import { Tracker } from '@/service'
import { SpPrivacyModal, SpImage, SpCheckbox } from '@/components'
import { useSelector } from 'react-redux'
import { useLogin, useLocation } from '@/hooks'
import './index.scss'

const initialState = {
  logo: '',
  registerName: '',
  privacyName: '',
  agreeMentChecked: false
}

const SpLogin = forwardRef((props, ref) => {
  const { children, className, visible, onPolicyClose, onChange, onClose } = props
  const { updateAddress } = useLocation()
  const { shopInfo } = useSelector((state) => state.shop)
  const { isNewUser } = useSelector((state) => state.user)

  const { isLogin, login, setToken, checkPolicyChange } = useLogin({
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    },
    loginSuccess: () => {
      // TODO 需要优化
      !visible && updateAddress && updateAddress()
    }
  })
  const [policyModal, setPolicyModal] = useState(false)
  const [loginModal, setLoginModal] = useState(false)
  const [state, setState] = useImmer(initialState)
  const { logo, registerName, privacyName, agreeMentChecked } = state
  const codeRef = useRef()

  useEffect(() => {
    if (visible) {
      setLoginModal(true)
    }
  }, [visible])

  useEffect(() => {
    if (loginModal) {
      fetchPrivacyData()
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

  const fetchPrivacyData = async () => {
    const { logo, protocol } = await api.shop.getStoreBaseInfo()
    const { member_register, privacy } = protocol
    setState((draft) => {
      draft.logo = logo
      draft.registerName = member_register
      draft.privacyName = privacy
    })
  }

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
      Taro.showLoading({ title: '' })

      // const { uid } = entryLaunch.getLaunchParams()
      const { uid, dtid } = Taro.getStorageSync(SG_ROUTER_PARAMS)
      const { gu_user_id, gu } = Taro.getStorageSync(SG_GUIDE_PARAMS)
      if (uid) {
        // 分销绑定
        params['uid'] = uid
      }

      if (shopInfo.distributor_id) {
        params['distributor_id'] = shopInfo.distributor_id
      }
      if (dtid && dtid !== 'undefined') {
        params['distributor_id'] = dtid
      }
      let work_userid = ''
      if (gu_user_id) {
        work_userid = gu_user_id
      }
      if (gu) {
        work_userid = gu.split('_')[0]
      }
      // gu_user_id: 欢迎语上带过来的员工编号, 同work_user_id
      if (work_userid) {
        params['channel'] = 1
        params['work_userid'] = work_userid
      }

      try {
        const { token, is_new } = await api.wx.newlogin(params)
        if (token) {
          setToken(token)
          Taro.hideLoading()
          setLoginModal(false)
          showToast('恭喜您，注册成功')
          onChange && onChange()
        } else {
          showToast('注册失败')
        }
      } catch (error) {
        Taro.hideLoading()
      }
    }
  }

  const handleCloseModal = useCallback(() => {
    setPolicyModal(false)
    onPolicyClose && onPolicyClose()
  }, [])

  // 同意隐私协议
  const handleConfirmModal = useCallback(async () => {
    setPolicyModal(false)
    handleUserLogin()
  }, [])

  // 登录
  const handleClickLogin = async (e) => {
    e.stopPropagation()
    const { scene } = Taro.getLaunchOptionsSync()
    // 微信朋友圈打开场景
    if (scene == 1154) {
      return showToast('请前往小程序使用完整服务')
    }
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

  // 已注册会员登录
  const handleUserLogin = async () => {
    try {
      await login()
      setLoginModal(false)
      onChange && onChange()
    } catch (e) {
      console.log('[sp-login] handleUserLogin error:', e)
    }
  }

  useImperativeHandle(ref, () => ({
    _setPolicyModal: () => {
      setPolicyModal(true)
    },
    handleToLogin: () => {
      setLoginModal(true)
    }
  }))

  const handleClickPrivacy = (type) => {
    Taro.navigateTo({
      url: `/subpages/auth/reg-rule?type=${type}`
    })
  }

  const onChangePayment = (e) => {
    setState((draft) => {
      draft.agreeMentChecked = e
    })
  }

  // eslint-disable-next-line no-undef
  const { icon, nickname } = __wxConfig.accountInfo

  const handleClick = async () => {
    if (isLogin) {
      onChange && onChange()
    } else {
      Taro.showLoading()
      await handleUserLogin()
      Taro.hideLoading()
      // 自动
      setLoginModal(true)
    }
  }

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
          onClose()
          setLoginModal(false)
        }}
      >
        <View className='login-modal'>
          <View className='login-modal__hd'>
            <SpImage circle src={icon.replace(/^http:/, 'https:')} width={120} height={120} />
            <View className='nick-name'>{nickname}</View>
          </View>
          <View className='login-modal__bd'>登录手机号，查看全部订单和优惠券</View>
          <View className='agreement-content'>
            <SpCheckbox checked={agreeMentChecked} onChange={onChangePayment} />
            <View className='agreement-list'>
              <Text
                className='agreement-name'
                onClick={handleClickPrivacy.bind(this, 'member_register')}
              >
                《{registerName}》
              </Text>
              和
              <Text className='agreement-name' onClick={handleClickPrivacy.bind(this, 'privacy')}>
                《{privacyName}》
              </Text>
            </View>
          </View>
          <View className='login-modal__ft'>
            {isNewUser && (
              <AtButton
                type='primary'
                disabled={!agreeMentChecked}
                openType='getPhoneNumber'
                onGetPhoneNumber={handleBindPhone}
              >
                登录
              </AtButton>
            )}
            {!isNewUser && (
              <AtButton type='primary' disabled={!agreeMentChecked} onClick={handleUserLogin}>
                登录
              </AtButton>
            )}
          </View>
        </View>
      </AtCurtain>
    </View>
  )
})

SpLogin.defaultProps = {
  visible: false,
  onChange: () => {},
  onClose: () => {}
}

SpLogin.options = {
  addGlobalClass: true
}

export default SpLogin
