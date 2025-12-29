/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
