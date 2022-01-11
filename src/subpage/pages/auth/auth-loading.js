import React, { useEffect } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { SpPage, SpLoading } from '@/components'
import { classNames } from '@/utils'
import api from '@/api'
import './auth-loading.scss'

const AuthLoading = () => {
  const $instance = getCurrentInstance()
  const router = $instance.router

  const getIsNew = async () => {
    const { token, is_new } = await api.wx.newloginh5({ code: router.params.code })
    console.log('===token===>', token, is_new)
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
