/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { SpPage, SpInput as AtInput } from '@/components'
import { SpTimer } from '@/subpages/components'
import { classNames, validate, showToast, tokenParseH5 } from '@/utils'
import { AtForm, AtButton } from 'taro-ui'
import { useLogin } from '@/hooks'
import api from '@/api'
import S from '@/spx'
import { useImmer } from 'use-immer'
import { useTranslation, $t } from '@/i18n'
import { setTokenAndRedirect, setToken } from './util'
import './bindPhone.scss'

const SYMBOL = 'login'

const initialValue = {
  username: '',
  check_type: SYMBOL,
  yzm: '',
  vcode: '',
  imgInfo: null
}

const PageBindPhone = () => {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('c91bc1c0.c36b02') })
    const onLang = () => Taro.setNavigationBarTitle({ title: $t('c91bc1c0.c36b02') })
    i18n.on('languageChanged', onLang)
    return () => i18n.off('languageChanged', onLang)
  }, [i18n])
  const {
    params: { unionid, redi_url }
  } = $instance?.router

  const { getUserInfo } = useLogin()

  const [state, setState] = useImmer(initialValue)

  const { username, yzm, vcode, check_type, imgInfo } = state

  const handleInputChange = (name) => (val) => {
    setState((state) => {
      state[name] = val
    })
  }

  const getImageVcode = async () => {
    const img_res = await api.user.regImg({ type: SYMBOL })
    setState((state) => {
      state.imgInfo = img_res
    })
  }

  const handleTimerStart = async (resolve) => {
    if (!validate.isMobileNum(username)) {
      showToast($t('d121a348.a32ab5'))
      return
    }
    if (!validate.isRequired(yzm)) {
      showToast($t('d121a348.e70066'))
      return
    }
    try {
      await api.user.regSmsCode({
        type: SYMBOL,
        mobile: username,
        yzm: yzm,
        token: imgInfo.imageToken
      })
      showToast($t('d121a348.4d7fb5'))
      resolve()
    } catch (e) {
      getImageVcode()
    }
  }

  const loginSuccess = async (token) => {
    if (!token) return
    await setTokenAndRedirect(token, async () => {
      await getUserInfo()
    })
  }

  const handleSubmit = async () => {
    try {
      const { token } = await api.user.bind({
        username,
        check_type,
        vcode,
        union_id: unionid
      })
      const { is_new } = tokenParseH5(token)

      if (is_new === 1) {
        setToken(token)
        Taro.navigateTo({
          url: `/subpages/auth/edit-password?phone=${username}`
        })
      } else {
        loginSuccess(token)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getImageVcode()
  }, [])

  useDidShow(async () => {
    if (S.getAuthToken()) {
      const url = redi_url ? decodeURIComponent(redi_url) : '/subpages/member/index'
      window.location.href = url
    }
  })

  const handleClickLeft = () => {
    Taro.redirectTo({
      url: `/subpages/auth/login?redirect=${redi_url}`
    })
  }

  //全填写完
  const isFull = username && yzm && vcode

  return (
    <SpPage
      className={classNames('page-auth-bindphone', {
        'is-full': isFull
      })}
      onClickLeftIcon={handleClickLeft}
    >
      <View className='auth-hd'>
        <View className='title'>{$t('d121a348.398180')}</View>
      </View>
      <View className='auth-bd'>
        <AtForm className='form'>
          <View className='form-field'>
            <AtInput
              clear
              name='mobile'
              maxLength={11}
              type='tel'
              value={username}
              placeholder={$t('d121a348.787a47')}
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
                placeholder={$t('d121a348.e70066')}
                onChange={handleInputChange('yzm')}
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
                placeholder={$t('d121a348.d0c06a')}
                onChange={handleInputChange('vcode')}
              />
            </View>
            <View className='btn-field'>
              <SpTimer onStart={handleTimerStart} />
            </View>
          </View>

          <View className='form-submit'>
            <AtButton
              disabled={!isFull}
              circle
              type='primary'
              className='login-button'
              onClick={handleSubmit}
            >
              {$t('d121a348.38ce27')}
            </AtButton>
          </View>
        </AtForm>
      </View>
    </SpPage>
  )
}

export default PageBindPhone
