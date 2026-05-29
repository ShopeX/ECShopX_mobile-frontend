/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage } from '@/components'
import api from '@/api'
import * as merchantApi from '@/api/merchant'
import S from '@/spx'
import { useTranslation, $t } from '@/i18n'
import { MButton, MInput, MRadio } from './comps'
import { navigateToAgreement } from './util'
import { useTimer } from './hook'
import './login.scss'

const Login = () => {
  useTranslation()
  const [form, setForm] = useState({ mobile: '', vcode: '', tcode: '' })

  const [imgCodeInfo, setImgCodeInfo] = useState({})

  const [agree, setAgree] = useState(false)

  const phonePrefix = (value) => {
    if (value) {
      return <Text className='iconfont icon-a-shoujihaoshouji'></Text>
    } else {
      return <SpImage src='phone_icon.png' className='phone-icon' lazyLoad={false} />
    }
  }

  const tcodePrefix = (value) => {
    if (value) {
      return <Text className='iconfont icon-tuxingyanzhengma-01-copy'></Text>
    } else {
      return <SpImage src='tcode_icon.png' className='tcode-icon' lazyLoad={false} />
    }
  }

  const codePrefix = (value) => {
    if (value) {
      return <Text className='iconfont icon-yanzhengma'></Text>
    } else {
      return <SpImage src='vcode_icon.png' className='code-icon' lazyLoad={false} />
    }
  }

  const [time, startTime] = useTimer()

  const handleGetCode = async () => {
    if (!validate.isRequired(form.tcode)) {
      showToast($t('3ca883d0.e70066'))
      return
    }
    if (time !== null) {
      // showToast('验证码已发送，请稍后')
      return
    }
    if (!validate.isMobileNum(form.mobile)) {
      showToast($t('7187dbd0.a32ab5'))
      return
    }
    const query = {
      type: 'merchant_login',
      mobile: form.mobile,
      yzm: form.tcode,
      token: imgCodeInfo.imageToken
    }
    try {
      await api.user.regSmsCode(query)
      showToast($t('e1d26b67.9db9a7'))
    } catch (error) {
      getImageCode()
      return false
    }
    startTime()
  }

  const handleChange = (key) => (val) => {
    setForm({
      ...form,
      [key]: val
    })
  }

  const handleLogin = async () => {
    if (!validate.isRequired(form.mobile)) {
      showToast($t('4289b966.c36b0b'))
      return
    }
    if (!validate.isMobileNum(form.mobile)) {
      showToast($t('7187dbd0.a32ab5'))
      return
    }
    if (!validate.isRequired(form.tcode)) {
      showToast($t('4289b966.c3d869'))
      return
    }
    if (!validate.isRequired(form.vcode)) {
      showToast($t('4289b966.d76109'))
      return
    }
    if (!agree) {
      showToast($t('4289b966.29c1bc'))
      return
    }
    try {
      const { token } = await merchantApi.login({ mobile: form.mobile, vcode: form.vcode })
      if (token) {
        S?.setAuthToken(token)
        const { step } = await merchantApi.getStep()
        const applyUrl = '/subpages/merchant/apply'
        const applyAudit = '/subpages/merchant/audit'
        //已提交全部资料信息
        if (step === 4) {
          Taro.redirectTo({
            url: applyAudit
          })
        } else {
          Taro.redirectTo({
            url: applyUrl
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getImageCode = async () => {
    const query = {
      type: 'merchant_login'
    }
    try {
      const img_res = await api.user.regImg(query)
      setImgCodeInfo(img_res)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickImageCode = () => {
    getImageCode()
  }

  useEffect(() => {
    getImageCode()
  }, [])

  const tcodeSuffix = (
    <SpImage
      src={imgCodeInfo.imageData}
      className='tcode-img'
      onClick={handleClickImageCode}
      lazyLoad={false}
    />
  )

  const codeSuffix = (
    <View
      className={classNames('code-suffix', { 'timing': time !== null })}
      onClick={handleGetCode}
    >
      {time === null ? $t('4e26899b.d369f4') : time}
    </View>
  )

  return (
    <SpPage className={classNames('page-merchant-login')} navbar={false}>
      <SpImage src='shangjiaruzhu_bg.png' className='login-bg' mode='widthFix' />
      <View className='page-merchant-login-content'>
        <MInput
          prefix={phonePrefix}
          placeholder={$t('692ba07e.6e4f4b')}
          onChange={handleChange('mobile')}
        />
        <MInput
          prefix={tcodePrefix}
          placeholder={$t('3ca883d0.e70066')}
          className='mt-32'
          onChange={handleChange('tcode')}
          suffix={tcodeSuffix}
        />
        <MInput
          prefix={codePrefix}
          placeholder={$t('4289b966.080be6')}
          className='mt-32'
          onChange={handleChange('vcode')}
          suffix={codeSuffix}
        />
        <MButton className={classNames('mt-52', 'login-button')} onClick={handleLogin}>
          {$t('4289b966.7c1c42')}
        </MButton>
        <View className='mt-32 view-flex view-flex-center view-flex-middle'>
          <MRadio checked={agree} onClick={() => setAgree(!agree)} />
          <View className='ml-16 radio-text'>
            {$t('4289b966.ed8fae')}
            <Text className='primary-color' onClick={navigateToAgreement}>
              {$t('3c94bb91.1e058c')}
            </Text>
          </View>
        </View>
      </View>
    </SpPage>
  )
}

export default Login
