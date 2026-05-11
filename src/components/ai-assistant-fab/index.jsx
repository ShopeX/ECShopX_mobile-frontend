/**
 * AI 助手悬浮按钮
 * H5 和小程序统一行为：点击按钮跳转到嵌入页面（通过 iframe 或 WebView 加载远程部署的 AI 助手）
 */
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import S from '@/spx'
import { SG_TOKEN } from '@/consts/localstorage'
import { isWeb, isWeixin, getDistributorId } from '@/utils'
import { buildAiEmbedPageUrl } from '@/utils/ai-assistant-embed'
import './index.scss'

const base = (process.env.APP_BASE_URL || '').replace(/\/?$/, '/')
const AI_BASE_RAW = process.env.APP_AI_BASE_URL
const AI_BASE =
  AI_BASE_RAW != null && String(AI_BASE_RAW).trim()
    ? String(AI_BASE_RAW).trim().replace(/\/+$/, '')
    : ''
const ASSISTANT_BACKEND_URL = (
  process.env.APP_AI_ASSISTANT_BACKEND_URL ||
  AI_BASE ||
  'http://localhost:9020'
).replace(/\/$/, '')

const FAB_PX = 52
const FAB_PAD = 8
const FAB_POS_STORAGE = 'ai_assistant_fab_pos_v1'
const EDGE_SNAP_THRESHOLD = 30 // 距离边缘超过此值才吸附，否则保持当前位置
const MOVE_PX_TO_DRAG = 5 // 移动超过此值才识别为拖拽（原值 16 太大，导致跟手慢）

function clampFabPos(left, bottom, sys) {
  if (!sys) return { left, bottom }
  const w = sys.windowWidth
  const h = sys.windowHeight
  const safeB = sys.safeAreaInsets?.bottom || 0
  const tabBarExtra = 52
  const minL = FAB_PAD
  const maxL = w - FAB_PX - FAB_PAD
  const minB = safeB + FAB_PAD + tabBarExtra
  const maxB = h - FAB_PX - FAB_PAD
  return {
    left: Math.min(maxL, Math.max(minL, left)),
    bottom: Math.min(maxB, Math.max(minB, bottom))
  }
}

/** 吸附到最近的左或右边缘 */
function snapToEdge(left, bottom, sys) {
  if (!sys) return { left, bottom }
  const w = sys.windowWidth
  const centerX = left + FAB_PX / 2
  const halfScreen = w / 2
  const edgeLeft = FAB_PAD
  // 右边距和左边一样
  const edgeRight = FAB_PAD

  let newLeft
  if (centerX < halfScreen) {
    // 屏幕左半边：吸附到左边
    newLeft = edgeLeft
  } else {
    // 屏幕右半边：吸附到右边（和左边一样的边距）
    newLeft = w - FAB_PX - edgeRight
  }

  // 如果当前位置离目标边缘很近，保持原位置
  if (Math.abs(left - newLeft) < EDGE_SNAP_THRESHOLD) {
    newLeft = left
  }

  return { left: newLeft, bottom }
}

function buildWeappFabAvatarUrl(backendRoot, tenantId, code) {
  const root = String(backendRoot || '').replace(/\/$/, '')
  if (!root || !code) return ''
  const q = new URLSearchParams()
  q.set('code', code)
  q.set('slot', 'icon')
  if (tenantId) q.set('tenant_id', String(tenantId))
  return `${root}/api/widget/avatar-asset?${q.toString()}`
}

function readInitialFabPos() {
  try {
    const sys = Taro.getSystemInfoSync()
    const w = sys.windowWidth
    const safeB = sys.safeAreaInsets?.bottom || 0
    return clampFabPos(w - FAB_PX - 12, 100 + safeB, sys)
  } catch {
    return { left: 12, bottom: 120 }
  }
}

