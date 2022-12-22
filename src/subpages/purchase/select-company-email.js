import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames, showToast } from '@/utils'
import './select-company-email.scss'
import CompBottomTip from './comps/comp-bottomTip'
import { SpForm, SpFormItem, SpTimer } from '@/components'

const initialState = {
  form: {
    email: '',
    code: ''
  },
  rules: {
    email: [
      // { required: true, message: '邮箱地址不能为空' },
      // { validate: 'mobile', message: '请输入正确的邮箱地址' }
    ],
    code: [{ required: true, message: '请输入验证码' }]
  }
}

function SelectComponent(props) {
  const [state, setState] = useImmer(initialState)
  const { form, rules } = state

  const [isError, setIsError] = useState(true)
  const [isErrorCode, setIsErrorCode] = useState(true)
  const formRef = useRef()

  useEffect(() => {
    //请求获取企业信息
  }, [])

  const onInputChange = (key, value) => {
    setState((draft) => {
      draft.form[key] = value
    })
  }

  const onFormSubmit = async () => {
    formRef.current.onSubmit(async () => {
      const { email, code } = form
      // await api.operator.smsLogin({
      //   email,
      //   code,
      //   logintype: 'smsstaff'
      // })
      showToast('登录成功')
    })
  }

  // 获取验证码
  const getSmsCode = async (resolve) => {
    const { email } = form
    if (!/1\d{10}/.test(email)) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false
    }
    const query = {
      type: 'update',
      email
    }
    try {
      await api.user.regSmsCode(query)
      Taro.showToast({
        title: '发送成功',
        icon: 'none'
      })
    } catch (error) {
      return false
    }
    resolve()
  }

  return (
    <View className='select-component'>
      <View className='select-component-title'>商派软件有限公司</View>
      <View className='select-component-prompt'>使用已注册邮箱进行验证</View>
      <View className='selecte-box'>
        <SpForm ref={formRef} className='login-form' formData={form} rules={rules}>
          <View className={classNames(isError ? 'error-form-item' : '')}>
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
                className={classNames(form.email ? '' : 'unuse')}
                onStart={getSmsCode}
                defaultMsg='获取验证码'
                msg='重新获取'
              ></SpTimer>
            </SpFormItem>
          </View>

          {isError && <View className='err-info'>验证码错误，请重新输入验证码</View>}

          <View className={classNames(isError ? 'error-form-item' : '')}>
            <SpFormItem prop='code'>
              <AtInput
                clear
                focus
                name='code'
                value={form.code}
                placeholder='请输入邮箱验证码'
                onChange={onInputChange.bind(this, 'code')}
              />
            </SpFormItem>
          </View>

          {isError && (
            <View className='err-info'>邮箱地址错误，请重新输入或联系企业管理员修改</View>
          )}
          {isErrorCode && <View className='err-info'>验证码已过期，请重新获取验证码</View>}
        </SpForm>
      </View>

      <AtButton
        circle
        className='btns-staff'
        disabled={!(form.email || form.code)}
        onClick={onFormSubmit}
      >
        验证
      </AtButton>
      <CompBottomTip />
    </View>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent
