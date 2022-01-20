import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpPage, SpTimer, SpCheckbox } from '@/components'
import { classNames, validate, showToast } from '@/utils'
import { useSelector } from 'react-redux'
import { CompPasswordInput } from './comps'
import { setTokenAndRedirect } from './util'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { PASSWORD_TIP } from './const'
import api from '@/api'
import { useImmer } from 'use-immer'
import { useLogin } from '@/hooks'
import './reg.scss'

const initialValue = {
  mobile: '',
  yzm: '',
  vcode: '',
  password: '',
  imgInfo: null,
  checked: false,
  member_register: '',
  privacy: ''
}

const CODE_SYMBOL = 'sign'

const Reg = () => {
  const [state, setState] = useImmer(initialValue)

  const { mobile, yzm, vcode, password, imgInfo, checked, member_register, privacy } = state

  const { colorPrimary } = useSelector((state) => state.sys)

  const { getUserInfo } = useLogin()

  const handleInputChange = (name) => (val) => {
    setState((state) => {
      state[name] = val
    })
  }

  const getImageVcode = async () => {
    const img_res = await api.user.regImg({ type: CODE_SYMBOL })
    setState((state) => {
      state.imgInfo = img_res
    })
  }

  const handleTimerStart = async (resolve) => {
    if (!validate.isMobileNum(mobile)) {
      showToast('请输入正确的手机号')
      return
    }
    if (!validate.isRequired(yzm)) {
      showToast('请输入图形验证码')
      return
    }
    try {
      await api.user.regSmsCode({
        type: CODE_SYMBOL,
        mobile: mobile,
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
    if (!checked) {
      const res = await Taro.showModal({
        title: '提示',
        content: `请先阅读并同意${member_register}、${privacy}?`,
        showCancel: true,
        cancel: '取消',
        cancelText: '拒绝',
        confirmText: '同意',
        confirmColor: colorPrimary
      })
      if (!res.confirm) return
    }

    if (!validate.isMobileNum(mobile)) {
      showToast('请输入正确的手机号')
      return
    }
    if (!validate.isRequired(vcode)) {
      showToast('请输入验证码')
      return
    }
    if (!validate.isRequired(password)) {
      showToast('请输入密码')
      return
    }
    if (!validate.isPassword(password)) {
      return showToast('密码格式不正确')
    }
    try {
      //从登陆页跳转过来
      const { token } = await api.user.reg({
        auth_type: 'local',
        check_type: CODE_SYMBOL,
        mobile,
        password,
        vcode,
        sex: 0,
        user_type: 'local'
      })
      showToast('注册成功', async () => {
        await setTokenAndRedirect(token, async () => {
          await getUserInfo()
        })
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handleSelect = () => {
    setState((_state) => {
      _state.checked = !checked
    })
  }

  const fetchPrivacyData = async () => {
    const {
      protocol: { member_register, privacy }
    } = await api.shop.getStoreBaseInfo()

    setState((v) => {
      v.member_register = member_register
      v.privacy = privacy
    })
  }

  useEffect(() => {
    getImageVcode()
    fetchPrivacyData()
  }, [])

  //全填写完
  const isFull = mobile && yzm && vcode && password

  return (
    <SpPage
      className={classNames('page-auth-reg', {
        'is-full': isFull
      })}
    >
      <View className='auth-hd'>
        <View className='title'>欢迎注册</View>
      </View>
      <View className='auth-bd'>
        <AtForm className='form'>
          <View className='form-field'>
            <AtInput
              clear
              name='mobile'
              maxLength={11}
              type='tel'
              value={state.mobile}
              placeholder='请输入您的手机号码'
              onChange={handleInputChange('mobile')}
            />
          </View>

          {/* 验证码登录，验证码超过1次，显示图形验证码 */}
          <View className='form-field'>
            <View className='input-field'>
              <AtInput
                clear
                name='yzm'
                value={state.yzm}
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
                value={state.vcode}
                placeholder='请输入验证码'
                onChange={handleInputChange('vcode')}
              />
            </View>
            <View className='btn-field'>
              <SpTimer onStart={handleTimerStart} />
            </View>
          </View>

          <View className='form-field'>
            <View className='input-field'>
              <CompPasswordInput onChange={handleInputChange('password')} />
            </View>
          </View>

          {/* <View className='form-tip'>{PASSWORD_TIP}</View> */}

          <View className='form-submit'>
            <AtButton
              disabled={!isFull}
              circle
              type='primary'
              className='login-button'
              onClick={handleSubmit}
            >
              同意协议并注册
            </AtButton>
          </View>

          <View className='form-text'>
            <SpCheckbox checked={checked} onChange={handleSelect} />
            <View>
              已阅读并同意
              <Text
                className='primary-color'
                onClick={() =>
                  Taro.navigateTo({
                    url: '/subpages/auth/reg-rule?type=member_register'
                  })
                }
              >
                《{member_register}》
              </Text>
              、
              <Text
                className='primary-color'
                onClick={() =>
                  Taro.navigateTo({
                    url: '/subpages/auth/reg-rule?type=privacy'
                  })
                }
              >
                《{privacy}》
              </Text>
            </View>
          </View>
        </AtForm>
      </View>
    </SpPage>
  )
}

export default Reg
