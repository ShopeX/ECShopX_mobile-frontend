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
      {/* <View className='line'></View> */}
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
