import S from '@/spx'
import { showToast } from '@/utils'
import Taro, { getCurrentInstance } from '@tarojs/taro'

//跳转到注册页
function navigationToReg (redirect) {
  Taro.navigateTo({
    url: `/subpages/auth/reg?redi_url=${encodeURIComponent(redirect)}`
  })
}

//设置token
function setToken (token = '') {
  if (token) {
    S.setAuthToken(token)
    return true
  }
}

function getToken () {
  return S.getAuthToken()
}

//设置token并跳转
async function setTokenAndRedirect (token = '', tokenSetSuccessCallback) {
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
    Taro.redirectTo({ url })
    // window.location.href = `${window.location.origin}${url}`
  }
}

/*-----监听返回事件-----*/
function pushHistory (callback) {
  window.addEventListener('popstate', callback, false)
  window.history.pushState(null, null, document.URL)
}

function clearHistory (callback) {
  window.removeEventListener('popstate', callback, false)
}

function addListener () {
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
