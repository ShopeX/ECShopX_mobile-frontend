/**
 * AI 助手 iframe 页面
 * 通过 iframe 加载嵌入页，保持域名不变
 */
import { View, WebView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { buildAiAssistantWebviewSrc } from '@/utils/ai-assistant-embed'
import './index.scss'

export default function AiAssistantIframe() {
  const [src, setSrc] = useState('')

  useEffect(() => {
    const fullSrc = buildAiAssistantWebviewSrc()
    if (fullSrc) {
      setSrc(fullSrc)
    } else {
      Taro.showToast({ title: '未配置嵌入页', icon: 'none' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }

    // 监听 iframe 发来的消息
    const handleMessage = (event) => {
      // iframe 通过 window.postMessage 发消息
      const data = event.data
      if (!data || typeof data !== 'object') return

      // 关闭按钮点击
      if (data.type === 'ai-assistant-widget-close') {
        Taro.navigateBack()
      }
      // 导航到其他页面
      if (data.type === 'AI_ASSISTANT_MINIPROGRAM_NAV') {
        const path = data.path
        if (path) {
          const url = path.startsWith('/') ? path : `/${path}`
          Taro.navigateTo({ url }).catch(() => {
            Taro.switchTab({ url }).catch(() => {})
          })
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleMessage)
      return () => {
        window.removeEventListener('message', handleMessage)
      }
    }
  }, [])

  return (
    <View className='ai-iframe-page'>
      <WebView src={src} className='ai-iframe-webview' />
    </View>
  )
}
