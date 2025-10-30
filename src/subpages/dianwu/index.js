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
import React, { useEffect, Component } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { WebView } from '@tarojs/components'
import qs from 'qs'
import { log, entryLaunch } from '@/utils'
import S from '@/spx'

const initialState = {
  webviewSrc: ''
}
const Index = () => {
  const [state, setState] = useImmer(initialState)
  const { webviewSrc } = state
  useEffect(() => {
    createWebviewUrl()
    log.debug(`dianwu url:`, webviewSrc)
  }, [])

  // useDidShow(() => {
  //   log.debug(`dianwu useDidShow ${webviewSrc}`)
  //   createWebviewUrl()
  // })

  const createWebviewUrl = async () => {
    const { openid, unionid, app_id, app_type, company_id } = S.get('DIANWU_CONFIG', true)
    const token = S.getAuthToken()
    const routeParams = await entryLaunch.getRouteParams()
    const { path = '', ...queryParams } = routeParams

    // const url = `${process.env.APP_DIANWU_URL}?${qs.stringify({
    //   in_shop_wechat: true,
    //   openid,
    //   unionid,
    //   app_id,
    //   company_id,
    //   app_type
    // })}`
    const url = `${process.env.APP_DIANWU_URL}${path}?${qs.stringify({
      token,
      company_id,
      in_shop_wechat: true,
      ...queryParams
      // type:'alipay'
    })}`
    setState((draft) => {
      draft.webviewSrc = url
    })
    console.log('webviewSrc', url)
  }

  const handleTest = () => {
    log.debug(`handleTest.... ${webviewSrc}`)
  }

  const onMessage = (e) => {}

  return <WebView src={webviewSrc} onMessage={onMessage} />
}

export default Index
