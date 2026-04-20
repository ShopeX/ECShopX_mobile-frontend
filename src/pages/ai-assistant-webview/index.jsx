/**
 * 微信小程序专用：独立页 web-view 加载 ai-assistant-embed（layout=page 时直接进入全屏聊天，无再点漂浮钮）。
 * 底部保留快捷入口，与商城 Tab 一致，便于回首页/购物车等。构建：npm run build:weapp，并 sync-ai-embed。
 */
import Taro from '@tarojs/taro'
import { View, WebView, Text } from '@tarojs/components'
import React, { useCallback, useEffect, useState } from 'react'
import { isWeixin } from '@/utils'
import { TABBAR_PATH } from '@/consts'
import {
  buildAiEmbedPageUrl,
  buildAiAssistantWebviewSrc,
  handleAiAssistantWebviewMessage,
  handleAiAssistantWebviewError
} from '@/utils/ai-assistant-embed'
import './index.scss'

const DOCK_ITEMS = () => {
  const p = TABBAR_PATH()
  return [
    { key: 'home', label: '首页', icon: 'icon-shouye', path: p.home },
    { key: 'category', label: '分类', icon: 'icon-fenlei', path: p.category },
    { key: 'cart', label: '购物车', icon: 'icon-gwche', path: p.cart },
    { key: 'member', label: '我的', icon: 'icon-huiyuan', path: p.member }
  ]
}

export default function AiAssistantWebview() {
  const [src, setSrc] = useState('')

  const goMallPage = useCallback((url) => {
    if (!url) return
    Promise.resolve(Taro.redirectTo({ url })).catch(() => {
      Promise.resolve(Taro.reLaunch({ url })).catch(() => {})
    })
  }, [])

  useEffect(() => {
    const base = buildAiEmbedPageUrl()
    if (!base) {
      Taro.showToast({
        title:
          '未配置嵌入页（请设 APP_AI_BASE_URL 或 APP_AI_EMBED_PAGE_URL 或 APP_CUSTOM_SERVER / APP_BASE_URL）',
        icon: 'none'
      })
      setTimeout(() => {
        Promise.resolve(Taro.navigateBack()).catch(() => {})
      }, 2200)
      return
    }

    const allowHttpEmbed =
      String(process.env.APP_AI_WEBVIEW_ALLOW_HTTP || '').trim() === '1' ||
      String(process.env.APP_AI_WEBVIEW_ALLOW_HTTP || '').toLowerCase() === 'true'
    if (isWeixin && !/^https:\/\//i.test(base) && !allowHttpEmbed) {
      Taro.showModal({
        title: '配置提示',
        content:
          '当前嵌入页为 http。小程序 web-view 需 https，或在 .env 设置 APP_AI_WEBVIEW_ALLOW_HTTP=1 后重新编译（仅开发联调）；并勾选开发者工具「不校验合法域名」。',
        showCancel: false,
        success: () => {
          Promise.resolve(Taro.navigateBack()).catch(() => {})
        }
      })
      return
    }

    const full = buildAiAssistantWebviewSrc()
    if (full) setSrc(full)
  }, [])

  if (!src) {
    return <View style={{ padding: 24, textAlign: 'center' }}>加载中…</View>
  }

  const dock = DOCK_ITEMS()

  return (
    <View className='ai-assistant-webview-page'>
      <View className='ai-assistant-webview-webview-wrap'>
        <WebView
          src={src}
          onMessage={handleAiAssistantWebviewMessage}
          onError={handleAiAssistantWebviewError}
        />
      </View>
      <View className='ai-assistant-webview-dock'>
        {dock.map((item) => (
          <View
            key={item.key}
            className='ai-assistant-webview-dock__item'
            onClick={() => goMallPage(item.path)}
          >
            <Text className={`iconfont icon ${item.icon} ai-assistant-webview-dock__icon`} />
            <Text className='ai-assistant-webview-dock__label'>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
