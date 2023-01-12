import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text} from '@tarojs/components'
import { SpLogin } from '@/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import S from '@/spx'
import { useLogin } from '@/hooks'
import { showToast, VERSION_IN_PURCHASE } from '@/utils'

import CompBottomTip from './comps/comp-bottomTip'
import './select-company-phone.scss'

const initialState = {
  login_code: ''
}

function SelectComponent(props) {
  const { setToken, isNewUser } = useLogin()
  const [state, setState] = useImmer(initialState)
  const { userInfo = {} } = useSelector((state) => state.user)
  const $instance = getCurrentInstance()
  const { enterprise_id, enterprise_name, auth_code, account, email, vcode } = $instance.router.params

  useDidShow(() => {
    getLoginCode()
  })

  const getLoginCode = async () => {
    const { code } = await Taro.login()
    setState(draft => {
      draft.login_code = code
    })
  }

  const handleBindPhone = async (e) => {
    const { encryptedData, iv, cloudID } = e.detail
    if (encryptedData && iv) {
      // const { phoneNumber } = await api.wx.decryptPhone({
      //   encryptedData,
      //   iv,
      //   code: state.login_code
      // })
      const params = {
        code: state.login_code,
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
      Taro.showToast({
        icon: 'success',
        title: '验证成功'
      })
      setTimeout(() => {
        Taro.reLaunch({ url: `/subpages/purchase/select-company-activity` })
      }, 2000)
    }
  }

  const validatePhone = async (params) => {
    try {
      await api.purchase.setEmployeeAuth({ ...params, showError: false })
      showToast('验证成功')
      setTimeout(() => {
        Taro.reLaunch({ url: `/subpages/purchase/select-company-activity` })
      }, 2000)
    } catch (e) {
      console.log(e)
      Taro.showModal({
        title: '验证失败',
        content: e,
        confirmColor:'#F4811F',
        showCancel: false,
        confirmText: '我知道了',
        success: () => {
          Taro.reLaunch({ url: `/subpages/purchase/select-company-activity` })
        }
      })
      getLoginCode()
    }
  }

  return (
    <View className='select-component'>
      <View className='select-component-title'>{enterprise_name}</View>
      <View className='select-component-prompt'>使用手机号进行验证</View>
      {!VERSION_IN_PURCHASE && // 有商场的到这个页面都已经登录成功不用区分是否是新用户
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
      {VERSION_IN_PURCHASE && isNewUser && // 无商场&新用户需要手机号授权登录（调new_login接口 不需要绑定）
        <AtButton
          openType='getPhoneNumber'
          onGetPhoneNumber={handleBindPhone}
          circle
          className='btns-phone'
          customStyle={{ marginTop: '50%' }}
        >
          微信授权登录
        </AtButton>
      }
      {VERSION_IN_PURCHASE && !isNewUser && // 无商场&老用户，直接调绑定接口
        <AtButton
          circle
          className='btns-phone'
          onClick={() => validatePhone({
            enterprise_id,
            mobile: 'member_mobile'
          })}
          customStyle={{ marginTop: '50%' }}
        >
          微信授权登录
        </AtButton>
      }
      <CompBottomTip />
    </View>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent

// 有商场和无商场 手机号授权登录