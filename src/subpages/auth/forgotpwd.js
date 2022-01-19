import React, { useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { SpPage, SpTimer } from '@/components'
import { classNames, validate, showToast } from '@/utils'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import api from '@/api'
import { useImmer } from 'use-immer'
import { CompPasswordInput } from './comps'
import './forgotpwd.scss'

const SYMBOL = 'forgot_password'

const initialValue = {
  username: '',
  check_type: SYMBOL,
  yzm: '',
  vcode: '',
  imgInfo: null,
  password: '',
  //默认是老用户
  is_new: false
}

const PageBindPhone = () => {
  const $instance = getCurrentInstance()
  const {
    params: { phone }
  } = $instance.router

  const [state, setState] = useImmer(initialValue)

  const { username, yzm, vcode, imgInfo, password, is_new } = state

  const handleInputChange = (name) => (val) => {
    setState((state) => {
      state[name] = val
    })
  }

  const getImageVcode = async () => {
    if (is_new) return showToast('该手机号还未注册！')
    const img_res = await api.user.regImg({ type: SYMBOL })
    setState((state) => {
      state.imgInfo = img_res
    })
  }

  const handleTimerStart = async (resolve) => {
    if (is_new) return showToast('该手机号还未注册！')
    if (!validate.isMobileNum(username)) {
      showToast('请输入正确的手机号')
      return
    }
    if (!validate.isRequired(yzm)) {
      showToast('请输入图形验证码')
      return
    }
    try {
      await api.user.regSmsCode({
        type: SYMBOL,
        mobile: username,
        yzm: yzm,
        token: imgInfo.imageToken
      })
      showToast('验证码已发送')
      resolve()
    } catch (e) {
      getImageVcode()
    }
  }

  const handleSubmit = async () => {
    if (!validate.isPassword(password)) {
      return showToast('密码格式不正确')
    }
    try {
      await api.user.forgotPwd({
        mobile: username,
        password,
        vcode
      })
      showToast('设置密码成功', () => {
        Taro.navigateBack()
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handlePhoneBlur = async (mobile) => {
    if (mobile) {
      const { is_new } = await api.wx.getIsNew({ mobile })
      setState((_state) => {
        _state.is_new = !!is_new
      })
    }
  }

  useEffect(() => {
    getImageVcode()
  }, [])

  useEffect(() => {
    if (phone) {
      setState((_state) => {
        _state.username = phone
      })
      handlePhoneBlur(phone)
    }
  }, [phone])

  //全填写完
  const isFull = username && yzm && vcode && password

  return (
    <SpPage
      className={classNames('page-auth-forgotpwd', {
        'is-full': isFull
      })}
    >
      <View className='auth-hd'>
        <View className='title'>忘记密码</View>
      </View>
      <View className='auth-bd'>
        <View className='form-title'>中国大陆 +86</View>
        <AtForm className='form'>
          <View className='form-field'>
            <AtInput
              clear
              name='mobile'
              maxLength={11}
              type='tel'
              value={username}
              placeholder='请输入您的手机号码'
              onChange={handleInputChange('username')}
              onBlur={handlePhoneBlur}
            />
          </View>

          {/* 验证码登录，验证码超过1次，显示图形验证码 */}
          <View className='form-field'>
            <View className='input-field'>
              <AtInput
                clear
                name='yzm'
                value={yzm}
                placeholder='请输入图形验证码'
                onChange={handleInputChange('yzm')}
                disabled={is_new}
              />
            </View>
            <View className='btn-field'>
              {imgInfo && (
                <Image className='image-vcode' src={imgInfo.imageData} onClick={getImageVcode} />
              )}
            </View>
          </View>

          <View className='form-field'>
            <View className='input-field'>
              <AtInput
                clear
                name='vcode'
                value={vcode}
                placeholder='请输入验证码'
                onChange={handleInputChange('vcode')}
                disabled={is_new}
              />
            </View>
            <View className='btn-field'>
              <SpTimer onStart={handleTimerStart} />
            </View>
          </View>

          <View className='form-field'>
            <CompPasswordInput onChange={handleInputChange('password')} disabled={is_new} />
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

          {is_new && <View className='error'>该手机号未注册！</View>}
        </AtForm>
      </View>
    </SpPage>
  )
}

export default PageBindPhone
