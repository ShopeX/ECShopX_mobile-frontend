import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { useLogin, useModal } from '@/hooks'
import { classNames, showToast, VERSION_IN_PURCHASE } from '@/utils'
import qs from 'qs'
import { SpForm, SpFormItem, SpPage, SpInput as AtInput } from '@/components'
import CompBottomTip from './comps/comp-bottomTip'
import './select-company-account.scss'


function PurchaseAuthAccount() {
  const { isNewUser } = useLogin()
  const [state, setState] = useImmer({
    form: {
      account: '',
      auth_code: ''
    },
    rules: {
      account: [
        { required: true, message: '账号不能为空' }
      ],
      auth_code: [{ required: true, message: '请输入登录密码' }]
    }
  })
  const formRef = useRef()
  const { form, rules } = state
  const { params } = useRouter()
  const { enterprise_id, enterprise_name, enterprise_sn } = params
  const { showModal } = useModal()

  const onInputChange = (key, value) => {
    setState((draft) => {
      draft.form[key] = value
    })
  }

  const onFormSubmit = async () => {
    await formRef.current.onSubmitAsync()
    const { account, auth_code } = form
    // 无商城逻辑（需要调整一个页面去授权手机号）
    if (isNewUser) {
      Taro.navigateTo({
        url: `/subpages/purchase/select-company-phone?${qs.stringify({
          enterprise_sn,
          enterprise_name,
          enterprise_id,
          account, auth_code
        })}`
      })
    } else {
      const params = {
        enterprise_id,
        account,
        auth_code,
        showError: false
      }
      try {
        await api.purchase.setEmployeeAuth(params)
        showToast('验证成功')
        setTimeout(() => {
          Taro.reLaunch({ url: `/pages/purchase/index` })
        }, 700)
      } catch (e) {
        if (e.message.indexOf('重复绑定') > -1) {
          await showModal({
            title: '验证失败',
            content: e.message,
            showCancel: false,
            confirmText: '我知道了',
            contentAlign: 'center'
          })
          Taro.reLaunch({ url: `/pages/purchase/index` })
        } else {
          showToast(e.message)
        }
      }
    }
  }

  return (
    <SpPage className='page-purchase-auth-account select-component'>
      <View className='select-component-title'>{enterprise_name}</View>
      <View className='select-component-prompt'>使用已注册账号密码进行验证</View>
      <View className='selecte-box'>
        <SpForm ref={formRef} className='login-form' formData={form} rules={rules}>
          <SpFormItem prop='account'>
            <AtInput
              placeholder='请输入完整登录账号'
              value={form.account}
              onChange={onInputChange.bind(this, 'account')}
              clear
              name='account'
              focus
            />
          </SpFormItem>
          <SpFormItem prop='auth_code'>
            <AtInput
              placeholder='请输入登录密码'
              value={form.auth_code}
              onChange={onInputChange.bind(this, 'auth_code')}
              name='auth_code'
              clear
              focus
            />
          </SpFormItem>
        </SpForm>
      </View>
      <View className='info'>
        <Text className='iconfont icon-info icon'></Text>
        <Text>如忘记密码，请联系企业管理员处理</Text>
      </View>

      <AtButton circle className='btns-staff' disabled={!(form.account || form.auth_code)} onClick={onFormSubmit}>
        验证
      </AtButton>
      <CompBottomTip />
    </SpPage>
  )
}

PurchaseAuthAccount.options = {
  addGlobalClass: true
}

export default PurchaseAuthAccount

// 账号登录
