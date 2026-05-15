/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { SpPage, SpInput as AtInput } from '@/components'
import { SpTimer } from '@/subpages/components'
import { classNames, validate, showToast } from '@/utils'
import { AtForm, AtButton } from 'taro-ui'
import api from '@/api'
import { useImmer } from 'use-immer'
import { useSelector } from 'react-redux'
import { useTranslation, $t } from '@/i18n'
import { CompPasswordInput } from './comps'
import { normalizeAuthRedirectParam } from './util'
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
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}
  const {
    params: { phone, redi_url }
  } = $instance?.router

  const [state, setState] = useImmer(initialValue)

  const { username, yzm, vcode, imgInfo, password, is_new } = state

  const { colorPrimary } = useSelector((state) => state.sys)

  const handleInputChange = (name) => (val) => {
    setState((state) => {
      state[name] = val
    })
  }

  const getImageVcode = async (validate = false) => {
    // if (validate) {
    //   const is_stop = await showModalReg()
    //   if (is_stop) return
    // }
    const img_res = await api.user.regImg({ type: SYMBOL })
    setState((state) => {
      state.imgInfo = img_res
    })
  }

  const showModalReg = async () => {
    let url = `/subpages/auth/reg`
    if (redi_url) {
      url += `?redi_url=${encodeURIComponent(normalizeAuthRedirectParam(redi_url))}`
    }
    const { is_new } = await api.wx.getIsNew({ mobile: username })
    setState((_state) => {
      _state.is_new = !!is_new
    })
    if (is_new === 1) {
      const res = await Taro.showModal({
        title: '提示',
        content: '此手机号码未注册、是否同意前往注册',
        cancelText: '拒绝',
        confirmText: '同意',
        confirmColor: colorPrimary
      })
      if (res.confirm) {
        Taro.navigateTo({
          url
        })
      }
      return true
    }
    return false
  }

  const handleTimerStart = async (resolve) => {
    if (!validate.isMobileNum(username)) {
      showToast($t('0dbd2dc3.a32ab5'))
      return
    }
    if (!validate.isRequired(yzm)) {
      showToast($t('0dbd2dc3.e70066'))
      return
    }

    // 验证手机号是否注册
    const isNewUser = await showModalReg()
    if (isNewUser) return

    try {
      await api.user.regSmsCode({
        type: SYMBOL,
        mobile: username,
        yzm: yzm,
        token: imgInfo.imageToken
      })
      showToast($t('0dbd2dc3.4d7fb5'))
      resolve()
    } catch (e) {
      getImageVcode()
    }
  }

  const handleSubmit = async () => {
    if (!validate.isPassword(password)) {
      return showToast($t('0dbd2dc3.eac67a'))
    }
    try {
      await api.user.forgotPwd({
        mobile: username,
        password,
        vcode
      })
      showToast($t('0dbd2dc3.00f316'), () => {
        Taro.navigateBack()
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getImageVcode()
  }, [])

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('77431c25.0974fb') })
  }, [i18n.language])

  useEffect(() => {
    if (phone) {
      setState((_state) => {
        _state.username = phone
      })
    }
  }, [phone])

  //全填写完
  const isFull = username && yzm && vcode && password && password.length >= 6

  return (
    <SpPage
      className={classNames('page-auth-forgotpwd', {
        'is-full': isFull
      })}
    >
      <View className='auth-hd'>
        <View className='title'>{$t('0dbd2dc3.0974fb')}</View>
      </View>
      <View className='auth-bd'>
        <AtForm className='form'>
          <View className={classNames('form-field')}>
            <AtInput
              clear
              name='mobile'
              maxLength={11}
              type='tel'
              value={username}
              placeholder={$t('0dbd2dc3.787a47')}
              onChange={handleInputChange('username')}
            />
          </View>

          {/* 验证码登录，验证码超过1次，显示图形验证码 */}
          <View className='form-field'>
            <View className='input-field'>
              <AtInput
                clear
                name='yzm'
                value={yzm}
                placeholder={$t('0dbd2dc3.e70066')}
                onChange={handleInputChange('yzm')}
              />
            </View>
            <View className='btn-field'>
              {imgInfo && (
                <Image
                  className='image-vcode'
                  src={imgInfo.imageData}
                  onClick={() => getImageVcode(true)}
                />
              )}
            </View>
          </View>

          <View className='form-field'>
            <View className='input-field'>
              <AtInput
                clear
                name='vcode'
                value={vcode}
                placeholder={$t('0dbd2dc3.d0c06a')}
                onChange={handleInputChange('vcode')}
              />
            </View>
            <View className='btn-field'>
              <SpTimer
                defaultMsg='发送验证码'
                msg='重新发送'
                onStart={handleTimerStart}
              />
            </View>
          </View>

          <View className='form-field'>
            <CompPasswordInput onChange={handleInputChange('password')} />
          </View>
          {/* <View className='form-tip'>{PASSWORD_TIP()}</View> */}

          <View className='form-submit'>
            <AtButton
              disabled={!isFull}
              circle
              type='primary'
              className='login-button'
              onClick={handleSubmit}
            >
              {$t('0dbd2dc3.769d88')}
            </AtButton>
          </View>
        </AtForm>
      </View>
    </SpPage>
  )
}

export default PageBindPhone