function useHideAssistantFabOnFullPage(enabled) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined

    const isAssistantWebviewPage = () => {
      if (typeof window !== 'undefined' && isWeb) {
        const hash = (window.location.hash || '').replace(/^#\/?/, '')
        const path = window.location.pathname || ''
        return `${path} ${hash}`.includes('ai-assistant-webview') ||
               `${path} ${hash}`.includes('ai-assistant')
      }
      try {
        const pages = Taro.getCurrentPages()
        const route = pages[pages.length - 1]?.route || ''
        return route.includes('ai-assistant-webview') ||
               route.includes('ai-assistant')
      } catch {
        return false
      }
    }

    const tick = () => setHidden(isAssistantWebviewPage())
    tick()
    const interval = setInterval(tick, 350)

    if (typeof window !== 'undefined' && isWeb) {
      window.addEventListener('popstate', tick)
      window.addEventListener('hashchange', tick)
      return () => {
        clearInterval(interval)
        window.removeEventListener('popstate', tick)
        window.removeEventListener('hashchange', tick)
      }
    }

    return () => clearInterval(interval)
  }, [enabled])

  return hidden
}

function goLoginForAssistant() {
  const authPage = process.env.APP_AUTH_PAGE || '/subpages/auth/login'
  let redirect = '/pages/index'
  if (typeof window !== 'undefined') {
    redirect = `${window.location.pathname || ''}${window.location.search || ''}` || redirect
  }
  const sep = authPage.includes('?') ? '&' : '?'
  const url = `${authPage}${sep}redirect=${encodeURIComponent(redirect)}`
  Promise.resolve(Taro.navigateTo({ url })).catch(() => {
    Promise.resolve(Taro.redirectTo({ url })).catch(() => { })
  })
}

