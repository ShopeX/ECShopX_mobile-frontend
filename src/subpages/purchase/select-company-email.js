import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useSelector, useDispatch } from 'react-redux'
import { useLogin, useModal } from '@/hooks'
import api from '@/api'
import { classNames, showToast, VERSION_IN_PURCHASE, getDistributorId, isWeb } from '@/utils'
import qs from 'qs'

import { updateEnterpriseId, updateCurDistributorId } from '@/store/slices/purchase'
import {
  SpForm,
  SpFormItem,
  SpTimer,
  SpPage,
  SpPrivacyModal,
  SpInput as AtInput
} from '@/components'

import CompBottomTip from './comps/comp-bottomTip'
import './select-company-email.scss'

function PurchaseAuthEmail(props) {
  const router = useRouter()
  const { isNewUser, login } = useLogin({
    autoLogin: true,
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })
  const [policyModal, setPolicyModal] = useState(false)
  const { showModal } = useModal()
  const dispatch = useDispatch()

  const [state, setState] = useImmer({
    form: {
      email: '',
      vcode: ''
    },
    rules: {
      email: [
        { required: true, message: '邮箱地址不能为空' },
        { validate: 'email', message: '请输入正确的邮箱' },
        {
          validate: async (value) => {
            const { enterprise_id } = router.params
            try {
              const params = {
                email: value
              }
              if (!enterprise_id) {
                //不是扫码进来，接口要传当前店铺ID
                params.distributor_id = getDistributorId()
              }
              const { status } = await api.purchase.getEmailCode(params)
              showToast(status ? '发送成功' : '发送失败')
            } catch (error) {
              return Promise.reject(error.message)
            }
          }
        }
      ],
      vcode: [{ required: true, message: '请输入验证码' }]
    }
  })
  const { form, rules } = state
  const formRef = useRef()
  const {
    enterprise_id,
    enterprise_name,
    enterprise_sn,
    activity_id,
    is_activity = ''
  } = router.params

  const onInputChange = (key, value) => {
    setState((draft) => {
      draft.form[key] = value
    })
  }

  const onFormSubmit = async () => {
    // 有商城校验白名单，账号绑定并登录，无商城检验白名单通过手机号授权
    const { email, vcode } = form
    await formRef.current.onSubmitAsync(['vcode'])
    // if (isNewUser) {
    //   // 无商城逻辑（需要调整一个页面去授权手机号）
    //   Taro.navigateTo({
    //     url: `/subpages/purchase/select-company-phone?${qs.stringify({
    //       enterprise_sn,
    //       enterprise_name,
    //       enterprise_id,
    //       email,
    //       vcode
    //     })}`
    //   })
    //   return
    // }

    const params = {
      enterprise_id,
      email,
      vcode,
      showError: false,
      auth_type: 'email'
    }

    try {
      const checkParams = { ...params }
      if (!enterprise_id) {
        //不是扫码进来，check接口要传当前店铺ID
        checkParams.distributor_id = getDistributorId()
      }
      if (activity_id) {
        checkParams.activity_id = activity_id
      }
      const { list } = await api.purchase.employeeCheck(checkParams)
      //一个邮箱后缀只有一个企业
      params.enterprise_id = list[0].enterprise_id

      if (isNewUser && !isWeb) {
        Taro.navigateTo({
          url: `/subpages/purchase/select-company-phone?${qs.stringify({
            ...params,
            enterprise_name: list[0].enterprise_name
          })}`
        })
        return
      }

      await api.purchase.setEmployeeAuth(params)
      await getQrCodeDtid()
      dispatch(updateEnterpriseId(params.enterprise_id))
      showToast('验证成功')

      setTimeout(() => {
        Taro.reLaunch({
          url: `/pages/purchase/index?is_redirt=1${
            is_activity && activity_id ? `&activity_id=${activity_id}` : ''
          }`
        })
      }, 700)
    } catch (e) {
      if (e.message.indexOf('重复绑定') > -1) {
        dispatch(updateEnterpriseId(params.enterprise_id))
        await getQrCodeDtid()
        await showModal({
          title: '验证失败',
          content: e.message,
          showCancel: false,
          confirmText: '我知道了',
          contentAlign: 'center'
        })
        Taro.reLaunch({
          url: `/pages/purchase/index?is_redirt=1${
            is_activity && activity_id ? `&activity_id=${activity_id}` : ''
          }`
        })
      } else {
        formRef.current.setMessage({ prop: 'vcode', message: e.message })
      }
    }
  }

  const getQrCodeDtid = async () => {
    if (!enterprise_id) return
    // 如果扫码进来存在企业ID则需要绑定拿到店铺ID
    const { distributor_id } = await api.purchase.getPurchaseDistributor({ enterprise_id })
    //后续身份切换需要用
    dispatch(updateCurDistributorId(distributor_id))
  }

  // 获取验证码
  const getSmsCode = async (resolve) => {
    try {
      await formRef.current.onSubmitAsync(['email'])
      resolve()
    } catch (error) {
      console.log(error)
    }
  }

  // 同意隐私协议
  const onResolvePolicy = async () => {
    setPolicyModal(false)
    if (!isNewUser) {
      await login()
    }
  }

  const onRejectPolicy = () => {
    Taro.exitMiniProgram()
  }

  return (
    <SpPage className='page-purchase-auth-email select-component'>
      <View className='select-component-title'>企业邮箱登录</View>
      <View className='select-component-prompt'>使用企业邮箱登录验证</View>
      <View className='selecte-box'>
        <SpForm ref={formRef} className='login-form' formData={form} rules={rules}>
          <SpFormItem prop='email'>
            <AtInput
              clear
              focus
              name='email'
              value={form.email}
              className='email-input'
              placeholder='请输入邮箱账号'
              onChange={onInputChange.bind(this, 'email')}
            />
          </SpFormItem>

          <SpFormItem prop='vcode'>
            <View className='code-box'>
              <AtInput
                clear
                focus
                name='vcode'
                className='code-box-input'
                value={form.vcode}
                placeholder='请输入验证码'
                onChange={onInputChange.bind(this, 'vcode')}
              />
              <SpTimer
                className={classNames({ 'unuse': !form.email })}
                onStart={getSmsCode}
                onStop={() => {}}
                defaultMsg='获取验证码'
                msg='重新获取'
              ></SpTimer>
            </View>
          </SpFormItem>
        </SpForm>
      </View>

      <AtButton
        circle
        className='btns-staff'
        disabled={!(form.email && form.vcode)}
        onClick={onFormSubmit}
      >
        登录
      </AtButton>
      <CompBottomTip />

      {/* 隐私协议 */}
      <SpPrivacyModal open={policyModal} onCancel={onRejectPolicy} onConfirm={onResolvePolicy} />
    </SpPage>
  )
}

PurchaseAuthEmail.options = {
  addGlobalClass: true
}

export default PurchaseAuthEmail

// 邮箱登录
