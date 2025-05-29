import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { View, Text, Image, RootPortal } from '@tarojs/components'
import { SpPrivacyModal, SpPage, SpLogin, SpModal, SpCheckbox, SpImage } from '@/components'
import { AtButton, AtIcon } from 'taro-ui'
import { showToast, normalizeQuerys, getCurrentPageRouteParams, VERSION_IN_PURCHASE, getDistributorId } from '@/utils'
import { useLogin, useModal, useSyncCallback } from '@/hooks'
import { SG_ROUTER_PARAMS } from '@/consts/localstorage'
import S from '@/spx'
import entryLaunch from '@/utils/entryLaunch'
import api from '@/api'
import { INVITE_ACTIVITY_ID } from '@/consts'
import { useImmer } from 'use-immer'
import { useSelector, useDispatch } from 'react-redux'
import CompBottomTip from '@/subpages/purchase/comps/comp-bottomTip'
import {
  updateInviteCode,
  updateEnterpriseId,
  updateCurDistributorId
} from '@/store/slices/purchase'

import './auth.scss'

const initialState = {
  invite_code: '',
  activity_id: '',
  enterprise_id: '',
  is_activity:''
}

function PurchaseAuth() {
  const { isLogin, checkPolicyChange, isNewUser, updatePolicyTime, getUserInfo, setToken, login } =
    useLogin({
      autoLogin: false
      // policyUpdateHook: (isUpdate) => {
      //   isUpdate && setPolicyModal(true)
      // }
    })

  const { userInfo = {} } = useSelector((state) => state.user)
  const { appName, appLogo } = useSelector((state) => state.sys)
  const [policyModal, setPolicyModal] = useState(false)
  const [checked, setChecked] = useState(false)
  const { params } = useRouter()
  const dispatch = useDispatch()
  const codeRef = useRef()
  const { showModal } = useModal()
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)

  const { invite_code, activity_id, enterprise_id, is_activity } = state

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
    init()
  }, [])

  useEffect(() => {
    if (invite_code && activity_id) {
      dispatch(updateInviteCode(invite_code))
      S.set(INVITE_ACTIVITY_ID, activity_id, true)
      if (S.getAuthToken()) {
        getUserInfo(true)
      }
    }
  }, [invite_code])

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: appName
    })
  }, [appName])

  const init = async () => {
    //获取扫码参数
   await getQrcodeEid()
    //如果不是扫码则存路由参数
    if (!params.scene) {
      setState((draft) => {
        draft.invite_code = params?.code
        draft.activity_id = params?.activity_id
        draft.enterprise_id = params?.enterprise_id
        draft.is_activity = params?.is_activity
      })
    }
    //检查隐私协议
    checkPolicyChangeFunc()
  }

  const checkPolicyChangeFunc = useSyncCallback(async () => {
    const res = await checkPolicyChange()
    setChecked(res)
    //如果是亲友分享且没有同意隐私协议，则弹
    if (!res && (invite_code || VERSION_IN_PURCHASE)) {
      setPolicyModal(true)
    }
  })

  // 企业二维码扫码登录
  const getQrcodeEid = async () => {
    // eid=18&cid=34&t=m&c=1
    // eid:员工企业ID--enterpriseId
    // cid:企业ID--companyId
    // t:认证方式 取了第一个字符 mobile=m；email=e；account=a；qr_code=q
    // c:是否验证白名单 1=验证
    if (params.scene) {
      const { eid, cid, t, c, aid, code } = await entryLaunch.getRouteParams()
      console.log('扫码参数', eid, cid, t, c, aid, code)

      if (code && aid && eid) {
        //亲友扫码
        setState((draft) => {
          draft.invite_code = code
          draft.activity_id = aid
          draft.enterprise_id = eid
        })
        return
      }

      const tMap = {
        m: 'mobile',
        e: 'email',
        a: 'account',
        q: 'qr_code'
      }
      if (eid) {
        const sparams = {
          enterprise_id: eid,
          auth_type: tMap[t]
        }
        if (c) {
          sparams.is_verify = c
        }
        //跳转
        handleConfirmClick(tMap[t], sparams)
      }
    }
  }

  const onRejectPolicy = () => {
    Taro.exitMiniProgram()
  }

  // 同意隐私协议
  const onResolvePolicy = async () => {
    setPolicyModal(false)
    setChecked(true)
    if (!isNewUser) {
      await login()
      if(VERSION_IN_PURCHASE){
        // 纯内购如果有企业则进入选身份页面
        const data = await api.purchase.getUserEnterprises({disabled: 0,distributor_id: getDistributorId()})
        const validIdentityLen = data.filter(item => item.disabled == 0).length
        if(validIdentityLen){
          Taro.reLaunch({
            url:'/subpages/purchase/select-identity?is_redirt=1'
          })
        }
      }

    }
  }

  const handleConfirmClick = async (rtype, rparmas) => {
    let redirectUrl
    if (rtype == 'account') {
      redirectUrl = `/subpages/purchase/select-company-account`
    } else if (rtype == 'email') {
      redirectUrl = `/subpages/purchase/select-company-email`
    } else if (rtype == 'mobile' || rtype == 'qr_code') {
      redirectUrl = `/subpages/purchase/select-company-phone`
    }

    if (rparmas) {
      //扫码传参数
      redirectUrl += Object.keys(rparmas)
        .reduce((pre, cur) => {
          return pre + `${cur}=${rparmas[cur]}&`
        }, '?')
        .slice(0, -1)
      console.log(redirectUrl, rparmas)
      Taro.reLaunch({
        url: redirectUrl
      })
    } else {
      //首页模板活动入口跳转进来，带活动ID
      if (activity_id) {
        redirectUrl = `${redirectUrl}?activity_id=${activity_id}`
        if(is_activity){
          //首页跳转进来需要带上标识认证成功直接进入活动
          redirectUrl +=  '&is_activity=1'
        }
      }
      Taro.navigateTo({
        url: redirectUrl
      })
    }
  }

  const handleBindPhone = async (e) => {
    const { encryptedData, iv, cloudID } = e.detail
    if (encryptedData && iv) {
      const code = codeRef.current
      const sparams = {
        code,
        encryptedData,
        iv,
        cloudID,
        user_type: 'wechat',
        auth_type: 'wxapp',
        invite_code
      }
      const { token } = await api.wx.newlogin(sparams)
      setToken(token)
      showToast('验证成功')
      await getDtidToEnterid(enterprise_id)
      setTimeout(() => {
        Taro.reLaunch({ url: `/pages/purchase/index?is_redirt=1` })
      }, 700)
    }
  }

  const validatePhone = async () => {
    try {
      await api.purchase.getEmployeeRelativeBind({ invite_code, showError: false })
      showToast('验证成功')
      await getDtidToEnterid(enterprise_id)
      setTimeout(() => {
        Taro.reLaunch({ url: `/pages/purchase/index?is_redirt=1` })
      }, 700)
    } catch (e) {
      console.log(e)
      Taro.showModal({
        content: e.message || e,
        confirmText: '我知道了',
        showCancel: false,
        success: async() => {
          await getDtidToEnterid(enterprise_id)
          Taro.reLaunch({ url: `/pages/purchase/index?is_redirt=1` })
        }
      })
    }
  }

  const getDtidToEnterid = async (eid) => {
    // 亲友分享需要拿到企业id和店铺ID
    const { distributor_id } = await api.purchase.getPurchaseDistributor({ enterprise_id: eid })
    //后续身份切换需要用
    dispatch(updateCurDistributorId(distributor_id))
    dispatch(updateEnterpriseId(eid))
  }

  const handlePassClick = async() => {
    await getDtidToEnterid(enterprise_id)
    Taro.reLaunch({ url: `/pages/purchase/index?is_redirt=1` })
  }

  const handleClickPrivacy = (type) => {
    Taro.navigateTo({
      url: `/subpages/auth/reg-rule?type=${type}`
    })
  }

  const handleSelectPrivacy = async () => {
    setChecked(!checked)
  }

  return (
    <SpPage className='purchase-auth'>
      {/* 隐私协议 */}
      <SpPrivacyModal open={policyModal} onCancel={onRejectPolicy} onConfirm={onResolvePolicy} />

      <View className='header'>
        <Image className='header-avatar' src={appLogo} mode='aspectFill' />
        <Text className='welcome'>欢迎登录</Text>
        <Text className='title'>{appName}</Text>
      </View>
      <View className='btns'>
        {!invite_code && (
          <>
            <AtButton
              circle
              disabled={!checked}
              className='button btns-phone'
              onClick={() => handleConfirmClick('mobile')}
            >
              手机号登录&nbsp;
              <Text className='iconfont icon-shuangjiantou'></Text>
            </AtButton>
            <AtButton
              circle
              disabled={!checked}
              className='button btns-account'
              onClick={() => handleConfirmClick('account')}
            >
              账号密码登录&nbsp;
              <Text className='iconfont icon-shuangjiantou'></Text>
            </AtButton>
            <AtButton
              circle
              disabled={!checked}
              className='button btns-email'
              onClick={() => handleConfirmClick('email')}
            >
              使用邮箱登录
            </AtButton>
          </>
        )}

        {invite_code &&
          isLogin &&
          userInfo?.is_relative && ( // 有/无商城，已登录亲友验证、绑定
            <>
              <View className='validate-pass'>验证通过</View>
              <AtButton circle className='button btns-phone' onClick={handlePassClick}>
                继续
              </AtButton>
            </>
          )}

        {invite_code && isLogin && !isNewUser && !userInfo?.is_relative && (
          <AtButton circle className='button btns-phone' onClick={validatePhone}>
            手机号授权登录
          </AtButton>
        )}

        {invite_code &&
          isNewUser && ( // 有/无商城，未登录亲友验证、绑定
            <AtButton
              openType='getPhoneNumber'
              onGetPhoneNumber={handleBindPhone}
              circle
              className='button btns-phone'
            >
              手机号授权登录
            </AtButton>
          )}
      </View>

      <View className='auth--footer'>
        <SpCheckbox onChange={handleSelectPrivacy} checked={checked} />
        <Text className='auth--footer-text'>
          我已阅读并接受{' '}
          <Text onClick={() => handleClickPrivacy('privacy')} className='content'>
            隐私政策
          </Text>
          及
          <Text className='content' onClick={() => handleClickPrivacy('member_register')}>
            用户协议
          </Text>
        </Text>
      </View>

      <View className='service-footer'>
        <View
          className='toolbar-item'
          onClick={() => {
            S.phoneNumber('021-60662088')
          }}
        >
          <Text className='iconfont icon-lianxi'></Text>
          <Text className='toolbar-item-txt'>客服电话：</Text>
          <Text className='toolbar-item-content'>021-60662088</Text>
        </View>
      </View>

      <CompBottomTip />
    </SpPage>
  )
}

PurchaseAuth.options = {
  addGlobalClass: true
}

export default PurchaseAuth