function AiAssistantFabButton() {
  const [fabIconUrl, setFabIconUrl] = useState('')
  const [fabBuiltinEmoji, setFabBuiltinEmoji] = useState('')
  const [fabPos, setFabPos] = useState(readInitialFabPos)

  const fabPosRef = useRef(fabPos)
  const sysRef = useRef(null)
  const suppressTapRef = useRef(false)
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    origLeft: 0,
    origBottom: 0
  })

  useEffect(() => {
    fabPosRef.current = fabPos
  }, [fabPos])

  useEffect(() => {
    const sys = Taro.getSystemInfoSync()
    sysRef.current = sys
    try {
      const saved = Taro.getStorageSync(FAB_POS_STORAGE)
      if (saved && typeof saved.left === 'number' && typeof saved.bottom === 'number') {
        const c = clampFabPos(saved.left, saved.bottom, sys)
        setFabPos(c)
        fabPosRef.current = c
      }
    } catch (_) { }
  }, [])

  useEffect(() => {
    const backend = ASSISTANT_BACKEND_URL
    const tid =
      process.env.APP_AI_TENANT_ID != null && process.env.APP_AI_TENANT_ID !== ''
        ? String(process.env.APP_AI_TENANT_ID)
        : ''
    const q = tid ? `?tenant_id=${encodeURIComponent(tid)}` : ''
    Taro.request({
      url: `${backend}/api/widget/embed-config${q}`,
      method: 'GET',
      header: { Accept: 'application/json' }
    })
      .then((res) => {
        const status = res.statusCode
        if (status < 200 || status >= 300) return
        const body = res.data || {}
        const d = body.data || {}
        const raw = d.default_avatar != null ? d.default_avatar : d.defaultAvatar
        const code = raw != null ? String(raw).trim().toLowerCase() : 'fox'
        if (!code) return
        const BUILTIN_AVATAR_CODES = new Set(['fox', 'robot', 'cat'])
        const BUILTIN_FAB_EMOJI = { fox: '🦊', robot: '🤖', cat: '🐱' }
        if (BUILTIN_AVATAR_CODES.has(code)) {
          setFabBuiltinEmoji(BUILTIN_FAB_EMOJI[code] || '')
          setFabIconUrl('')
        } else {
          setFabBuiltinEmoji('')
          setFabIconUrl(buildWeappFabAvatarUrl(backend, tid, code))
        }
      })
      .catch(() => { })
  }, [])

  const lastOpenAtRef = useRef(0)

  const navigateToAssistantPage = useCallback(() => {
    const now = Date.now()
    if (now - lastOpenAtRef.current < 480) return
    lastOpenAtRef.current = now

    const base = buildAiEmbedPageUrl()
    if (!base) {
      Taro.showToast({
        title: '未配置嵌入页（请设 APP_AI_BASE_URL 或 APP_AI_EMBED_PAGE_URL）',
        icon: 'none'
      })
      return
    }

    const allowHttpEmbed =
      String(process.env.APP_AI_WEBVIEW_ALLOW_HTTP || '').trim() === '1' ||
      String(process.env.APP_AI_WEBVIEW_ALLOW_HTTP || '').toLowerCase() === 'true'
    if (isWeixin && !/^https:\/\//i.test(base) && !allowHttpEmbed) {
      Taro.showModal({
        title: '配置提示',
        content:
          '嵌入页为 http 时需在 .env 设置 APP_AI_WEBVIEW_ALLOW_HTTP=1 后重编；正式环境请使用 https。',
        showCancel: false
      })
      return
    }

    // H5 和小程序统一跳转到嵌入页面
    if (isWeixin) {
      // 小程序：跳转到 WebView 页面
      Promise.resolve(Taro.navigateTo({ url: '/pages/ai-assistant-webview/index' })).catch(() => {
        Taro.showToast({ title: '无法打开助手', icon: 'none' })
      })
    } else {
      // H5：跳转到 iframe 页面
      Promise.resolve(Taro.navigateTo({ url: '/pages/ai-assistant/index' })).catch(() => {
        Taro.showToast({ title: '无法打开助手', icon: 'none' })
      })
    }
  }, [])

  const onFabTap = useCallback(() => {
    if (suppressTapRef.current) return
    navigateToAssistantPage()
  }, [navigateToAssistantPage])

  const onFabTouchStart = useCallback((e) => {
    const t = e.touches[0]
    const p = fabPosRef.current
    dragRef.current = {
      active: true,
      moved: false,
      startX: t.clientX,
      startY: t.clientY,
      origLeft: p.left,
      origBottom: p.bottom
    }
  }, [])

  const onFabTouchMove = useCallback((e) => {
    if (!dragRef.current.active || !sysRef.current) return
    const t = e.touches[0]
    const dx = t.clientX - dragRef.current.startX
    const dy = t.clientY - dragRef.current.startY
    if (Math.abs(dx) > MOVE_PX_TO_DRAG || Math.abs(dy) > MOVE_PX_TO_DRAG) {
      dragRef.current.moved = true
    }
    const nextLeft = dragRef.current.origLeft + dx
    const nextBottom = dragRef.current.origBottom - dy
    const c = clampFabPos(nextLeft, nextBottom, sysRef.current)
    setFabPos(c)
    fabPosRef.current = c
  }, [])

  const onFabTouchEnd = useCallback(() => {
    if (!dragRef.current.active) return
    const wasMoved = dragRef.current.moved
    dragRef.current.active = false
    if (wasMoved) {
      suppressTapRef.current = true
      setTimeout(() => {
        suppressTapRef.current = false
      }, 450)
      // 吸附到最近的边缘
      const snapped = snapToEdge(fabPosRef.current.left, fabPosRef.current.bottom, sysRef.current)
      setFabPos(snapped)
      fabPosRef.current = snapped
      try {
        Taro.setStorageSync(FAB_POS_STORAGE, snapped)
      } catch (_) { }
    } else {
      navigateToAssistantPage()
    }
    dragRef.current.moved = false
  }, [navigateToAssistantPage])

  return (
    <View className='ai-assistant-weapp-host'>
      <View
        className='ai-assistant-root ai-assistant-root--weapp-compact'
        style={{
          left: `${fabPos.left}px`,
          bottom: `${fabPos.bottom}px`,
          top: 'auto',
          right: 'auto'
        }}
        catchMove
      >
        <View
          className='ai-assistant-fab'
          onTouchStart={onFabTouchStart}
          onTouchMove={onFabTouchMove}
          onTouchEnd={onFabTouchEnd}
          onTouchCancel={onFabTouchEnd}
          onClick={onFabTap}
        >
          {fabIconUrl ? (
            <Image className='ai-assistant-fab__img' src={fabIconUrl} mode='aspectFill' />
          ) : fabBuiltinEmoji ? (
            <Text className='ai-assistant-fab__emoji'>{fabBuiltinEmoji}</Text>
          ) : (
            <Text className='ai-assistant-fab__text'>AI</Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default function AiAssistantFab() {
  const aiEnabled = process.env.APP_AI_ASSISTANT === '1' || process.env.APP_AI_ASSISTANT === 'true'
  const hideOnFullPage = useHideAssistantFabOnFullPage(aiEnabled)

  if (!aiEnabled) {
    return null
  }

  if (hideOnFullPage) {
    return null
  }

  return <AiAssistantFabButton />
}
