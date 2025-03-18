import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { useLogin, useModal } from '@/hooks'
import { classNames, showToast, VERSION_IN_PURCHASE, getDistributorId } from '@/utils'
import qs from 'qs'
import { SpForm, SpFormItem, SpPage, SpInput as AtInput, SpPrivacyModal } from '@/components'
import { updateEnterpriseId } from '@/store/slices/purchase'
import CompBottomTip from './comps/comp-bottomTip'
import CompSelectCompany from './comps/comp-select-company'
import './select-company-account.scss'
import { useDispatch } from 'react-redux'

function PurchaseAuthAccount() {
  const { isNewUser, login } = useLogin({
    autoLogin: true,
    policyUpdateHook: (isUpdate) => {
      isUpdate && setPolicyModal(true)
    }
  })
  const [policyModal, setPolicyModal] = useState(false)
  const [state, setState] = useImmer({
    form: {
      account: '',
      auth_code: ''
    },
    rules: {
      account: [{ required: true, message: '账号不能为空' }],
      auth_code: [{ required: true, message: '请输入登录密码' }]
    },
    isOpened: false,
    companyList: [],
    curActiveIndex: undefined
  })
  const formRef = useRef()
  const { form, rules, isOpened, companyList, curActiveIndex } = state
  const { params } = useRouter()
  const { enterprise_id, enterprise_name, enterprise_sn } = params
  const { showModal } = useModal()
  const dispatch = useDispatch()

  const onInputChange = (key, value) => {
    setState((draft) => {
      draft.form[key] = value
    })
  }

  const onFormSubmit = async () => {
    await formRef.current.onSubmitAsync()
    const { account, auth_code } = form
    // // 无商城逻辑（需要调整一个页面去授权手机号）
    // if (isNewUser) {
    //   Taro.navigateTo({
    //     url: `/subpages/purchase/select-company-phone?${qs.stringify({
    //       enterprise_sn,
    //       enterprise_name,
    //       enterprise_id,
    //       account,
    //       auth_code
    //     })}`
    //   })
    //   return
    // }
    const _params = {
      enterprise_id,
      account,
      auth_code,
      auth_type: 'account'
    }

    const { list } = await api.purchase.employeeCheck({..._params,distributor_id: getDistributorId()})
    if (list.length > 1) {
      //选择企业
      setState((draft) => {
        draft.isOpened = true
        draft.companyList = list
      })
      return
    }
    _params.enterprise_id = list[0]?.enterprise_id
    _params.employee_id = list[0]?.id
    _params.enterprise_name = list[0]?.enterprise_name

    employeeAuth(_params)
  }

  const handleSelctCompany = async () => {
    const { account, auth_code } = form
    const { enterprise_id: _enterprise_id, id: employee_id,enterprise_name:_enterprise_name } = companyList[curActiveIndex] || {}
    const _params = {
      enterprise_id: _enterprise_id,
      employee_id,
      account,
      auth_code,
      auth_type: 'account',
      enterprise_name:_enterprise_name,
    }
    employeeAuth(_params)
  }

  const employeeAuth = (_params) => {
    if (isNewUser) {
      //新用户需要跳到授权手机号页面
      Taro.navigateTo({
        url: `/subpages/purchase/select-company-phone?${qs.stringify({
          ..._params
        })}`
      })
    } else {
      employeeAuthFetch(_params)
    }
  }

  const employeeAuthFetch = async (_params) => {
    try {
      await api.purchase.setEmployeeAuth({..._params,showError:false})
      showToast('验证成功')
      dispatch(updateEnterpriseId(_params.enterprise_id))
      if (isOpened) {
        setState((draft) => {
          draft.isOpened = false
        })
      }
      setTimeout(() => {
        Taro.reLaunch({ url: `/pages/purchase/index` })
      }, 700)
    } catch (e) {
      if (e.message.indexOf('重复绑定') > -1) {
        dispatch(updateEnterpriseId(_params.enterprise_id))
        await showModal({
          title: '验证失败',
          content: e.message,
          showCancel: false,
          confirmText: '我知道了',
          contentAlign: 'center'
        })
        Taro.reLaunch({ url: `/pages/purchase/index` })
      } else {
        showToast(e.message)
      }
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
    <SpPage className='page-purchase-auth-account select-component'>
      <View className='select-component-title'>账号登录</View>
      <View className='select-component-prompt'>使用已注册账号密码进行验证</View>
      <View className='selecte-box'>
        <SpForm ref={formRef} className='login-form' formData={form} rules={rules}>
          <SpFormItem prop='account'>
            <AtInput
              placeholder='请输入完整登录账号'
              value={form.account}
              onChange={onInputChange.bind(this, 'account')}
              clear
              name='account'
              focus
            />
          </SpFormItem>
          <SpFormItem prop='auth_code'>
            <AtInput
              placeholder='请输入登录密码'
              value={form.auth_code}
              onChange={onInputChange.bind(this, 'auth_code')}
              name='auth_code'
              clear
              focus
            />
          </SpFormItem>
        </SpForm>
      </View>
      <View className='info'>
        <Text className='iconfont icon-info icon'></Text>
        <Text>如忘记密码，请联系企业管理员处理</Text>
      </View>

      <AtButton
        circle
        className='btns-staff'
        disabled={!(form.account || form.auth_code)}
        onClick={onFormSubmit}
      >
        验证
      </AtButton>
      <CompBottomTip />

      <CompSelectCompany
        isOpened={isOpened}
        list={companyList}
        curIndex={curActiveIndex}
        handleItemClick={(idx) => {
          setState((draft) => {
            draft.curActiveIndex = idx
          })
        }}
        onClose={() => {
          setState((draft) => {
            draft.isOpened = false
          })
        }}
        onConfirm={handleSelctCompany}
      />

      {/* 隐私协议 */}
      <SpPrivacyModal open={policyModal} onCancel={onRejectPolicy} onConfirm={onResolvePolicy} />
    </SpPage>
  )
}

PurchaseAuthAccount.options = {
  addGlobalClass: true
}

export default PurchaseAuthAccount

// 账号登录
