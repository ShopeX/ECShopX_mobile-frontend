import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { WebView } from '@tarojs/components'
import qs from 'qs'
import { log } from '@/utils'

import S from '@/spx'

const Index = () => {
  const { openid, unionid, app_id, app_type, company_id } = S.get('DIANWU_CONFIG', true)

  // const { appid,company_id }=getExtConfigData();

  const URL = `${process.env.APP_DIANWU_URL}?${qs.stringify({
    in_shop_wechat: true,
    openid,
    unionid,
    app_id,
    company_id,
    app_type
  })}`
  log.debug(`dianwu url:`, URL)

  const onMessage = (e) => {
    debugger
  }

  return <WebView src={URL} onMessage={onMessage} />
}

export default Index
