/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
import { SpPage } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './index.scss'

function ChatIndex(props) {
  const { i18n } = useTranslation()
  const $instance = getCurrentInstance() || {}

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('e15eed5a.e7dea7') })
  }, [i18n.language])

  const { url } = $instance?.router?.params
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
