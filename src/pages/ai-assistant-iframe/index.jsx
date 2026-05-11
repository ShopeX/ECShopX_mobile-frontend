/**
 * AI 助手 iframe 页面
 * 通过 iframe 加载嵌入页，保持域名不变
 */
import { View, WebView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect, useRef, useCallback } from 'react'
import { buildAiAssistantWebviewSrc, postAiAssistantAuthToEmbed } from '@/utils/ai-assistant-embed'
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
    const fullSrc = buildAiAssistantWebviewSrc()
    if (fullSrc) {
      setSrc(fullSrc)
    } else {
      Taro.showToast({ title: '未配置嵌入页', icon: 'none' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }

    const handleMessage = (event) => {
      const data = event.data
      if (!data || typeof data !== 'object') return

      if (data.type === 'ai-assistant-widget-close') {
        Taro.navigateBack()
      }
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

  useEffect(() => {
    if (!src) return undefined
    const timer = setInterval(syncAuthToEmbed, 800)
    Taro.eventCenter.on('ecshopx-auth-changed', syncAuthToEmbed)
    return () => {
      clearInterval(timer)
      Taro.eventCenter.off('ecshopx-auth-changed', syncAuthToEmbed)
    }
  }, [src, syncAuthToEmbed])

  return (
    <View className='ai-iframe-page'>
      <WebView ref={webviewRef} src={src} className='ai-iframe-webview' onLoad={syncAuthToEmbed} />
    </View>
  )
}
