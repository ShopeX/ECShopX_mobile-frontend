import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { SpPage, SpLoading } from '@/components'
import { classNames } from '@/utils'
import api from '@/api'
import { setTokenAndRedirect } from './util'
import './auth-loading.scss'

const AuthLoading = () => {
  const $instance = getCurrentInstance()
  const {
    params: { code, redi_url }
  } = $instance.router

  const getIsNew = async () => {
    const {
      token,
      is_new,
      pre_login_data: { unionid }
    } = await api.wx.newloginh5({ code, auth_type: 'h5app', api_from: 'h5app' })
    let url = ''
    //如果是新用户
    if (is_new === 1) {
      url = `/subpage/pages/auth/bindPhone?unionid=${unionid}&redi_url=${redi_url}`
      Taro.redirectTo({
        url
      })
    } else {
      setTokenAndRedirect(token)
    }
  }

  useEffect(() => {
    getIsNew()
  }, [])

  return (
    <SpPage className={classNames('page-auth-loading')}>
      <SpLoading>加载中...</SpLoading>
    </SpPage>
  )
}

export default AuthLoading
