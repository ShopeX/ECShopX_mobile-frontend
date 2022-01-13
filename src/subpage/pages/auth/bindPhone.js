import React, { useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro'
import { SpPage, SpTimer } from '@/components'
import { classNames, validate, showToast } from '@/utils'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { useLogin } from '@/hooks'
import api from '@/api'
import { useImmer } from 'use-immer'
import { setTokenAndRedirect, pushHistory } from './util'
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
    let url = ''

    const { is_new } = await api.wx.getIsNew({ mobile: username })

    //如果是新用户
    if (is_new === 1) {
      const { status } = await api.user.checkSmsCode({
        vcode,
        check_type: SYMBOL,
        mobile: username
      })
      //验证码错误
      if (status === 0) {
        showToast('手机验证码输入有误')
        getImageVcode()
        setState((_state) => {
          _state.yzm = ''
          _state.vcode = ''
        })
        return
      } else {
        url = `/subpage/pages/auth/edit-password?phone=${username}&unionid=${unionid}&redi_url=${redi_url}`
        Taro.redirectTo({
          url
        })
      }
    } else {
      url = process.env.APP_HOME_PAGE
      const { token } = await api.user.bind({ username, check_type, vcode, union_id: unionid })
      await setTokenAndRedirect(token, async () => {
        await getUserInfo()
      })
      return
    }
  }

  useEffect(() => {
    getImageVcode()
    //pushHistory('/subpage/pages/auth/login', '/subpage/pages/auth/bindPhone', '绑定手机号')
  }, [])

  const handleClickLeft = () => {
    Taro.redirectTo({
      url: `/subpage/pages/auth/login?redirect=${redi_url}`
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
