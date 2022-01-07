import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { MButton, MInput, MRadio } from './comps'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage } from '@/components'
import { navigateToAgreement } from './util'
import { useTimer } from './hook'
import api from '@/api'
import S from '@/spx'
import './login.scss'

const Login = () => {
  const [form, setForm] = useState({ mobile: '', vcode: '', tcode: '' })

  const [imgCodeInfo, setImgCodeInfo] = useState({})

  const [agree, setAgree] = useState(false)

  const phonePrefix = (value) => {
    if (value) {
      return <Text className='icon-a-shoujihaoshouji'></Text>
    } else {
      return <SpImage src='phone_icon.png' className='phone-icon' lazyLoad={false} />
    }
  }

  const tcodePrefix = (value) => {
    if (value) {
      return <Text className='icon-tuxingyanzhengma-01-copy'></Text>
    } else {
      return <SpImage src='tcode_icon.png' className='tcode-icon' lazyLoad={false} />
    }
  }

  const codePrefix = (value) => {
    if (value) {
      return <Text className='icon-yanzhengma'></Text>
    } else {
      return <SpImage src='vcode_icon.png' className='code-icon' lazyLoad={false} />
    }
  }

  const [time, startTime] = useTimer()

  const handleGetCode = async () => {
    if (!validate.isRequired(form.tcode)) {
      showToast('请输图形验证码')
      return
    }
    if (time !== null) {
      // showToast('验证码已发送，请稍后')
      return
    }
    if (!validate.isMobileNum(form.mobile)) {
      showToast('请输入正确的手机号')
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
      showToast('发送成功')
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
      showToast('请先输入手机号')
      return
    }
    if (!validate.isMobileNum(form.mobile)) {
      showToast('请输入正确的手机号')
      return
    }
    if (!validate.isRequired(form.tcode)) {
      showToast('请先输入图形验证码')
      return
    }
    if (!validate.isRequired(form.vcode)) {
      showToast('请先输入手机验证码')
      return
    }
    if (!agree) {
      showToast('请先认真阅读并同意入驻协议')
      return
    }
    try {
      const { token } = await api.merchant.login({ mobile: form.mobile, vcode: form.vcode })
      if (token) {
        S.setAuthToken(token)

        const { step } = await api.merchant.getStep()
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
      {time === null ? '获取验证码' : time}
    </View>
  )

  return (
    <SpPage className={classNames('page-merchant-login')} needNavbar={false}>
      <SpImage src='black.png' />
      <View className='page-merchant-login-content'>
        <MInput prefix={phonePrefix} placeholder='请输入手机号' onChange={handleChange('mobile')} />
        <MInput
          prefix={tcodePrefix}
          placeholder='请输入图形验证码'
          className='mt-32'
          onChange={handleChange('tcode')}
          suffix={tcodeSuffix}
        />
        <MInput
          prefix={codePrefix}
          placeholder='请输入手机验证码'
          className='mt-32'
          onChange={handleChange('vcode')}
          suffix={codeSuffix}
        />
        <MButton className={classNames('mt-52', 'login-button')} onClick={handleLogin}>
          登录/入驻
        </MButton>
        <View className='mt-32 view-flex view-flex-center view-flex-middle'>
          <MRadio checked={agree} onClick={() => setAgree(!agree)} />
          <View className='ml-16 radio-text'>
            阅读并同意
            <Text className='primary-color' onClick={navigateToAgreement}>
              《入驻协议》
            </Text>
          </View>
        </View>
      </View>
    </SpPage>
  )
}

export default Login
