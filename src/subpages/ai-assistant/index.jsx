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
  }, [])

  // WebView 的 postMessage 事件处理（通过 onMessage 属性）
  const handleMessage = (e) => {
    const data = e.detail?.data
    if (!data) return

    // data 可能是数组或单个对象
    const messages = Array.isArray(data) ? data : [data]

    for (const msg of messages) {
      if (!msg || typeof msg !== 'object') continue

      // 关闭按钮点击
      if (msg.type === 'ai-assistant-widget-close') {
        Taro.navigateBack()
        return
      }

      // 导航到其他页面
      if (msg.type === 'AI_ASSISTANT_MINIPROGRAM_NAV') {
        const path = msg.path
        if (path) {
          const url = path.startsWith('/') ? path : `/${path}`
          Taro.navigateTo({ url }).catch(() => {
            Taro.switchTab({ url }).catch(() => {})
          })
        }
      }
    }
  }

  return (
    <View className='ai-iframe-page'>
      <WebView src={src} className='ai-iframe-webview' onMessage={handleMessage} />
    </View>
  )
}
