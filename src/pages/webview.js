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
import React, { useEffect, useState, useCallback } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { View, WebView } from '@tarojs/components'

const initialState = {}
function WebviewIndex() {
  const $instance = getCurrentInstance()
  const { url } = $instance.router?.params
  const webviewSrc = decodeURIComponent(url)

  return (
    <View className='page-webview-index'>
      <WebView src={webviewSrc}></WebView>
    </View>
  )
}

export default WebviewIndex
