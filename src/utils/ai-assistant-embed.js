/**
 * AI 助手嵌入页 URL（小程序 WebView 组件 / H5 同源页共用）
 */
import Taro from '@tarojs/taro'
import S from '@/spx'
import { getDistributorId } from '@/utils'

/** @returns {string} 助手后端根 URL，无尾斜杠；未配置时返回 '' */
function resolveAiAssistantBaseUrl() {
  const raw = process.env.APP_AI_BASE_URL
  if (raw != null && String(raw).trim()) {
    return String(raw).trim().replace(/\/+$/, '')
  }
  return ''
}

export function deriveH5OriginFromAppBaseUrl() {
  const raw = process.env.APP_BASE_URL || ''
  if (!raw || !String(raw).trim()) {
    return ''
  }
  const s = String(raw).trim()
  const apiIdx = s.indexOf('/api/')
  if (apiIdx > 0) {
    return `${s.substring(0, apiIdx).replace(/\/+$/, '')}/`
  }
  try {
    const u = new URL(s.startsWith('http') ? s : `https://${s}`)
    return `${u.protocol}//${u.host}/`
  } catch {
    return ''
  }
}

export function buildAiEmbedPageUrl() {
  const explicit = process.env.APP_AI_EMBED_PAGE_URL
  if (explicit && String(explicit).trim()) {
    let u = String(explicit).trim()
    if (!/\.html(\?|$)/i.test(u)) {
      u = `${u.replace(/\/?$/, '/')}index.html`
    }
    return u
  }
  const assistantBase = resolveAiAssistantBaseUrl()
  if (assistantBase) {
    return `${assistantBase}/ai-assistant-embed/index.html`
  }
  let base = process.env.APP_CUSTOM_SERVER || ''
  if (!base || String(base).includes('/api/')) {
    base = ''
  }
  base = String(base).replace(/\/?$/, '/')
  if (!base) {
    base = deriveH5OriginFromAppBaseUrl()
  }
  if (!base) {
    return ''
  }
  return `${base}ai-assistant-embed/index.html`
}

/**
 * @returns {string} 完整 web-view src，失败时返回 ''
 */
export function buildAiAssistantAuthPayload() {
  const token = S.getAuthToken() || ''
  const companyId =
    process.env.APP_COMPANY_ID != null && process.env.APP_COMPANY_ID !== ''
      ? String(process.env.APP_COMPANY_ID)
      : ''
  let distributorId = ''
  try {
    const d = getDistributorId()
    if (d != null && String(d).trim() !== '') {
      distributorId = String(d).trim()
    }
  } catch {
    /* ignore */
  }
  const tenantId =
    process.env.APP_AI_TENANT_ID != null && process.env.APP_AI_TENANT_ID !== ''
      ? String(process.env.APP_AI_TENANT_ID)
      : ''

  return {
    type: 'ECSHOPX_AUTH',
    token,
    companyId,
    tenantId,
    distributorId
  }
}

export function postAiAssistantAuthToEmbed(targetWindow, targetOrigin) {
  if (!targetWindow || typeof targetWindow.postMessage !== 'function' || !targetOrigin) return
  try {
    targetWindow.postMessage(buildAiAssistantAuthPayload(), targetOrigin)
  } catch {
    /* ignore */
  }
}

export function buildAiAssistantWebviewSrc() {
  const base = buildAiEmbedPageUrl()
  if (!base) return ''

  const { token, companyId, distributorId, tenantId } = buildAiAssistantAuthPayload()
  const backend = String(process.env.APP_AI_ASSISTANT_BACKEND_URL || resolveAiAssistantBaseUrl()).replace(/\/$/, '')

  const q = new URLSearchParams()
  if (token) q.set('token', token)
  if (companyId) q.set('company_id', companyId)
  if (distributorId) q.set('distributor_id', distributorId)
  if (tenantId) q.set('tenant_id', tenantId)
  q.set('backend', backend)
  // iframe 嵌入模式：隐藏关闭按钮，关闭即返回上一页
  q.set('layout', 'page') // iframe 嵌入模式：使用 page 布局
  q.set('page-soft-close', 'true') // 软关闭：隐藏面板并显示「继续对话」按钮，不触发小程序返回
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}${q.toString()}`
}
