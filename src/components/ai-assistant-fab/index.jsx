/**
 * 侧吸可拖拽 FAB：拉 embed-config 头像，点击进 /subpages/ai-assistant/index（H5 location / 小程序 navigateTo）。
 */
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { isWeb } from '@/utils'
import './index.scss'

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

function useHideAssistantFabOnFullPage(enabled) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined

    const isAssistantEmbedPage = () => {
      if (isWeb) {
        const hash = (window.location.hash || '').replace(/^#\/?/, '')
        const path = window.location.pathname || ''
        return `${path} ${hash}`.includes('subpages/ai-assistant/index')
      }
      try {
        const pages = Taro.getCurrentPages()
        const route = pages[pages.length - 1]?.route || ''
        return route.includes('subpages/ai-assistant/index')
      } catch {
        return false
      }
    }

    const tick = () => setHidden(isAssistantEmbedPage())
    tick()
    const interval = setInterval(tick, 350)

    if (isWeb) {
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

const BUILTIN_AVATAR_CODES = new Set(['fox', 'robot', 'cat'])
/** 小程序首屏无法用 Web 组件画 SVG，内置三种用 emoji 与挂件语义对齐，点开 web-view 后仍为完整形象 */
const BUILTIN_FAB_EMOJI = { fox: '🦊', robot: '🤖', cat: '🐱' }

const FAB_PX = 52
const FAB_PAD = 8
const FAB_POS_STORAGE = 'ai_assistant_fab_pos_v1'

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

function snapFabPosToEdge(left, bottom, sys) {
  if (!sys) return { left, bottom }
  const clamped = clampFabPos(left, bottom, sys)
  const maxL = sys.windowWidth - FAB_PX - FAB_PAD
  const nextLeft = clamped.left + FAB_PX / 2 < sys.windowWidth / 2 ? FAB_PAD : maxL
  return clampFabPos(nextLeft, clamped.bottom, sys)
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

function getFabSystemInfo() {
  try {
    return Taro.getSystemInfoSync()
  } catch {
    if (typeof window === 'undefined') return null
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      safeAreaInsets: { bottom: 0 }
    }
  }
}

function readInitialFabPos() {
  const sys = getFabSystemInfo()
  if (!sys) return { left: 12, bottom: 120 }
  const w = sys.windowWidth
  const safeB = sys.safeAreaInsets?.bottom || 0
  return clampFabPos(w - FAB_PX - FAB_PAD, 100 + safeB, sys)
}

function normalizeSavedFabPos(saved, sys) {
  if (!saved || typeof saved.left !== 'number' || typeof saved.bottom !== 'number') return null
  if (!sys) return saved
  const migratedLeft = saved.left <= 0 ? readInitialFabPos().left : saved.left
  return clampFabPos(migratedLeft, saved.bottom, sys)
}

<<<<<<< HEAD
function WeappAiAssistantWebviewEntry() {
  const [fabIconUrl, setFabIconUrl] = useState('')
  const [fabBuiltinEmoji, setFabBuiltinEmoji] = useState('')
  const [fabPos, setFabPos] = useState(readInitialFabPos)

  const fabPosRef = useRef(fabPos)
  const sysRef = useRef(null)
  /** 拖拽结束后会合成一次 tap，需忽略避免误开面板 */
  const suppressTapRef = useRef(false)
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    origLeft: 0,
    origBottom: 0
  })
  const MOVE_PX_TO_DRAG = 16

  useEffect(() => {
    fabPosRef.current = fabPos
  }, [fabPos])

  useEffect(() => {
    const sys = Taro.getSystemInfoSync()
    sysRef.current = sys
    try {
      const saved = Taro.getStorageSync(FAB_POS_STORAGE)
      const savedPos = normalizeSavedFabPos(saved, sys)
      if (savedPos) {
        setFabPos(savedPos)
        fabPosRef.current = savedPos
      }
    } catch (_) {}
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
        if (BUILTIN_AVATAR_CODES.has(code)) {
          setFabBuiltinEmoji(BUILTIN_FAB_EMOJI[code] || '')
          setFabIconUrl('')
        } else {
          setFabBuiltinEmoji('')
          setFabIconUrl(buildWeappFabAvatarUrl(backend, tid, code))
        }
      })
      .catch(() => {})
  }, [])

  const lastOpenAtRef = useRef(0)

  /** 独立页 /pages/ai-assistant-webview 内全屏 web-view 加载 ai-assistant-embed（H5 挂件页） */
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
    Promise.resolve(Taro.navigateTo({ url: '/pages/ai-assistant-webview/index' })).catch(() => {
      Taro.showToast({ title: '无法打开助手', icon: 'none' })
    })
  }, [])

  /** 部分机型子节点不冒泡 touchend，用 click/tap 兜底（拖拽后会 suppressTap） */
  const onFabTap = useCallback(() => {
    if (suppressTapRef.current) return
    navigateToAssistantPage()
  }, [navigateToAssistantPage])

  const onFabTouchStart = useCallback((e) => {
    // 立即设置 dragging 状态，禁用过渡动画，确保跟手
    setDragging(true)
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
      try {
        Taro.setStorageSync(FAB_POS_STORAGE, fabPosRef.current)
      } catch (_) {}
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

function LegacyAssistantFab() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const send = useCallback(async () => {
    const text = (input || '').trim()
    if (!text || loading) return
    const token = S.getAuthToken()
    if (!token) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      setTimeout(() => goLoginForAssistant(), 400)
      return
    }
    setLoading(true)
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    try {
      const res = await Taro.request({
        url: `${base}assistant/chat`,
        method: 'POST',
        data: { message: text, sessionId: 'vshop' },
        header: {
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: `Bearer ${token}`
        }
      })
      const sc = res.statusCode
      const body = res.data || {}
      const d = body.data || body
      if (sc >= 200 && sc < 300 && d.reply) {
        setMessages((m) => [...m, { role: 'assistant', text: d.reply }])
      } else if (d.message) {
        Taro.showToast({ title: d.message, icon: 'none' })
        setMessages((m) => [...m, { role: 'assistant', text: d.message || '请求失败' }])
      } else {
        setMessages((m) => [...m, { role: 'assistant', text: '暂无回复' }])
      }
    } catch (e) {
      Taro.showToast({ title: '网络错误', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }, [input, loading])

  return (
    <View className={`ai-assistant-root ${isWeb ? 'ai-assistant--web' : ''}`}>
      {open && (
        <View className='ai-assistant-panel'>
          <View className='ai-assistant-panel__head'>
            <Text>商城助手</Text>
            <Text className='ai-assistant-close' onClick={() => setOpen(false)}>
              关闭
            </Text>
          </View>
          <View className='ai-assistant-messages'>
            {messages.length === 0 && (
              <Text className='ai-assistant-hint'>试试说：搜索 手机、我的订单</Text>
            )}
            {messages.map((msg, i) => (
              <View key={i} className={`ai-assistant-bubble ai-assistant-bubble--${msg.role}`}>
                <Text>{msg.text}</Text>
              </View>
            ))}
          </View>
          <View className='ai-assistant-input-row'>
            <Input
              className='ai-assistant-input'
              value={input}
              onInput={(e) => setInput(e.detail.value)}
              placeholder='输入问题'
              confirmType='send'
              onConfirm={send}
            />
            <Button className='ai-assistant-send' size='mini' loading={loading} onClick={send}>
              发送
            </Button>
          </View>
        </View>
      )}
      <View className='ai-assistant-fab' onClick={() => setOpen(!open)}>
        <Text className='ai-assistant-fab__text'>AI</Text>
      </View>
    </View>
  )
}

=======
>>>>>>> 02d3c10247295ee486ac083a34122c88004ae460
function H5AssistantWidgetLoader() {
  const [fabIconUrl, setFabIconUrl] = useState('')
  const [fabBuiltinEmoji, setFabBuiltinEmoji] = useState('')
  const [fabPos, setFabPos] = useState(readInitialFabPos)
  const [dragging, setDragging] = useState(false)
  const fabPosRef = useRef(fabPos)
  const suppressTapRef = useRef(false)
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    origLeft: 0,
    origBottom: 0
  })
  const MOVE_PX_TO_DRAG = 5
  const lastOpenAtRef = useRef(0)

  useEffect(() => {
    fabPosRef.current = fabPos
  }, [fabPos])

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
        if (BUILTIN_AVATAR_CODES.has(code)) {
          setFabBuiltinEmoji(BUILTIN_FAB_EMOJI[code] || '')
          setFabIconUrl('')
        } else {
          setFabBuiltinEmoji('')
          setFabIconUrl(buildWeappFabAvatarUrl(backend, tid, code))
        }
      })
      .catch(() => {})

    // 读取保存的位置
    const sys = getFabSystemInfo()
    try {
      const saved = Taro.getStorageSync(FAB_POS_STORAGE)
      const savedPos = normalizeSavedFabPos(saved, sys)
      if (savedPos) {
        setFabPos(savedPos)
        fabPosRef.current = savedPos
      }
    } catch (_) {}
  }, [])

  const navigateToWebviewPage = useCallback(() => {
    if (suppressTapRef.current) return
    const now = Date.now()
    if (now - lastOpenAtRef.current < 480) return
    lastOpenAtRef.current = now

    // 跳转到 iframe 页面，保持域名不变
    const iframePageUrl = '/subpages/ai-assistant/index'

    // 用 isWeb 区分构建目标；勿用 typeof window（小程序开发者工具里也可能存在 window）
    if (isWeb) {
      window.location.href = iframePageUrl
    } else {
      Promise.resolve(Taro.navigateTo({ url: iframePageUrl })).catch(() => {
        Taro.showToast({ title: '无法打开助手', icon: 'none' })
      })
    }
  }, [])

  const onTouchStart = useCallback((e) => {
    // 立即设置 dragging 状态，禁用过渡动画，确保跟手
    setDragging(true)
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

  const onTouchMove = useCallback((e) => {
    if (!dragRef.current.active) return
    const t = e.touches[0]
    const dx = t.clientX - dragRef.current.startX
    const dy = t.clientY - dragRef.current.startY
    if (Math.abs(dx) > MOVE_PX_TO_DRAG || Math.abs(dy) > MOVE_PX_TO_DRAG) {
      dragRef.current.moved = true
      setDragging(true)
    }
    const nextLeft = dragRef.current.origLeft + dx
    const nextBottom = dragRef.current.origBottom - dy
    const sys = getFabSystemInfo()
    const nextPos = sys
      ? clampFabPos(nextLeft, nextBottom, sys)
      : { left: nextLeft, bottom: nextBottom }
    setFabPos(nextPos)
    fabPosRef.current = nextPos
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!dragRef.current.active) return
    const wasMoved = dragRef.current.moved
    dragRef.current.active = false
    setDragging(false)
    if (wasMoved) {
      suppressTapRef.current = true
      setTimeout(() => {
        suppressTapRef.current = false
      }, 450)
      const sys = getFabSystemInfo()
      const snappedPos = snapFabPosToEdge(fabPosRef.current.left, fabPosRef.current.bottom, sys)
      setFabPos(snappedPos)
      fabPosRef.current = snappedPos
      try {
        Taro.setStorageSync(FAB_POS_STORAGE, snappedPos)
      } catch (_) {}
    } else {
      navigateToWebviewPage()
    }
    dragRef.current.moved = false
  }, [navigateToWebviewPage])

  return (
    <View className='ai-assistant-weapp-host'>
      <View
        className={`ai-assistant-root ai-assistant-root--weapp-compact${
          dragging ? ' ai-assistant-root--weapp-dragging' : ''
        }`}
        style={{
          left: `${fabPos.left}px`,
          bottom: `${fabPos.bottom}px`,
          top: 'auto',
          right: 'auto',
          width: `${FAB_PX}px`,
          height: `${FAB_PX}px`
        }}
      >
        <View
          className='ai-assistant-fab'
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          onClick={navigateToWebviewPage}
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

function AiAssistantFab() {
  const aiEnabled = process.env.APP_AI_ASSISTANT === '1' || process.env.APP_AI_ASSISTANT === 'true'
  const hideOnFullPage = useHideAssistantFabOnFullPage(aiEnabled)

  if (!aiEnabled) {
    return null
  }

  if (hideOnFullPage) {
    return null
  }

  return <H5AssistantWidgetLoader />
}

AiAssistantFab.options = {
  addGlobalClass: true
}

export default AiAssistantFab
