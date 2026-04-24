/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import S from '@/spx'
import { showToast } from '@/utils'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { SG_CHECK_STORE_RULE } from '@/consts'

/**
 * 将 redirect / redi_url 规范成「未 URI 编码的站内路径」，
 * 避免 登录→注册→登录 等链路里对已编码字符串再次 encode 出现 %252F、%25252F 乱码。
 */
export function normalizeAuthRedirectParam(raw) {
  if (raw == null) return ''
  let s = String(raw).trim()
  if (!s) return ''
  for (let i = 0; i < 8; i += 1) {
    try {
      const next = decodeURIComponent(s)
      if (next === s) break
      s = next
    } catch {
      break
    }
  }
  return s
}

//跳转到注册页
function navigationToReg(redirect) {
  const plain = normalizeAuthRedirectParam(redirect)
  Taro.navigateTo({
    url: `/subpages/auth/reg?redi_url=${encodeURIComponent(plain)}`
  })
}

//设置token
function setToken(token = '') {
  if (token) {
    S?.setAuthToken(token)
    return true
  }
}

function getToken() {
  return S?.getAuthToken()
}

function getRedirectUrl() {}

//设置token并跳转
// options.forceMemberCenter：注册成功等场景固定进会员中心，忽略 redi_url / redirect
async function setTokenAndRedirect(token = '', tokenSetSuccessCallback, options) {
  const opts = typeof options === 'object' && options !== null ? options : {}
  const { forceMemberCenter = false } = opts

  const hasToken = setToken(token)

  const $instance = this ? this.$instance : getCurrentInstance()
  const router = $instance?.router
  if (hasToken) {
    await tokenSetSuccessCallback?.()
    const { redi_url, redirect } = router?.params || {}
    const url = forceMemberCenter
      ? '/subpages/member/index'
      : redi_url
      ? normalizeAuthRedirectParam(redi_url)
      : redirect
      ? normalizeAuthRedirectParam(redirect)
      : '/subpages/member/index'
    // 清空店铺进店规则检查
    Taro.setStorageSync(SG_CHECK_STORE_RULE, 0)
    // 站内路径：与小程序一致用 redirectTo（H5 为路由替换，不占「返回」栈）；外链用 location.replace
    if (/^https?:\/\//i.test(url)) {
      if (typeof window !== 'undefined') {
        window.location.replace(url)
      }
    } else {
      const path = url.startsWith('/') ? url : `/${url}`
      try {
        await Taro.redirectTo({ url: path })
      } catch (e) {
        // 例如目标为 tabBar 页时 redirectTo 会失败，再整页替换
        if (typeof window !== 'undefined') {
          window.location.replace(`${window.location.origin}${path}`)
        }
      }
    }
  }
}

/*-----监听返回事件-----*/
function pushHistory(callback) {
  window.addEventListener('popstate', callback, false)
  window.history.pushState(null, null, document.URL)
}

function clearHistory(callback) {
  window.removeEventListener('popstate', callback, false)
}

function addListener() {
  window.addEventListener('focusout', () => {})
}

export {
  navigationToReg,
  setToken,
  setTokenAndRedirect,
  pushHistory,
  clearHistory,
  getToken,
  addListener
}
