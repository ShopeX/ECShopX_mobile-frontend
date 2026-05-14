/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useRouter } from '@tarojs/taro'
import React, { useMemo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, Input, Button } from '@tarojs/components'
import api from '@/api'
import { reportEmployeepurchaseBehavior } from '@/api/purchase'
import { SpPage, SpLoading } from '@/components'
import { useLogin } from '@/hooks'
import { classNames, showToast } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import { updateEnterpriseId, updateCurActivityInfo } from '@/store/slices/purchase'
import { INVITE_ACTIVITY_ID } from '@/consts'
import S from '@/spx'
import './select-company-passcode.scss'

function PurchasePasscodeAuth() {
  const { i18n } = useTranslation()
  useLogin({
    autoLogin: true
  })
  const [passSheetVisible, setPassSheetVisible] = useState(true)
  const { curActivityInfo } = useSelector((state) => state.purchase)
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(true)
  const { params } = useRouter()
  const dispatch = useDispatch()

  const activity_id = params?.activity_id
  const enterprise_id = params?.enterprise_id
  const company_id = params?.company_id || enterprise_id
  const inviteFromRoute = params?.code || ''
  const pages_template_id = params?.pages_template_id || ''

  const disabled = useMemo(() => !inviteCode.trim(), [inviteCode])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('d46c6fdb.8d99c2') })
  }, [i18n.language])

  useEffect(() => {
    const raw = String(inviteFromRoute || '').trim()
    if (!raw) {
      setInviteCode('')
      return
    }
    try {
      setInviteCode(decodeURIComponent(raw))
    } catch (e) {
      setInviteCode(raw)
    }
    setPassSheetVisible(true)
  }, [inviteFromRoute])



  useEffect(() => {
    fetchActivity()
    dispatch(updateEnterpriseId(enterprise_id))
  }, [activity_id, enterprise_id])

  const fetchActivity = async () => {
    if (!activity_id || !enterprise_id) {
      setLoading(false)
      return
    }
    try {
      const data = await api.purchase.getEmployeeActivitydata({
        activity_id,
        enterprise_id
      })
      dispatch(updateCurActivityInfo(data || {}))
      //passphrase_user_verified   0 | 1   当前登录用户是否已在「该活动 + 该企业」下口令校验成功（服务端 Redis 标记）。未开口令或未登录恒为 0。
      let passphrase_user_verified = data?.passphrase_user_verified || 0
      if (passphrase_user_verified == 1) {
        let url = `/subpages/purchase/index?activity_id=${activity_id || ''}&enterprise_id=${enterprise_id || ''}&pages_template_id=${pages_template_id || ''}`
        Taro.reLaunch({ url })
        return
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
      // ignore
    }
  }

  const handleStart = () => {
    setPassSheetVisible(true)
  }

  const handleSheetClose = () => {
    setPassSheetVisible(false)
  }

  const handleSubmit = async () => {
    const next = inviteCode.trim()
    if (!next) {
      showToast($t('d46c6fdb.41db53'))
      return
    }

    if (!activity_id || !enterprise_id) {
      showToast($t('d46c6fdb.916142'))
      return
    }

    const payload = {
      behavior_type: 'passphrase_verify',
      company_id,
      activity_id,
      enterprise_id,
      passphrase_code: next,
      visitor_key: Taro.getStorageSync('userinfo')?.openid || ''
    }

    try {
      const { verified } = await reportEmployeepurchaseBehavior(payload)
      if (!verified) {
        showToast($t('d46c6fdb.7cc43c'))
        return
      }
    } catch (e) {
      console.error('passphrase verify', e)
      showToast(e?.message || $t('d46c6fdb.7cc43c'))
      return
    }

    if (activity_id) {
      S?.set(INVITE_ACTIVITY_ID, activity_id, true)
    }

    let url = `/subpages/purchase/index?activity_id=${activity_id || ''}&enterprise_id=${enterprise_id || ''}&pages_template_id=${pages_template_id || ''}`
    Taro.reLaunch({ url })
  }
  if (loading) {
    return <SpPage className='passcode-login-page'>
      <SpLoading />
    </SpPage>
  }

  return (
    <SpPage className='passcode-login-page'>
      <View
        className='passcode-login-page__poster'
        style={curActivityInfo?.pic ? { backgroundImage: `url(${curActivityInfo?.pic})` } : undefined}
      />

      <View className='passcode-login-page__landing'>
        <View className='passcode-login-page__start-wrap'>
          <Button
            className='passcode-login-page__start-btn passcode-login-page__start-btn--reset'
            onClick={handleStart}
          >
            <Text className='passcode-login-page__start-btn-text'>{$t('ace75665.ccd765')}</Text>
          </Button>
        </View>
      </View>

      {passSheetVisible && (
        <>
          <View className='purchase-passcode__sheet-mask' onClick={handleSheetClose} />
          <View className='purchase-passcode__sheet' catchMove>
            <View className='purchase-passcode__sheet-inner' catchMove>
              <View className='purchase-passcode__sheet-handle' />

              <View className='purchase-passcode__sheet-head'>
                <Text className='purchase-passcode__sheet-title'>{$t('d46c6fdb.8d99c2')}</Text>
                <View className='purchase-passcode__sheet-close' onClick={handleSheetClose}>
                  <Text className='purchase-passcode__sheet-close-icon'>×</Text>
                </View>
              </View>

              <Text className='purchase-passcode__sheet-sub'>{$t('d46c6fdb.068aa5')}</Text>

              <Input
                className='purchase-passcode__sheet-input'
                placeholder={$t('d46c6fdb.8d99c2')}
                placeholderClass='purchase-passcode__sheet-input-ph'
                value={inviteCode}
                onInput={(e) => setInviteCode(e.detail.value)}
              />

              <View
                className={classNames('purchase-passcode__sheet-confirm', {
                  'purchase-passcode__sheet-confirm--disabled': disabled
                })}
                onClick={handleSubmit}
              >
                <Text className='purchase-passcode__sheet-confirm-text'>{$t('c2581d4c.e83a25')}</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </SpPage>
  )
}

PurchasePasscodeAuth.options = {
  addGlobalClass: true
}

export default PurchasePasscodeAuth
