// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { SpPage, SpLoading } from '@/components'
import { classNames, tokenParseH5 } from '@/utils'
import api from '@/api'
import { useLogin } from '@/hooks'
import { setTokenAndRedirect, getToken } from './util'
import './auth-loading.scss'

const AuthLoading = () => {
  const $instance = getCurrentInstance()
  const {
    params: { code, redi_url }
  } = $instance.router

  const { getUserInfo } = useLogin()

  const getIsNew = async () => {
    const {
      token
      // is_new,
      // pre_login_data: { unionid }
    } = await api.wx.newloginh5({ code, auth_type: 'wx_offiaccount', api_from: 'h5app' })

    const { is_new, unionid } = tokenParseH5(token)

    let url = ''
    //如果是新用户
    if (is_new === 1) {
      url = `/subpages/auth/bindPhone?unionid=${unionid}&redi_url=${redi_url}`
      Taro.redirectTo({
        url
      })
    } else {
      setTokenAndRedirect(token, async () => {
        await getUserInfo()
      })
    }
  }

  useEffect(() => {
    let token = getToken()
    if (token) {
      setTokenAndRedirect(token)
      return
    }
    getIsNew()
  }, [])

  return (
    <SpPage className={classNames('page-auth-loading')}>
      <SpLoading>加载中...</SpLoading>
    </SpPage>
  )
}

export default AuthLoading
