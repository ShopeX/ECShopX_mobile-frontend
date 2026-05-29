/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useRouter } from '@tarojs/taro'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { useLogin, useModal } from '@/hooks'
import api from '@/api'
import { classNames, showToast, getDistributorId, isWeb } from '@/utils'
import qs from 'qs'
import { updateEnterpriseId, updateCurDistributorId } from '@/store/slices/purchase'
import { SpPage, SpPrivacyModal, SpInput, SpImage, SpPurchaseEnterpriseBar } from '@/components'
import { useTranslation, $t, ti } from '@/i18n'
import './select-company-email.scss'

function PurchaseAuthEmail() {
  const { i18n } = useTranslation()
  const { isNewUser, login } = useLogin({
    autoLogin: true,
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })
  const [policyModal, setPolicyModal] = useState(false)
  const [email, setEmail] = useState('')
  const [vcode, setVcode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [enterpriseName, setEnterpriseName] = useState('')
  const [activityBg, setActivityBg] = useState('')
  const sendCodeLockRef = useRef(false)
  const { showModal } = useModal()
  const dispatch = useDispatch()
  const { params } = useRouter()
  const { appName } = useSelector((state) => state.sys)
  const {
    enterprise_id,
    enterprise_name,
    activity_id,
    is_activity = '',
    pages_template_id = ''
  } = params

  const disabled = useMemo(() => !email.trim() || !vcode.trim(), [email, vcode])
  const sendDisabled = countdown > 0

  const normalizeInputValue = (value) => {
    if (value && typeof value === 'object') {
      return value.detail?.value ?? value.target?.value ?? ''
    }
    return value ?? ''
  }

  const handleEmailChange = (value) => {
    setEmail(String(normalizeInputValue(value)))
  }

  const handleVcodeChange = (value) => {
    setVcode(String(normalizeInputValue(value)))
  }

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => {
      setCountdown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('cedd18d3.5f934d') })
  }, [i18n.language])

  useEffect(() => {
    syncEnterpriseName()
  }, [enterprise_id, enterprise_name, params?.enterprise_id, params?.enterprise_name])

  const syncEnterpriseName = async () => {
    try {
      const list = await api.purchase.getUserEnterprises({
        disabled: 0,
        distributor_id: getDistributorId()
      })
      const found = (list || []).find(
        (item) => String(item?.id ?? item?.enterprise_id) === String(enterprise_id)
      )
      setEnterpriseName(found?.name || '')
      setActivityBg(found?.logo || '')
    } catch (e) {
      setEnterpriseName('')
      setActivityBg('')
    }
  }

  const handleSendCode = async () => {
    if (sendDisabled || sendCodeLockRef.current) return
    const nextEmail = email.trim()
    if (!nextEmail) {
      showToast($t('44e64c13.b457cd'))
      return
    }
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailReg.test(nextEmail)) {
      showToast($t('97e3aca2.09f253'))
      return
    }
    sendCodeLockRef.current = true
    try {
      const sendParams = { email: nextEmail, enterprise_id }
      const { status } = await api.purchase.getEmailCode(sendParams)
      if (status) {
        showToast($t('e1d26b67.9db9a7'))
        setCountdown(60)
      } else {
        showToast($t('1d9cdff5.9ca6a3'))
      }
    } catch (e) {
      showToast(e?.message || $t('1d9cdff5.9ca6a3'))
    } finally {
      sendCodeLockRef.current = false
    }
  }

  const onFormSubmit = async () => {
    if (disabled) return

    const nextEmail = email.trim()
    const nextVcode = vcode.trim()
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailReg.test(nextEmail)) {
      showToast($t('97e3aca2.09f253'))
      return
    }

    const authParams = {
      enterprise_id,
      email: nextEmail,
      vcode: nextVcode,
      showError: false,
      auth_type: 'email'
    }

    try {
      const checkParams = { ...authParams }
      if (!enterprise_id) {
        checkParams.distributor_id = getDistributorId()
      }
      if (activity_id) {
        checkParams.activity_id = activity_id
      }
      const { list } = await api.purchase.employeeCheck(checkParams)
      if (!list?.length) {
        showToast($t('f695264d.0f85e7'))
        return
      }

      let resolvedEnterpriseId = enterprise_id
      let resolvedEnterpriseName

      if (list.length > 1) {
        const matched = list.find((row) => String(row?.enterprise_id) === String(enterprise_id))
        if (matched) {
          resolvedEnterpriseId = matched.enterprise_id
          resolvedEnterpriseName = matched.enterprise_name
        } else {
          resolvedEnterpriseId = list[0].enterprise_id
          resolvedEnterpriseName = list[0].enterprise_name
        }
      } else {
        resolvedEnterpriseId = list[0].enterprise_id
        resolvedEnterpriseName = list[0].enterprise_name
      }

      authParams.enterprise_id = resolvedEnterpriseId

      if (isNewUser && !isWeb) {
        Taro.navigateTo({
          url: `/subpages/purchase/select-company-phone?${qs.stringify({
            ...authParams,
            enterprise_name: resolvedEnterpriseName
          })}`
        })
        return
      }

      await api.purchase.setEmployeeAuth(authParams)
      await getQrCodeDtid(authParams.enterprise_id)
      dispatch(updateEnterpriseId(authParams.enterprise_id))
      showToast($t('ace75665.45001d'))

      setTimeout(() => {
        Taro.reLaunch({
          url: `/subpages/purchase/index?activity_id=${activity_id || ''}&enterprise_id=${
            authParams.enterprise_id || enterprise_id || ''
          }&pages_template_id=${pages_template_id || ''}`
        })
      }, 700)
    } catch (e) {
      if (e.message.indexOf('重复绑定') > -1) {
        dispatch(updateEnterpriseId(authParams.enterprise_id))
        await getQrCodeDtid(authParams.enterprise_id)
        await showModal({
          title: $t('e441b11e.e8c3ea'),
          content: e.message,
          showCancel: false,
          confirmText: $t('20b64b82.fe0337'),
          contentAlign: 'center'
        })
        Taro.reLaunch({
          url: `/subpages/purchase/index?activity_id=${activity_id || ''}&enterprise_id=${
            authParams.enterprise_id || enterprise_id || ''
          }&pages_template_id=${pages_template_id || ''}`
        })
      } else {
        showToast(e.message)
      }
    }
  }

  const getQrCodeDtid = async (eid) => {
    const id = eid ?? enterprise_id ?? params?.enterprise_id
    if (!id) return
    const { distributor_id } = await api.purchase.getPurchaseDistributor({ enterprise_id: id })
    dispatch(updateCurDistributorId(distributor_id))
  }

  const onResolvePolicy = async () => {
    setPolicyModal(false)
    if (!isNewUser) {
      await login()
    }
  }

  const onRejectPolicy = () => {
    Taro.exitMiniProgram()
  }

  return (
    <SpPage className='purchase-email-auth'>
      <SpImage src={activityBg} className='purchase-email-auth__cover-img' mode='widthFix' />

      <SpPurchaseEnterpriseBar
        name={enterpriseName || appName || $t('c2581d4c.6fb7d0')}
        showMore={false}
        showSearch={false}
      />

      <View className='purchase-email-auth__form-wrap'>
        <View className='purchase-email-auth__form-card'>
          <Text className='purchase-email-auth__form-title'>{$t('cedd18d3.5f934d')}</Text>

          <View className='purchase-email-auth__field'>
            <Text className='purchase-email-auth__field-label'>{$t('39274850.7148d5')}</Text>
            <SpInput
              className='purchase-email-auth__field-sp-input'
              placeholder={$t('44e64c13.b457cd')}
              placeholderClass='purchase-email-auth__field-input-ph'
              value={email}
              onChange={handleEmailChange}
            />
          </View>

          <View className='purchase-email-auth__field'>
            <Text className='purchase-email-auth__field-label'>{$t('f695264d.e3cf0a')}</Text>
            <View className='purchase-email-auth__code-row'>
              <SpInput
                className='purchase-email-auth__code-sp-input'
                placeholder={$t('f695264d.a5ae49')}
                placeholderClass='purchase-email-auth__field-input-ph'
                value={vcode}
                onChange={handleVcodeChange}
              />
              <View
                className={classNames('purchase-email-auth__code-send', {
                  'purchase-email-auth__code-send--disabled': sendDisabled
                })}
                onClick={handleSendCode}
              >
                <Text className='purchase-email-auth__code-send-text'>
                  {sendDisabled ? ti('ecf05285.41b9b5', [countdown]) : $t('0eb8dfea.c5c358')}
                </Text>
              </View>
            </View>
          </View>

          <View className='purchase-email-auth__footer'>
            <View
              className={`purchase-email-auth__confirm${
                disabled ? ' purchase-email-auth__confirm--disabled' : ''
              }`}
              onClick={onFormSubmit}
            >
              <Text className='purchase-email-auth__confirm-text'>{$t('c2581d4c.e83a25')}</Text>
            </View>
          </View>
        </View>
      </View>

      <SpPrivacyModal open={policyModal} onCancel={onRejectPolicy} onConfirm={onResolvePolicy} />
    </SpPage>
  )
}

PurchaseAuthEmail.options = {
  addGlobalClass: true
}

export default PurchaseAuthEmail
