/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useRef, useMemo } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { showToast } from '@/utils'
import { View } from '@tarojs/components'
import { SpPage, SpForm, SpFormItem, SpInput as AtInput } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './login.scss'

const initialState = {
  form: {
    mobile: '',
    code: ''
  }
}
function DianwuLogin(props) {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const { form } = state
  const formRef = useRef()

  const rules = useMemo(
    () => ({
      mobile: [
        { required: true, message: $t('4e26899b.a11685') },
        { validate: 'mobile', message: $t('4e26899b.18d771') }
      ],
      code: [{ required: true, message: $t('4e26899b.d0c06a') }]
    }),
    [i18n.language]
  )

  const onInputChange = (key, value) => {
    setState((draft) => {
      draft.form[key] = value
    })
  }

  const onFormSubmit = async () => {
    formRef.current.onSubmit(async () => {
      const { mobile, code } = form
      await api.operator.smsLogin({
        mobile,
        code,
        logintype: 'smsstaff'
      })
      showToast($t('4e26899b.71fa3b'))
    })
  }

  return (
    <SpPage className='page-dianwu-login'>
      <View className='head-block'>
        <View className='head-block__title'>{$t('4e26899b.04b015')}</View>
        <View className='head-block__desc'>{$t('4e26899b.661902')}</View>
      </View>

      <SpForm ref={formRef} className='login-form' formData={form} rules={rules}>
        <View className='head-form'>
          <View className='head-form__title'>{$t('4e26899b.81f442')}</View>
        </View>
        <SpFormItem prop='mobile'>
          <AtInput
            clear
            focus
            name='mobile'
            value={form.mobile}
            placeholder={$t('4e26899b.787a47')}
            onChange={onInputChange.bind(this, 'mobile')}
          />
        </SpFormItem>

        <SpFormItem prop='code'>
          <AtInput
            clear
            focus
            name='code'
            value={form.code}
            placeholder={$t('4e26899b.d0c06a')}
            onChange={onInputChange.bind(this, 'code')}
          />
          <View className='btn-text'>{$t('4e26899b.d369f4')}</View>
        </SpFormItem>

        <AtButton circle type='primary' onClick={onFormSubmit}>
          {$t('4e26899b.939d53')}
        </AtButton>
      </SpForm>
      <View></View>
    </SpPage>
  )
}

DianwuLogin.options = {
  addGlobalClass: true
}

export default DianwuLogin
