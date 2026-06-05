/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useRouter } from '@tarojs/taro'
import React, { useMemo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text } from '@tarojs/components'
import api from '@/api'
import { SpPage, SpPrivacyModal, SpInput, SpImage, SpPurchaseEnterpriseBar } from '@/components'
import { useLogin, useModal } from '@/hooks'
import { useTranslation, $t } from '@/i18n'
import { showToast, getDistributorId, isWeb } from '@/utils'
import qs from 'qs'
import { updateEnterpriseId, updateCurDistributorId } from '@/store/slices/purchase'
import './select-company-account.scss'

function PurchaseAuthAccount() {
  const { i18n } = useTranslation()
  const { isNewUser, login } = useLogin({
    autoLogin: true,
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })
  const [policyModal, setPolicyModal] = useState(false)
  const [account, setAccount] = useState('')
  const [authCode, setAuthCode] = useState('')
  const { params } = useRouter()
  const { enterprise_id, activity_id, is_activity = '', pages_template_id = '' } = params
  const { curEnterpriseLogo } = useSelector((state) => state.purchase)
  const { showModal } = useModal()
  const dispatch = useDispatch()

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('cedd18d3.5f934d') })
  }, [i18n.language])

  const disabled = useMemo(() => !account.trim() || !authCode.trim(), [account, authCode])

  const onFormSubmit = async () => {
    if (disabled) return

    const _params = {
      enterprise_id,
      account: account.trim(),
      auth_code: authCode.trim(),
      auth_type: 'account'
    }

    const checkParams = { ..._params }
    if (activity_id) {
      checkParams.activity_id = activity_id
    }

    if (!enterprise_id) {
      checkParams.distributor_id = getDistributorId()
    }
    const { list } = await api.purchase.employeeCheck(checkParams)

    if (list && list.length > 1) {
      const matched = list.find((row) => String(row?.enterprise_id) === String(enterprise_id))
      if (matched) {
        _params.enterprise_id = matched.enterprise_id
        _params.employee_id = matched.id
        _params.enterprise_name = matched.enterprise_name
      }
    } else if (list && list.length === 1) {
      _params.enterprise_id = list[0]?.enterprise_id
      _params.employee_id = list[0]?.id
      _params.enterprise_name = list[0]?.enterprise_name
    }

    employeeAuth(_params)
  }

  const employeeAuth = (_params) => {
    if (isNewUser && !isWeb) {
      Taro.navigateTo({
        url: `/subpages/purchase/select-company-phone?${qs.stringify({
          ..._params
        })}`
      })
    } else {
      employeeAuthFetch(_params)
    }
  }

  const employeeAuthFetch = async (_params) => {
    try {
      await api.purchase.setEmployeeAuth({ ..._params, showError: false })
      await getQrCodeDtid(_params.enterprise_id)
      showToast($t('ace75665.45001d'))
      dispatch(updateEnterpriseId(_params.enterprise_id))
      setTimeout(() => {
        Taro.reLaunch({
          url: `/subpages/purchase/index?activity_id=${activity_id || ''}&enterprise_id=${
            _params.enterprise_id || enterprise_id || ''
          }&pages_template_id=${pages_template_id || ''}`
        })
      }, 700)
    } catch (e) {
      if (e.message.indexOf('重复绑定') > -1) {
        dispatch(updateEnterpriseId(_params.enterprise_id))
        await getQrCodeDtid(_params.enterprise_id)
        await showModal({
          title: $t('e441b11e.e8c3ea'),
          content: e.message,
          showCancel: false,
          confirmText: $t('20b64b82.fe0337'),
          contentAlign: 'center'
        })
        Taro.reLaunch({
          url: `/subpages/purchase/index?activity_id=${activity_id || ''}&enterprise_id=${
            _params.enterprise_id || enterprise_id || ''
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
    <SpPage className='purchase-account-auth'>
      <SpImage
        src={curEnterpriseLogo}
        className='purchase-account-auth__cover-img'
        mode='widthFix'
      />

      <SpPurchaseEnterpriseBar showMore={false} showSearch={false} />

      <View className='purchase-account-auth__form-wrap'>
        <View className='purchase-account-auth__form-card'>
          <Text className='purchase-account-auth__form-title'>{$t('cedd18d3.5f934d')}</Text>

          <View className='purchase-account-auth__field'>
            <Text className='purchase-account-auth__field-label'>{$t('cedd18d3.7035c6')}</Text>
            <SpInput
              className='purchase-account-auth__field-sp-input'
              placeholder={$t('eacb27d9.f821a7')}
              placeholderClass='purchase-account-auth__field-input-ph'
              value={account}
              onChange={setAccount}
            />
          </View>

          <View className='purchase-account-auth__field'>
            <Text className='purchase-account-auth__field-label'>{$t('cedd18d3.a81052')}</Text>
            <SpInput
              className='purchase-account-auth__field-sp-input'
              placeholder={$t('3ca883d0.e39ffe')}
              placeholderClass='purchase-account-auth__field-input-ph'
              type='password'
              value={authCode}
              onChange={setAuthCode}
            />
          </View>

          <View className='purchase-account-auth__protocol'>
            <View
              className={`purchase-account-auth__confirm${
                disabled ? ' purchase-account-auth__confirm--disabled' : ''
              }`}
              onClick={onFormSubmit}
            >
              <Text className='purchase-account-auth__confirm-text'>{$t('c2581d4c.e83a25')}</Text>
            </View>
          </View>
        </View>
      </View>

      <SpPrivacyModal open={policyModal} onCancel={onRejectPolicy} onConfirm={onResolvePolicy} />
    </SpPage>
  )
}

PurchaseAuthAccount.options = {
  addGlobalClass: true
}

export default PurchaseAuthAccount
