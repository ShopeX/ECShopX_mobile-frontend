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
import { isWeixin, isAlipay, classNames, showToast, entryLaunch, getDistributorId } from '@/utils'
import { SG_SHARER_UID, SG_TRACK_PARAMS, SG_ROUTER_PARAMS, SG_GUIDE_PARAMS } from '@/consts'
import { Tracker } from '@/service'
import { SpPrivacyModal, SpImage, SpCheckbox } from '@/components'
import { useSelector, useDispatch } from 'react-redux'
import { updateIsNewUser } from '@/store/slices/user' // 同意隐私后 code 登录失败时置为新用户，弹窗展示手机号授权
import { useLogin, useLocation } from '@/hooks'
import { useTranslation, $t } from '@/i18n'
import './index.scss'

const initialState = {
  logo: '',
  registerName: '',
  privacyName: '',
  agreeMentChecked: false
}

const SpLogin = forwardRef((props, ref) => {
  useTranslation()
  const { children, className, visible, onPolicyClose, onChange, onClose } = props
  const dispatch = useDispatch()
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
      const { source_id, monitor_id, latest_source_id, latest_monitor_id } =
        Taro.getStorageSync('sourceInfo') // 千人千码参数
      if (uid) {
        // 分销绑定
        params['uid'] = uid
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
      // 若前面未带上店铺 id，用当前 Redux 中的店铺兜底，避免注册请求缺 distributor_id
      if (params['distributor_id'] == null || params['distributor_id'] === '') {
        const fallbackId = shopInfo?.distributor_id ?? getDistributorId()
        if (fallbackId != null && fallbackId !== '') {
          params['distributor_id'] = fallbackId
        }
      }

      if (source_id) {
        params['source_id'] = source_id
      }
      if (monitor_id) {
        params['monitor_id'] = monitor_id
      }
      if (latest_source_id) {
        params['latest_source_id'] = latest_source_id
      }
      if (latest_monitor_id) {
        params['latest_monitor_id'] = latest_monitor_id
      }

      try {
        const { token, is_new } = await api.wx.newlogin(params)
        if (token) {
          setToken(token)
          Taro.hideLoading()
          setLoginModal(false)
          showToast($t('66f0344f.53f077'))
          onChange && onChange()
        } else {
          showToast($t('66f0344f.1c56d8'))
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

  /**
   * 已注册会员 code 登录。
   * 新用户时 useLogin.login() 会抛错，此处 catch 后必须 throw e 再抛出，
   * 否则 handleConfirmModal 的 .catch() 不会执行，注册弹窗不会弹起。
   */
  const handleUserLogin = async () => {
    try {
      await login()
      setLoginModal(false)
      onChange && onChange()
    } catch (e) {
      console.log('[sp-login] handleUserLogin error:', e)
      throw e
    }
  }

  /**
   * 用户点击「同意」隐私协议后：
   * 1. 先关闭隐私弹窗，不先打开登录弹窗（避免弹窗先出再闪变）
   * 2. 尝试 handleUserLogin()（code 登录）：老用户成功则直接登进；新用户失败会 throw
   * 3. 失败时在 .catch 中：置 isNewUser=true，再打开登录弹窗，此时弹窗内直接是「手机号授权」走注册
   */
  const handleConfirmModal = useCallback(() => {
    setPolicyModal(false)
    handleUserLogin()
      .then(() => {})
      .catch(() => {
        dispatch(updateIsNewUser(true))
        setTimeout(() => setLoginModal(true), 0)
      })
  }, [dispatch])

  // 登录
  const handleClickLogin = async (e) => {
    e.stopPropagation()
    const { scene } = Taro.getLaunchOptionsSync()
    // 微信朋友圈打开场景
    if (scene == 1154) {
      return showToast($t('66f0344f.303e6e'))
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
          <View className='login-modal__bd'>{$t('66f0344f.c4c389')}</View>
          <View className='agreement-content'>
            <SpCheckbox checked={agreeMentChecked} onChange={onChangePayment} />
            <View className='agreement-list'>
              <Text
                className='agreement-name'
                onClick={handleClickPrivacy.bind(this, 'member_register')}
              >
                《{registerName}》
              </Text>
              <Text>{$t('66f0344f.ab20cc')}</Text>
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
                {$t('66f0344f.402d19')}
              </AtButton>
            )}
            {!isNewUser && (
              <AtButton type='primary' disabled={!agreeMentChecked} onClick={handleUserLogin}>
                {$t('66f0344f.402d19')}
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
