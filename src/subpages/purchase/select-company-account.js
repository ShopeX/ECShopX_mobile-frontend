import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames, showToast, VERSION_IN_PURCHASE} from '@/utils'
import './select-company-account.scss'
import CompBottomTip from './comps/comp-bottomTip'
import { SpForm, SpFormItem } from '@/components'

const initialState = {
  form: {
    account: '',
    auth_code: ''
  },
  rules: {
    account: [
      { required: true, message: '账号不能为空' }
      // { validate: 'mobile', message: '请输入正确的邮箱地址' }
    ],
    auth_code: [{ required: true, message: '请输入验证码' }]
  }
}

function SelectComponent(props) {
  const [state, setState] = useImmer(initialState)
  const [isError, setIsError] = useState(false)
  const formRef = useRef()
  const { form, rules } = state
  const $instance = getCurrentInstance()
  const { enterprise_id, enterprise_name } = $instance.router.params

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
      const { account, auth_code } = form
      // 无商场逻辑（需要调整一个页面去授权手机号）
      if (VERSION_IN_PURCHASE) {
        Taro.navigateTo({ url: `/subpages/purchase/select-company-phone` }) // 有商场员工手机号登录
      } else {
        const params = {
          enterprise_id,
          account,
          auth_code
        }
        await api.purchase.setEmployeeAuth(params)
        showToast('验证成功')
        setTimeout(() => {
          Taro.redirectTo({ url: `/subpages/purchase/select-company-activity` })
        }, 2000)
      }
    })
  }

  return (
    <View className='select-component'>
      <View className='select-component-title'>{enterprise_name}</View>
      <View className='select-component-prompt'>使用已注册账号密码进行验证</View>
      <View className='selecte-box'>
        <SpForm ref={formRef} className='login-form' formData={form} rules={rules}>
            <SpFormItem prop='account'>
              <AtInput
                placeholder='请输入完整登录账号'
                value={form.account}
                onChange={onInputChange.bind(this, 'account')}
                className={classNames('select-option', isError ? 'err' : '')}
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
                className={classNames('select-option ', isError ? 'err' : '')}
                name='auth_code'
                clear
                focus
              />
            </SpFormItem>
        </SpForm>

        {/* <AtInput
          placeholder='请输入完整登录账号'
          value={state.account}
          onChange={onChangeAccount}
          className={classNames('select-option',isError?'err':'')}
          clear
        />
        <AtInput
          placeholder='请输入登录密码'
          value={state.auth_code}
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

      <AtButton circle className='btns-staff' disabled={!(form.account || form.auth_code)} onClick={onFormSubmit}>
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

// 账号登录