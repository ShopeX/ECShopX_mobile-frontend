import React, { useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro'
import { SpPage, SpTimer } from '@/components'
import { classNames, validate, showToast, tokenParseH5 } from '@/utils'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { useLogin } from '@/hooks'
import api from '@/api'
import { useImmer } from 'use-immer'
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
  const $instance = getCurrentInstance()
  const {
    params: { unionid, redi_url }
  } = $instance.router

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
        const self = this
        setTokenAndRedirect(token, async () => {
          await getUserInfo()
        }).bind(self)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getImageVcode()
  }, [])

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
        <View className='title'>手机号绑定</View>
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
              下一步
            </AtButton>
          </View>
        </AtForm>
      </View>
    </SpPage>
  )
}

export default PageBindPhone
