import React, { useEffect, useState, useCallback } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { View, WebView } from '@tarojs/components'

const initialState = {}
function WebviewIndex() {
  const $instance = getCurrentInstance()
  const { url } = $instance.router.params
  const webviewSrc = decodeURIComponent(url)

  return (
    <View className='page-webview-index'>
      <WebView src={webviewSrc}></WebView>
    </View>
  )
}

export default WebviewIndex
