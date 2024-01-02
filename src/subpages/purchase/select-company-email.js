import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import { useLogin, useModal } from '@/hooks'
import api from '@/api'
import { classNames, showToast, VERSION_IN_PURCHASE } from '@/utils'
import qs from 'qs'
import './select-company-email.scss'
import CompBottomTip from './comps/comp-bottomTip'
import { SpForm, SpFormItem, SpTimer, SpPage } from '@/components'


function PurchaseAuthEmail(props) {
  const router = useRouter()
  const { isNewUser } = useLogin()
  const { showModal } = useModal()

  const [state, setState] = useImmer({
    form: {
      email: '',
      vcode: ''
    },
    rules: {
      email: [
        { required: true, message: '邮箱地址不能为空' },
        { validate: 'email', message: '请输入正确的邮箱' },
        {
          validate: async (value) => {
            const { enterprise_id } = router.params
            const { status } = await api.purchase.getEmailCode({ email: value, enterprise_id, showError: false })
            showToast(status ? '发送成功' : '发送失败')
          }
        }
      ],
      vcode: [
        { required: true, message: '请输入验证码' }
      ]
    }
  })
  const { form, rules } = state
  const formRef = useRef()
  const { enterprise_id, enterprise_name, enterprise_sn } = router.params

  const onInputChange = (key, value) => {
    setState((draft) => {
      draft.form[key] = value
    })
  }

  const onFormSubmit = async () => {
    // 有商城校验白名单，账号绑定并登录，无商城检验白名单通过手机号授权
    const { email, vcode } = form
    await formRef.current.onSubmitAsync(['vcode'])
    if (isNewUser) {
      // 无商城逻辑（需要调整一个页面去授权手机号）
      Taro.navigateTo({
        url: `/subpages/purchase/select-company-phone?${qs.stringify({
          enterprise_sn,
          enterprise_name,
          enterprise_id,
          email,
          vcode
        })}`
      })
    } else {
      const params = {
        enterprise_id,
        email,
        vcode,
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
          formRef.current.setMessage({ prop: 'vcode', message: e.message })
        }
      }
    }
  }

  // 获取验证码
  const getSmsCode = async () => {
    await formRef.current.onSubmitAsync(['email'])
  }

  return (
    <SpPage className='page-purchase-auth-email select-component'>
      <View className='select-component-title'>{enterprise_name}</View>
      <View className='select-component-prompt'>使用已注册邮箱进行验证</View>
      <View className='selecte-box'>
        <SpForm ref={formRef} className='login-form' formData={form} rules={rules}>
          <SpFormItem prop='email'>
            <AtInput
              clear
              focus
              name='email'
              value={form.email}
              placeholder='请输入完整邮箱地址'
              onChange={onInputChange.bind(this, 'email')}
            />
            <SpTimer
              className={classNames({ 'unuse': !form.email })}
              onStart={getSmsCode}
              defaultMsg='获取验证码'
              msg='重新获取'
            ></SpTimer>
          </SpFormItem>

          <SpFormItem prop='vcode'>
            <AtInput
              clear
              focus
              name='vcode'
              value={form.vcode}
              placeholder='请输入邮箱验证码'
              onChange={onInputChange.bind(this, 'vcode')}
            />
          </SpFormItem>
        </SpForm>
      </View>

      <AtButton
        circle
        className='btns-staff'
        disabled={!(form.email && form.vcode)}
        onClick={onFormSubmit}
      >
        验证
      </AtButton>
      <CompBottomTip />
    </SpPage>
  )
}

PurchaseAuthEmail.options = {
  addGlobalClass: true
}

export default PurchaseAuthEmail

// 邮箱登录
