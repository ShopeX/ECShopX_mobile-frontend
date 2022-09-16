import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { AtInput, AtButton } from 'taro-ui'
import api from '@/api'
import doc from '@/doc'
import { showToast } from '@/utils'
import { View } from '@tarojs/components'
import { SpPage, SpForm, SpFormItem } from '@/components'
import './login.scss'

const initialState = {
  form: {
    mobile: '',
    code: ''
  },
  rules: {
    mobile: [
      { required: true, message: '手机号不能为空' },
      { validate: 'mobile', message: '请输入正确的手机号码' }
    ],
    code: [{ required: true, message: '请输入验证码' }]
  }
}
function DianwuLogin(props) {
  const [state, setState] = useImmer(initialState)
  const { form, rules } = state
  const formRef = useRef()

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
      showToast('登录成功')
    })
  }

  return (
    <SpPage className='page-dianwu-login'>
      <View className='head-block'>
        <View className='head-block__title'>欢迎登录</View>
        <View className='head-block__desc'>未注册的手机号验证后自动创建账号</View>
      </View>

      <SpForm ref={formRef} className='login-form' formData={form} rules={rules}>
        <View className='head-form'>
          <View className='head-form__title'>中国大陆 +86</View>
        </View>
        <SpFormItem prop='mobile'>
          <AtInput
            clear
            focus
            name='mobile'
            value={form.mobile}
            placeholder='请输入您的手机号码'
            onChange={onInputChange.bind(this, 'mobile')}
          />
        </SpFormItem>

        <SpFormItem prop='code'>
          <AtInput
            clear
            focus
            name='code'
            value={form.code}
            placeholder='请输入验证码'
            onChange={onInputChange.bind(this, 'code')}
          />
          <View className='btn-text'>获取验证码</View>
        </SpFormItem>

        <AtButton circle type='primary' onClick={onFormSubmit}>
          提交
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
