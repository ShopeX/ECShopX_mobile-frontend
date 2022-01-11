import React, { useEffect } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { SpPage, SpLoading } from '@/components'
import { classNames } from '@/utils'
import S from '@/spx'
import api from '@/api'
import './auth-loading.scss'

const AuthLoading = () => {
  const $instance = getCurrentInstance()
  const router = $instance.router

  const getIsNew = async () => {
    const {
      token,
      is_new,
      pre_login_data: { unionid }
    } = await api.wx.newloginh5({ code: router.params.code })
    let url = ''
    //如果是新用户
    if (is_new === 1) {
      url = `/subpage/pages/auth/bindPhone?unionid=${unionid}`
      Taro.redirectTo({
        url
      })
    } else {
      if (token) {
        S.setAuthToken(token)
        const { redi_url } = router.params
        const url = redi_url ? decodeURIComponent(redi_url) : process.env.APP_HOME_PAGE

        Taro.redirectTo({
          url
        })
      }
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
