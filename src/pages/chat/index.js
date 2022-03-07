import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
import { SpPage } from '@/components'
import './index.scss'

function ChatIndex (props) {
  const $instance = getCurrentInstance()

  const { url } = $instance.router.params
  const webviewSrc = decodeURIComponent(url)

  return (
    <SpPage className='chat-index'>
      <WebView src={webviewSrc}></WebView>
    </SpPage>
  )
}

ChatIndex.options = {
  addGlobalClass: true
}

export default ChatIndex
