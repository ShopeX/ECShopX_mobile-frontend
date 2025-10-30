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
import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { isWxWeb } from '@/utils'
import api from '@/api'
import './comp-otherlogin.scss'

const CompOtherLogin = () => {
  const handleClickWexin = async () => {
    const $instance = getCurrentInstance()
    //跳转
    const { redirect = '' } = $instance.router.params
    const redirectUrl =
      !!redirect && redirect !== 'undefined' ? redirect : process.env.APP_HOME_PAGE
    let { oauth_url = '' } = await api.wx.getWxAuth({
      redirect_url: redirectUrl,
      trustlogin_tag: 'weixin',
      version_tag: 'touch'
    })
    if (oauth_url) {
      window.location.replace(oauth_url)
    }
  }

  if (!isWxWeb) {
    return null
  }

  return (
    <View className='comp-other-login'>
      <View className='text'>其它方式登录</View>
      <View className='loginway'>
        <View className='wechat' onClick={handleClickWexin}>
          <Text className='iconfont icon-weixin'></Text>
        </View>
      </View>
    </View>
  )
}

CompOtherLogin.options = {
  addGlobalClass: true
}

export default CompOtherLogin
