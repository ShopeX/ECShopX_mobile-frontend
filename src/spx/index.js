import Taro from '@tarojs/taro'
import api from '@/api'
import { getCurrentRoute, log } from '@/utils'

const globalData = {}
const TOKEN_IDENTIFIER = 'authToken'

function remove (arr, item) {
  const idx = arr.indexOf(item)
  if (idx >= 0) {
    arr.splice(idx, 1)
  }
}

function isAsync (func) {
  const string = func.toString().trim()

  return !!(
    string.match(/^async /) ||
    string.match(/return _ref[^.]*\.apply/) || // babel transform
    func.then
  )
}

class Spx {
  constructor () {
    this.hooks = []
  }

  getAuthToken () {
    const authToken = Taro.getStorageSync(TOKEN_IDENTIFIER)
    if (authToken && !this.get(TOKEN_IDENTIFIER)) {
      this.set(TOKEN_IDENTIFIER, authToken)
    }
    return authToken
  }

  setAuthToken (token) {
    this.set(TOKEN_IDENTIFIER, token)
    Taro.setStorageSync(TOKEN_IDENTIFIER, token)
  }

  async getUserInfo () {
    let userInfo = this.get('userInfo')
    const token = this.getAuthToken()
    if (!userInfo && token) {
      userInfo = await api.getUserInfo()
      this.set('userInfo', userInfo)
    }

    return userInfo
  }

  get (key) {
    return globalData[key]
  }

  set (key, val) {
    globalData[key] = val
  }

  hasHook (name) {
    return this.hooks[name] !== undefined
  }

  async trigger (name, ...args) {
    const cbs = this.hooks[name]
    if (!cbs) return

    const ret = []

    for (let cb of cbs) {
      let rs = isAsync(cb)
        ? await cb.apply(this, args)
        : cb.apply(this, args)

      ret.push(rs)
    }

    return ret
  }

  bind (name, fn) {
    const fns = this.hooks[name] || []
    fns.push(fn)
    this.hooks[name] = fns
  }

  unbind (name, fn) {
    const fns = this.hooks[name]
    if (!fns) return

    remove(fns, fn)
  }

  async autoLogin (ctx, next) {
    const appEnv = Taro.getEnv()

    try {
      await this.trigger('autoLogin', ctx)
      if (appEnv === Taro.ENV_TYPE.WEAPP) {
        await Taro.checkSession()
      }
      if (!this.getAuthToken()) {
        throw new Error('auth token not found')
      }

      let userInfo = await this.getUserInfo()
      if (next) await next(userInfo)

      return userInfo
    } catch (e) {
      log.debug('[auth failed] redirect to login page: ', e)

      this.goLogin(ctx)
    }
  }

  login (ctx, isRedirect = true) {
    const { fullPath } = getCurrentRoute(ctx.$router)

    const authUrl = process.env.TARO_ENV === 'weapp'
      ? `/pages/auth/login?redirect=${fullPath}`
      : `/pages/auth/login?redirect=${fullPath}`

    Taro[isRedirect ? 'redirectTo' : 'navigateTo']({
      url: authUrl
    })
  }

  logout () {
    Taro.removeStorageSync(TOKEN_IDENTIFIER)
    delete globalData[TOKEN_IDENTIFIER]
    this.trigger('logout')
  }

  globalData () {
    if (process.env.NODE_ENV === 'production') {
      return null
    } else {
      return globalData
    }
  }

  toast (...args) {
    Taro.eventCenter.trigger.apply(Taro.eventCenter, ['sp-toast:show', ...args])
  }

  closeToast () {
    Taro.eventCenter.trigger('sp-toast:close')
  }
}



export default new Spx()
