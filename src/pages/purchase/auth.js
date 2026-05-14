/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { SpPrivacyModal, SpPage } from '@/components'
import { showToast, classNames, VERSION_IN_PURCHASE, getDistributorId } from '@/utils'
import { useLogin, useSyncCallback } from '@/hooks'
import S from '@/spx'
import entryLaunch from '@/utils/entryLaunch'
import api from '@/api'
import { INVITE_ACTIVITY_ID } from '@/consts'
import { useImmer } from 'use-immer'
import { useSelector, useDispatch } from 'react-redux'
import {
  updateInviteCode,
  updateEnterpriseId,
  updateCurDistributorId,
  updateCurEnterpriseName,
  updateEnterpriselogo,
  updateCurActivityInfo,
  updateIsPasscodeLogin,
  updatePurchaseShareInfo,
  updatePersistPurchaseShareInfo
} from '@/store/slices/purchase'
import { $t, useTranslation } from '@/i18n'

import './auth.scss'

const initialState = {
  invite_code: '', // 邀请码
  activity_id: '', // 活动ID
  enterprise_id: '', // 企业ID
  authType: '', // 认证方式
}

function PurchaseAuth() {
  useTranslation()
  const { isLogin, checkPolicyChange, isNewUser, getUserInfo, setToken, login } = useLogin({
    autoLogin: false
  })

  const [policyModal, setPolicyModal] = useState(false)
  const [checked, setChecked] = useState(false)
  const [isAutoEntering, setIsAutoEntering] = useState(false)
  const { userInfo } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const codeRef = useRef()
  const inviteAutoEnterRef = useRef(false)
  const [state, setState] = useImmer(initialState)
  const [activityBg, setActivityBg] = useState('')
  const [pagesTemplateId, setPagesTemplateId] = useState('')
  /** 接口返回企业列表为空：企业已关闭，再次点「开始选购」需重复提示 */
  const [enterpriseUnavailable, setEnterpriseUnavailable] = useState(false)

  const { invite_code, activity_id, enterprise_id, authType } = state

  const showEnterpriseClosedModal = () => {
    Taro.showModal({
      title: $t('ace75665.02d981'),
      content: $t('ace75665.3cd788'),
      showCancel: false,
      confirmText: $t('c2581d4c.e83a25')
    })
  }

  const shouldUsePhoneAuth = !isLogin && checked

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
    fetchActivityConfig()
  }, [activity_id])

  useEffect(() => {
    fetchEnterpriseInfo()
  }, [enterprise_id])

  useEffect(() => {
    getAuthType()
  }, [])

  /** 口令落地 ppe=1；否则 authType 在 fetchEnterpriseInfo 拉企业后写入 */
  const getAuthType = async () => {
    const { ppe = '' } = await entryLaunch.getRouteParams()
    dispatch(updateIsPasscodeLogin(ppe == 1))
    setState((draft) => {
      if (ppe == 1) {
        draft.authType = 'code'
      }
    })
  }


  useEffect(() => {
    if (invite_code && activity_id) {
      dispatch(updateInviteCode(invite_code))
      S?.set(INVITE_ACTIVITY_ID, activity_id, true)
      if (S.getAuthToken()) {
        getUserInfo(true)
      }
    }
  }, [invite_code])

  useEffect(() => {
    if (
      !invite_code ||
      !activity_id ||
      !enterprise_id ||
      inviteAutoEnterRef.current ||
      !checked ||
      !isLogin ||
      !userInfo
    ) {
      return
    }
    if (!userInfo?.is_relative && isNewUser) {
      return
    }
    inviteAutoEnterRef.current = true
    setIsAutoEntering(true)
      ; (async () => {
        try {
          if (userInfo?.is_relative) {
            await enterInviteActivity()
            return
          }
          await validateRelativeBind()
        } catch (e) {
          inviteAutoEnterRef.current = false
          throw e
        } finally {
          setIsAutoEntering(false)
        }
      })().catch(() => {})
  }, [activity_id, checked, enterprise_id, invite_code, isLogin, isNewUser, userInfo])

  const init = async () => {
    //获取扫码参数
    await getQrcodeEid()
    //检查隐私协议
    checkPolicyChangeFunc()
  }
  /**
   * 获取活动配置
   */
  const fetchActivityConfig = async () => {
    if (!activity_id) {
      console.log('activity_id is empty', activity_id)
      return
    }
    try {
      const data = await api.purchase.getActivitydata({
        activity_id: activity_id,
      })
      const candidate = data?.pic || ''
      dispatch(updateCurActivityInfo(data || {}))
      setActivityBg(candidate)
      setPagesTemplateId(data?.pages_template_id || '')
    } catch (e) {
      setActivityBg('')
    }
  }
  // 获取企业信息
  const fetchEnterpriseInfo = async () => {
    if (!enterprise_id) {
      setEnterpriseUnavailable(false)
      return
    }
    try {
      const { list } = await api.purchase.getEnterprisesList({
        enterprise_id: enterprise_id
      })
      if (list[0]) {
        setEnterpriseUnavailable(false)
        dispatch(updateEnterpriseId(list[0]?.id))
        dispatch(updateEnterpriselogo(list[0]?.logo))
        dispatch(updateCurEnterpriseName(list[0]?.name))
        dispatch(updateCurDistributorId(list[0]?.distributor_id))
        setState((draft) => {
          draft.authType = list[0]?.auth_type || ''
        })
      } else {
        setEnterpriseUnavailable(true)
        showEnterpriseClosedModal()
      }
    } catch (e) {
      setEnterpriseUnavailable(false)
      console.error('获取企业信息失败', e)
    }
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
    try {
      const { id, enterprise_id, code } = await entryLaunch.getRouteParams()
      //亲友扫码
      setState((draft) => {
        draft.invite_code = code || ''
        draft.activity_id = id || ''
        draft.enterprise_id = enterprise_id || ''
      })
    } catch (error) {

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
      if (VERSION_IN_PURCHASE) {
        // 纯内购如果有企业则进入选身份页面
        const data = await api.purchase.getUserEnterprises({
          disabled: 0,
          distributor_id: getDistributorId()
        })
        const validIdentityLen = data.filter((item) => item.disabled == 0).length
        if (validIdentityLen) {
          Taro.reLaunch({
            url: '/subpages/purchase/select-identity'
          })
        }
      }
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
      showToast($t('ace75665.45001d'))
      if (invite_code) {
        await enterInviteActivity(700)
      } else {
        setTimeout(() => {
          Taro.reLaunch({ url: `/subpages/purchase/activity-list` })
        }, 700)
      }
    }
  }


  const buildInviteActivityUrl = () => {
    return `/subpages/purchase/index?activity_id=${activity_id || ''}&enterprise_id=${enterprise_id || ''}&pages_template_id=${pagesTemplateId || ''}`
  }

  const prepareInviteActivity = async () => {
    if (!enterprise_id) return
    const { distributor_id } = await api.purchase.getPurchaseDistributor({ enterprise_id })
    const shareInfo = { activity_id, enterprise_id, pages_template_id: pagesTemplateId || '' }
    dispatch(updateCurDistributorId(distributor_id))
    dispatch(updateEnterpriseId(enterprise_id))
    dispatch(updatePurchaseShareInfo(shareInfo))
    dispatch(updatePersistPurchaseShareInfo(shareInfo))
  }

  const enterInviteActivity = async (delay = 0) => {
    await prepareInviteActivity()
    const redirect = () => {
      Taro.reLaunch({ url: buildInviteActivityUrl() })
    }
    if (delay) {
      setTimeout(redirect, delay)
    } else {
      redirect()
    }
  }

  const validateRelativeBind = async () => {
    try {
      await api.purchase.getEmployeeRelativeBind({ invite_code, showError: false })
      showToast($t('ace75665.45001d'))
      await enterInviteActivity(700)
    } catch (e) {
      Taro.showModal({
        content: e.message || e,
        confirmText: $t('ace75665.fe0337'),
        showCancel: false,
        success: async () => {
          await enterInviteActivity()
        }
      })
    }
  }


  const handlePasscodeLandingStart = () => {
    if (isAutoEntering) {
      return
    }
    if (!checked) {
      setPolicyModal(true)
      return
    }
    if (enterprise_id && enterpriseUnavailable) {
      showEnterpriseClosedModal()
      return
    }
    if (invite_code) {
      if (!isLogin) return
      if (userInfo?.is_relative) {
        enterInviteActivity()
      } else if (!isNewUser) {
        validateRelativeBind()
      }
      return
    }
    let redirectUrl
    if (authType == 'account') {
      redirectUrl = '/subpages/purchase/select-company-account'
    } else if (authType == 'email') {
      redirectUrl = '/subpages/purchase/select-company-email'
    } else if (authType == 'mobile' || authType == 'qr_code') {
      redirectUrl = '/subpages/purchase/select-company-phone'
    } else if (authType == 'code') {
      redirectUrl = '/subpages/purchase/select-company-passcode'
    }
    if (activity_id && redirectUrl) {
      redirectUrl = `${redirectUrl}?activity_id=${activity_id}&enterprise_id=${enterprise_id}&pages_template_id=${pagesTemplateId || ''}`
    }
    if (!redirectUrl) {
      showToast($t('ace75665.c045de'))
      return
    }
    Taro.navigateTo({ url: redirectUrl })
  }


  return (
    <SpPage
      className='purchase-auth purchase-auth--passcode-landing'
      showpoweredBy={false}
      loading={isAutoEntering}
    >
      <SpPrivacyModal open={policyModal} onCancel={onRejectPolicy} onConfirm={onResolvePolicy} />

      <View
        className={classNames('purchase-passcode__landing', 'purchase-passcode__landing--plain', {
          'purchase-passcode__landing--with-bg': Boolean(activityBg)
        })}
        style={activityBg ? { backgroundImage: `url(${activityBg})` } : undefined}
      >
        <View className='purchase-passcode__start-btn-wrap'>
          <Button
            className='purchase-passcode__start-btn purchase-passcode__start-btn--button'
            openType={shouldUsePhoneAuth ? 'getPhoneNumber' : undefined}
            onGetPhoneNumber={handleBindPhone}
            onClick={handlePasscodeLandingStart}
          >
            <Text className='purchase-passcode__start-btn-text'>{$t('ace75665.ccd765')}</Text>
          </Button>
        </View>
      </View>
    </SpPage>
  )
}

PurchaseAuth.options = {
  addGlobalClass: true
}

export default PurchaseAuth
