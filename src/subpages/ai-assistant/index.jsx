/**
 * AI 助手全屏 WebView 页（分包 subpages/ai-assistant/index）
 * 加载嵌入页 URL，与 FAB 跳转路径一致
 */
import { View, WebView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect, useRef, useCallback } from 'react'
import { buildAiAssistantWebviewSrc, postAiAssistantAuthToEmbed } from '@/utils/ai-assistant-embed'
import { isWeb } from '@/utils'
import './index.scss'

export default function AiAssistantIframe() {
  const [src, setSrc] = useState('')
  const webviewRef = useRef(null)

  const syncAuthToEmbed = useCallback(() => {
    const frame = webviewRef.current
    const targetWindow = frame?.contentWindow || frame?.iframe?.contentWindow
    if (!targetWindow || !src) return
    try {
      postAiAssistantAuthToEmbed(targetWindow, new URL(src).origin)
    } catch {
      /* ignore */
    }
  }, [src])

  useEffect(() => {
    // H5 环境：添加全局 message 监听器
    const handleGlobalMessage = (e) => {
      const data = e.data
      if (!data) return

      if (data.type === 'ai-assistant-widget-close') {
        Taro.navigateBack().catch(() => {})
        return
      }

      if (data.type === 'AI_ASSISTANT_MINIPROGRAM_NAV' && data.path) {
        const url = data.path.startsWith('/') ? data.path : '/' + data.path
        Taro.navigateTo({ url }).catch(() => {
          Taro.switchTab({ url }).catch(() => {})
        })
      }
    }

    if (typeof window !== 'undefined' && isWeb) {
      window.addEventListener('message', handleGlobalMessage)
    }

    return () => {
      if (typeof window !== 'undefined' && isWeb) {
        window.removeEventListener('message', handleGlobalMessage)
      }
    }
  }, [])

  useEffect(() => {
    const fullSrc = buildAiAssistantWebviewSrc()
    if (fullSrc) {
      try {
        const u = new URL(fullSrc)
        u.searchParams.set('timestamp', String(Date.now()))
        setSrc(u.href)
      } catch {
        const sep = fullSrc.includes('?') ? '&' : '?'
        setSrc(`${fullSrc}${sep}timestamp=${Date.now()}`)
      }
    } else {
      Taro.showToast({ title: '未配置嵌入页', icon: 'none' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }
  }, [])

  useEffect(() => {
    if (!src || typeof window === 'undefined' || !isWeb) return undefined
    const timer = setInterval(syncAuthToEmbed, 800)
    Taro.eventCenter.on('ecshopx-auth-changed', syncAuthToEmbed)
    return () => {
      clearInterval(timer)
      Taro.eventCenter.off('ecshopx-auth-changed', syncAuthToEmbed)
    }
  }, [src, syncAuthToEmbed])

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

  console.log('src', src)

  return (
    <View className='ai-iframe-page'>
      <WebView
        ref={webviewRef}
        src={src}
        className='ai-iframe-webview'
        onLoad={syncAuthToEmbed}
        onMessage={handleMessage}
      />
    </View>
  )
}
