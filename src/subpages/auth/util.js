// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import S from '@/spx'
import { showToast } from '@/utils'
import Taro, { getCurrentInstance } from '@tarojs/taro'

//跳转到注册页
function navigationToReg(redirect) {
  Taro.navigateTo({
    url: `/subpages/auth/reg?redi_url=${encodeURIComponent(redirect)}`
  })
}

//设置token
function setToken(token = '') {
  if (token) {
    S.setAuthToken(token)
    return true
  }
}

function getToken() {
  return S.getAuthToken()
}

function getRedirectUrl() {}

//设置token并跳转
async function setTokenAndRedirect(token = '', tokenSetSuccessCallback) {
  const hasToken = setToken(token)

  const $instance = this ? this.$instance : getCurrentInstance()
  const router = $instance.router
  if (hasToken) {
    await tokenSetSuccessCallback?.()
    const { redi_url, redirect } = router.params
    const url = redi_url
      ? decodeURIComponent(redi_url)
      : redirect
      ? decodeURIComponent(redirect)
      : '/subpages/member/index'
    // Taro.redirectTo({ url })
    window.location.href = `${window.location.origin}${url}`
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
