import React, { useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { SpPage, SpTimer } from '@/components'
import { classNames, validate, showToast } from '@/utils'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import api from '@/api'
import { setTokenAndRedirect } from './util'
import { useImmer } from 'use-immer'
import './edit-password.scss'

const SYMBOL = 'login'

const initialValue = {
  password: '',
  repassword: ''
}

const PageEditPassword = () => {
  const $instance = getCurrentInstance()

  const {
    params: { phone, unionid, vcode }
  } = $instance.router

  const [state, setState] = useImmer(initialValue)

  const { password, repassword } = state

  const handleInputChange = (name) => (val) => {
    setState((state) => {
      state[name] = val
    })
  }

  const handleSubmit = async () => {
    if (password !== repassword) {
      return showToast('2次输入密码不一致!')
    }

    //微信登陆绑定逻辑
    if (unionid) {
      const { token } = await api.user.bind({ username: phone, password, union_id: unionid })
      setTokenAndRedirect(token)
    } else {
      //从登陆页跳转过来
      await api.user.reg({
        auth_type: 'local',
        check_type: 'login',
        mobile: phone,
        user_name: phone,
        password,
        vcode,
        sex: 0,
        user_type: 'local'
      })
      Taro.navigateBack()
    }
  }

  //全填写完
  const isFull = phone && password && repassword

  return (
    <SpPage
      className={classNames('page-auth-edit-password', {
        'is-full': isFull
      })}
    >
      <View className='auth-hd'>
        <View className='title'>设置密码</View>
        <View className='desc'>请设置密码完成注册</View>
      </View>
      <View className='auth-bd'>
        <AtForm className='form'>
          <View className='form-field'>
            <AtInput
              clear
              type='password'
              name='mobile'
              maxLength={11}
              type='tel'
              value={password}
              placeholder='请输入密码'
              onChange={handleInputChange('password')}
            />
          </View>
          <View className='form-field'>
            <AtInput
              clear
              name='mobile'
              maxLength={11}
              type='tel'
              value={repassword}
              placeholder='再次输入密码'
              onChange={handleInputChange('repassword')}
            />
          </View>
          <View className='form-tip'>6-16位密码、数字或字母</View>

          <View className='form-submit'>
            <AtButton
              disabled={!isFull}
              circle
              type='primary'
              className='login-button'
              onClick={handleSubmit}
            >
              完成
            </AtButton>
          </View>
        </AtForm>
      </View>
    </SpPage>
  )
}

export default PageEditPassword
