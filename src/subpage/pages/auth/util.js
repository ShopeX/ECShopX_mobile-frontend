import S from '@/spx'
import Taro, { getCurrentInstance } from '@tarojs/taro'

//跳转到注册页
function navigationToReg () {
  Taro.navigateTo({
    url: '/subpage/pages/auth/reg'
  })
}

//设置token
function setToken (token = '') {
  if (token) {
    S.setAuthToken(token)
    return true
  }
}

//设置token并跳转
function setTokenAndRedirect (token = '') {
  const hasToken = setToken(token)

  const $instance = this ? this.$instance : getCurrentInstance()
  const router = $instance.router
  if (hasToken) {
    const { redi_url } = router.params
    const url = redi_url ? decodeURIComponent(redi_url) : process.env.APP_HOME_PAGE

    Taro.redirectTo({
      url
    })
  }
}

export { navigationToReg, setToken, setTokenAndRedirect }
