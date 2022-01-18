import S from '@/spx'
import Taro, { getCurrentInstance } from '@tarojs/taro'

//跳转到注册页
function navigationToReg () {
  Taro.navigateTo({
    url: '/subpages/auth/reg'
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
      ? redirect
      : process.env.APP_HOME_PAGE
    Taro.redirectTo({ url })
    // window.location.href = `${window.location.origin}${url}`
  }
}

/*-----监听返回事件-----*/
function pushHistory (returnUrl, currentUrl, currentTitle) {
  window.addEventListener(
    'popstate',
    function (e) {
      console.log('====popstate===>', e)
      // window.location.href = returnUrl
      //window.location.replace(returnUrl);
    },
    false
  )
  // var state = {
  //   title: currentTitle,
  //   url: currentUrl
  // };
  // window.history.pushState(state, currentTitle, currentUrl);
}

export { navigationToReg, setToken, setTokenAndRedirect, pushHistory, getToken }
