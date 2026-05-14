/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import * as communityApi from '@/api/community'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage, SpPrice, SpForm, SpFormItem, SpInput as AtInput } from '@/components'
import { showToast } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './withdraw-bank.scss'

const initialState = {
  form: {
    bankName: '',
    bankNum: ''
  }
}
function CommunityWithdrawBank(props) {
  const { i18n } = useTranslation()
  const rules = useMemo(
    () => ({
      bankName: [{ required: true, message: $t('8473e56d.891d85') }],
      bankNum: [{ required: true, message: $t('8473e56d.ac44b2') }]
    }),
    [i18n.language]
  )
  const [state, setState] = useImmer(initialState)
  const { form } = state
  const formRef = useRef()

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('07ac9a04.d2cb3c') })
  }, [i18n.language])

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { bank_name, bankcard_no } = await communityApi.getCashWithDrawAccount()
    setState((draft) => {
      draft.form.bankName = bank_name
      draft.form.bankNum = bankcard_no
    })
  }

  const onInputChange = (key, value) => {
    setState((draft) => {
      draft.form[key] = value
    })
  }

  const onFormSubmit = () => {
    formRef.current.onSubmit(async () => {
      console.log(form)
      const { bankName, bankNum } = form
      await communityApi.updateCashWithDrawAccount({
        bank_name: bankName,
        bankcard_no: bankNum
      })
      showToast($t('8473e56d.3fdaea'))
      Taro.navigateBack()
    })
  }

  return (
    <SpPage
      className='page-community-withdraw-bank'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={onFormSubmit}>
            {$t('8473e56d.939d53')}
          </AtButton>
        </View>
      }
    >
      <View className='form-container'>
        <SpForm ref={formRef} className='applychief-form' formData={form} rules={rules}>
          <SpFormItem label={$t('8473e56d.181d9a')} prop='bankName'>
            <AtInput
              clear
              focus
              name='bankName'
              value={form.bankName}
              placeholder={$t('8473e56d.c4fb3e')}
              onChange={onInputChange.bind(this, 'bankName')}
            />
          </SpFormItem>
          <SpFormItem label={$t('8473e56d.d98e9d')} prop='bankNum'>
            <AtInput
              clear
              focus
              name='bankNum'
              value={form.bankNum}
              placeholder={$t('8473e56d.994795')}
              onChange={onInputChange.bind(this, 'bankNum')}
            />
          </SpFormItem>
        </SpForm>
      </View>
      <View className='withdraw-tip'>
        <View className='tip-content'>{$t('8473e56d.17ee5d')}</View>
        <View className='tip-content'>{$t('8473e56d.bd1c55')}</View>
      </View>
    </SpPage>
  )
}

CommunityWithdrawBank.options = {
  addGlobalClass: true
}

export default CommunityWithdrawBank
