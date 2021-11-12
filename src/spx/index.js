import Taro from '@tarojs/taro'
import api from '@/api'
import { isWeixin, isAlipay, log, isGoodsShelves, showToast } from '@/utils'
import configStore from '@/store'
import qs from 'qs'

const globalData = {}
const TOKEN_IDENTIFIER = 'auth_token'
const TOKEN_TIMESTAMP = 'refresh_token_time'
const QW_SESSION_KEY_TIMESTAMP = 'refresh_session_key_time' //企业微信session_key过期时间
const QW_SESSION = 'qw_session' //企微用户信息
const { store } = configStore()

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
  constructor (options = {}) {
    this.hooks = []
    this.options = {
      autoRefreshToken: true,
      ...options
    }

    if (this.options.autoRefreshToken) {
      this.startRefreshToken()
      this.refreshQwUserinfo()
    }
  }

  refreshQwUserinfo () {
    if (this._refreshSessionKeyTimer) {
      clearTimeout(this._refreshSessionKeyTimer)
    }
    const checkAndRefresh = async () => {
      const expired = this.get(QW_SESSION_KEY_TIMESTAMP, true)
      if (!expired) return false
      const delta = Date.now() - expired

      if (delta > 0) {
        await this.setQwSession()
        clearTimeout(this._refreshSessionKeyTimer)
      }
    }
    //  let time= setInterval(checkAndRefresh, 7200*1000)
    let time = setInterval(checkAndRefresh, 7200 * 1000)
    this._refreshSessionKeyTimer = time
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
    Taro.setStorageSync(TOKEN_TIMESTAMP, Date.now() + 55 * 60 * 1000)
  }

  startRefreshToken () {
    if (this._refreshTokenTimer) {
      clearTimeout(this._refreshTokenTimer)
    }
    const checkAndRefresh = async () => {
      const expired = Taro.getStorageSync(TOKEN_TIMESTAMP)
      if (!expired) return
      const delta = expired - Date.now()
      if (delta > 0 && delta <= 5 * 60 * 1000) {
        const { token } = await api.user.refreshToken()
        clearTimeout(this._refreshTokenTimer)
        this.setAuthToken(token)
      }
    }

    setInterval(checkAndRefresh, 5 * 60 * 1000)
  }

  async getUserInfo () {
    let userInfo = this.get('userInfo')
    const token = this.getAuthToken()
    if (!userInfo && token) {
      userInfo = await api.user.info()
      this.set('userInfo', userInfo)
    }

    return userInfo
  }

  get (key, forceLocal) {
    let val = globalData[key]
    if (forceLocal) {
      val = Taro.getStorageSync(key)
      this.set(key, val)
    }
    return val
  }

  set (key, val, forceLocal) {
    globalData[key] = val
    if (forceLocal) {
      Taro.setStorageSync(key, val)
    }
  }
  delete (key, forceLocal) {
    delete globalData[key]
    if (forceLocal) {
      Taro.removeStorageSync(key)
    }
  }
  hasHook (name) {
    return this.hooks[name] !== undefined
  }

  async trigger (name, ...args) {
    const cbs = this.hooks[name]
    if (!cbs) return

    const ret = []

    for (let cb of cbs) {
      let rs = isAsync(cb) ? await cb.apply(this, args) : cb.apply(this, args)

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

  async OAuthWxUserProfile (fn, require) {
    if (!this.getAuthToken()) {
      showToast('请先登录')
      return
    }
    const { member } = store.getState().member
    const { avatar, username } = member.memberInfo
    if (avatar && username && !require) {
      fn && fn()
    } else {
      return new Promise((reslove, reject) => {
        if (isWeixin) {
          wx.getUserProfile({
            desc: '用于完善会员资料',
            success: async (data) => {
              const { userInfo } = data
              await api.member.updateMemberInfo({
                username: userInfo.nickName,
                avatar: userInfo.avatarUrl
              })
              await this.getMemberInfo()
              reslove()
              fn && fn()
            },
            fail: (e) => {
              reject(e)
            }
          })
        }
      })
    }
  }

  // 获取会员信息
  async getMemberInfo () {
    const userInfo = await api.member.memberInfo()
    store.dispatch({
      type: 'member/init',
      payload: userInfo
    })
    const { username, avatar, user_id, mobile, open_id } = userInfo.memberInfo
    Taro.setStorageSync('userinfo', {
      username: username,
      avatar: avatar,
      userId: user_id,
      isPromoter: userInfo.is_promoter,
      mobile: mobile,
      openid: open_id,
      vip: userInfo.vipgrade ? userInfo.vipgrade.vip_type : ''
    })
    return userInfo
  }

  async autoLogin (ctx, next) {
    const IS_QW_GOODS_SHELVES = isGoodsShelves()
    try {
      await this.trigger('autoLogin', ctx)
      if (IS_QW_GOODS_SHELVES) {
        await this.loginQW(ctx)
        const guideInfo = this.get('GUIDE_INFO', true)
        return guideInfo
      } else {
        if (!this.getAuthToken()) {
          throw new Error('auth token not found, go auth...')
        }
        let userInfo = await this.getMemberInfo()
        if (next) await next(userInfo)
        if (!userInfo) throw new Error('userInfo is empty')
        return userInfo
      }
    } catch (e) {
      log.debug('[auth failed] redirect to login page: ', e)
      if (IS_QW_GOODS_SHELVES) {
        await this.loginQW(ctx)
        return true
      } else {
        await this.login(ctx)
        return true
      }
    }
  }

  async login (ctx, isRedirect = false) {
    let code, token
    if (isWeixin) {
      let { update_time } = await api.wx.getPrivacyTime()
      let policy = Taro.getStorageSync('PrivacyUpdate_time')
      if (!policy || policy != update_time) {
        return true
      }

      const resLogin = (await Taro.login()) || {}
      code = resLogin.code
      try {
        const tokenLogin = (await api.wx.login({ code })) || {}
        token = tokenLogin.token
      } catch (e) {
        return true
      }
    } else if (isAlipay) {
      const authLogin = await my.getAuthCode({ scopes: ['auth_base'] })
      code = authLogin.authCode
      const tokenLogin = await api.alipay.login({ code })
      token = tokenLogin.token
    }
    if (token) {
      this.setAuthToken(token, true)
      const userInfo = await this.getMemberInfo()
      return userInfo
    } else {
      // showToast("登录失败");
    }
    // const { path, fullPath } = getCurrentRoute(ctx.$router);
    // const encodedRedirect = encodeURIComponent(fullPath);
    // if (path === APP_AUTH_PAGE) {
    //   return;
    // }
    // const authUrl = APP_AUTH_PAGE + `?redirect=${encodedRedirect}`;
    // Taro[isRedirect ? "redirectTo" : "navigateTo"]({
    //   url: authUrl
    // });
  }

  async loginQW (ctx) {
    console.log('[loginQW] 企微登录 执行')
    let { code } = await this.getQyLoginCode()
    const QwUserInfo = await api.user.getQwUserInfo({
      appname: `${APP_NAME}`,
      code
    })
    let { salesperson_id, distributor_id, session3rd } = QwUserInfo
    this.setAuthToken(session3rd)
    //查询当前导购门店信息是否有效
    const { status } = await api.guide.is_valid({
      salesperson_id,
      distributor_id
    })
    const _QwUserInfo = {
      ...QwUserInfo,
      store_isValid: status
    }
    this.set('GUIDE_INFO', _QwUserInfo, true)
  }

  logout () {
    Taro.removeStorageSync(TOKEN_TIMESTAMP)
    this.delete(TOKEN_IDENTIFIER, true)
    Taro.removeStorageSync('userinfo')
    this.trigger('logout')
  }

  globalData () {
    if (process.env.NODE_ENV === 'production') {
      return null
    } else {
      return globalData
    }
  }
  //获取企业微信code
  getQyLoginCode () {
    return new Promise((reslove, reject) => {
      wx.qy.login({
        success: (res) => {
          reslove(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

  setUvTimeStamp () {
    let uvstamp = Taro.getStorageSync('userVisitTime')
    let today = formatDataTime(new Date())
    if (!uvstamp || (uvstamp && new Date(today).getTime() > uvstamp)) {
      api.user.getuservisit()
      uvstamp = new Date(today).getTime() + 5 * 60 * 1000
      Taro.setStorageSync('userVisitTime', uvstamp)
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
