import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { SpPage } from '@/components'
import { useLogin, useModal } from '@/hooks'
import { showToast, VERSION_IN_PURCHASE } from '@/utils'

import CompBottomTip from './comps/comp-bottomTip'
import './select-company-phone.scss'

const initialState = {
  wxCode: ''
}

function PurchaseAuthPhone(props) {
  const { setToken, isNewUser } = useLogin()
  const [state, setState] = useImmer(initialState)
  const { userInfo = {} } = useSelector((state) => state.user)
  const { params } = useRouter()
  const { enterprise_id, enterprise_name, auth_code, account, email, vcode } = params
  const { showModal } = useModal()

  useEffect(() => {
    getLoginCode()
  }, [])

  const getLoginCode = async () => {
    const { code } = await Taro.login()
    setState(draft => {
      draft.wxCode = code
    })
  }

  const handleBindPhone = async (e) => {
    const { encryptedData, iv, cloudID } = e.detail
    if (encryptedData && iv) {
      try {
        const params = {
          code: state.wxCode,
          encryptedData,
          iv,
          cloudID,
          user_type: 'wechat',
          auth_type: 'wxapp',
          employee_auth: {
            enterprise_id,
            account,
            auth_code,
            email,
            vcode
          }
        }
        const { token } = await api.wx.newlogin(params)
        setToken(token)
        showToast('验证成功')
        setTimeout(() => {
          Taro.reLaunch({ url: `/pages/purchase/index` })
        }, 700)
      } catch (e) {
        getLoginCode()
      }
    }
  }

  const validatePhone = async (params) => {
    try {
      await api.purchase.setEmployeeAuth({ ...params, showError: false })
      showToast('验证成功')
      setTimeout(() => {
        Taro.reLaunch({ url: `/pages/purchase/index` })
      }, 2000)
    } catch (e) {
      if (e.message.indexOf('重复绑定') > -1) {
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
      getLoginCode()
    }
  }

  return (
    <SpPage className='page-purchase-auth-phone select-component'>
      <View className='select-component-title'>{enterprise_name}</View>
      <View className='select-component-prompt'>使用手机号进行验证</View>
      {!VERSION_IN_PURCHASE && // 有商城的到这个页面都已经登录成功不用区分是否是新用户
        <>
          <View className='phone-box'>
            <Text>已授权手机号：</Text>
            <Text className='phone-number'>{userInfo?.mobile}</Text>
          </View>
          <AtButton circle className='btns-phone' onClick={() => validatePhone({
            enterprise_id,
            mobile: 'member_mobile'
          })}>
            使用该号码验证
          </AtButton>
          <AtButton circle className='btns-other' openType='getPhoneNumber' onGetPhoneNumber={handleBindPhone} >
            其他手机号码验证
          </AtButton>
        </>
      }
      {VERSION_IN_PURCHASE && isNewUser && // 无商城&新用户需要手机号授权登录（调new_login接口 不需要绑定）
        <AtButton
          openType='getPhoneNumber'
          onGetPhoneNumber={handleBindPhone}
          circle
          className='btns-phone'
          customStyle={{ marginTop: '50%' }}
        >
          手机号授权登录
        </AtButton>
      }
      {VERSION_IN_PURCHASE && !isNewUser && // 无商城&老用户，直接调绑定接口
        <AtButton
          circle
          className='btns-phone'
          onClick={() => validatePhone({
            enterprise_id,
            mobile: 'member_mobile'
          })}
          customStyle={{ marginTop: '50%' }}
        >
          手机号授权登录
        </AtButton>
      }
      <CompBottomTip />
    </SpPage>
  )
}

PurchaseAuthPhone.options = {
  addGlobalClass: true
}

export default PurchaseAuthPhone

// 有商城和无商城 手机号授权登录
