import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames,showToast} from '@/utils'
import './select-company-account.scss'
import CompBottomTip from './comps/comp-bottomTip'
import { SpForm, SpFormItem } from '@/components'

const initialState = {
  form: {
    account: '',
    password: ''
  },
  rules: {
    account: [
      { required: true, message: '账号不能为空' }
      // { validate: 'mobile', message: '请输入正确的邮箱地址' }
    ],
    password: [{ required: true, message: '请输入验证码' }]
  }
}

function SelectComponent(props) {
  const [state, setState] = useImmer(initialState)
  const [isError, setIsError] = useState(true)
  const formRef = useRef()
  const { form, rules } = state

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

  return (
    <View className='select-component'>
      <View className='select-component-title'>商派软件有限公司</View>
      <View className='select-component-prompt'>使用已注册账号密码进行验证</View>
      <View className='selecte-box'>
        <SpForm ref={formRef} className='login-form' formData={form} rules={rules}>
            <SpFormItem prop='account'>
              <AtInput
                placeholder='请输入完整登陆账号'
                value={form.account}
                onChange={onInputChange.bind(this, 'account')}
                className={classNames('select-option', isError ? 'err' : '')}
                clear
                name='account'
                focus
              />
            </SpFormItem>
            <SpFormItem prop='password'>
              <AtInput
                placeholder='请输入登陆密码'
                value={form.password}
                onChange={onInputChange.bind(this, 'password')}
                className={classNames('select-option', isError ? 'err' : '')}
                name='password'
                clear
                focus
              />
            </SpFormItem>
        </SpForm>

        {/* <AtInput
          placeholder='请输入完整登陆账号'
          value={state.account}
          onChange={onChangeAccount}
          className={classNames('select-option',isError?'err':'')}
          clear
        />
        <AtInput
          placeholder='请输入登陆密码'
          value={state.password}
          onChange={onChangePsd}
          className={classNames('select-option',isError?'err':'')}
          clear
        /> */}
      </View>
      <View className='info'>
        <Text className='iconfont icon-info icon'></Text>
        <Text>如忘记密码，请联系企业管理员处理</Text>
      </View>
      {isError && <View className='err-info'>账号或密码错误，请重新输入</View>}

      <AtButton circle className='btns-staff' disabled={!(form.account || form.password)} onClick={onFormSubmit}>
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
