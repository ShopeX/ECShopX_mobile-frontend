import Taro,{ getCurrentInstance } from "@tarojs/taro";
import api from "@/api";
import { isWeixin, isAlipay, log, isGoodsShelves, showToast } from "@/utils";
import { SG_TOKEN, SG_USER_INFO } from '@/consts/localstorage'
import qs from 'qs'
import configStore from '@/store'
const  store  = configStore()


const globalData = {}
class Spx {
  constructor(options = {}) {
    this.hooks = [];
    this.options = {
      autoRefreshToken: true,
      ...options
    };

  }

  getAuthToken() {
    const authToken = Taro.getStorageSync(SG_TOKEN);
    if (authToken && !this.get(SG_TOKEN)) {
      this.set(SG_TOKEN, authToken);
    }
    return authToken;
  }

  setAuthToken(token) {
    this.set(SG_TOKEN, token);
    Taro.setStorageSync(SG_TOKEN, token);
  }

  logout() {
    Taro.removeStorageSync( SG_TOKEN )
    Taro.removeStorageSync( SG_USER_INFO )
    this.delete(SG_TOKEN, true)
  }

  get(key, forceLocal) {
    let val = globalData[key];
    if (forceLocal) {
      val = Taro.getStorageSync(key);
      this.set(key, val);
    }
    return val;
  }

  set(key, val, forceLocal) {
    globalData[key] = val;
    if (forceLocal) {
      Taro.setStorageSync(key, val);
    }
  }
  
  delete(key, forceLocal) {
    delete globalData[key];
    if (forceLocal) {
      Taro.removeStorageSync(key)
    }
  }
  hasHook(name) {
    return this.hooks[name] !== undefined
  }

  async trigger(name, ...args) {
    const cbs = this.hooks[name]
    if (!cbs) return

    const ret = []

    for (let cb of cbs) {
      let rs = isAsync(cb) ? await cb.apply(this, args) : cb.apply(this, args)

      ret.push(rs)
    }

    return ret
  }

  bind(name, fn) {
    const fns = this.hooks[name] || []
    fns.push(fn)
    this.hooks[name] = fns
  }

  unbind(name, fn) {
    const fns = this.hooks[name]
    if (!fns) return

    remove(fns, fn)
  }

  async OAuthWxUserProfile(fn, require) {
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
  async getMemberInfo() {
    const userInfo = await api.member.memberInfo()
    store.dispatch({
      type: 'user/updateUserInfo',
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

  async autoLogin(ctx, next) {
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

  async login(ctx, isRedirect = false) {
    let code, token
    if (isWeixin) {
      let { update_time } = await api.wx.getPrivacyTime()
      let privacy_time = Taro.getStorageSync("policy_updatetime");
      if (!String(privacy_time) || privacy_time != update_time) {
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
      Taro.eventCenter.trigger('login-success')
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

  async loginQW(ctx) {
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

  logout() {
    Taro.removeStorageSync('userinfo')
    this.trigger('logout')
  }

  globalData() {
    if (process.env.NODE_ENV === 'production') {
      return null
    } else {
      return globalData
    }
  }
  //获取企业微信code
  getQyLoginCode() {
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

  setUvTimeStamp() {
    let uvstamp = Taro.getStorageSync('userVisitTime')
    let today = formatDateTime(new Date())
    if (!uvstamp || (uvstamp && new Date(today).getTime() > uvstamp)) {
      api.user.getuservisit()
      uvstamp = new Date(today).getTime() + 5 * 60 * 1000
      Taro.setStorageSync('userVisitTime', uvstamp)
    }
  }

  toast(...args) {
    Taro.eventCenter.trigger.apply(Taro.eventCenter, [
      "sp-toast:show",
      ...args
    ]);
  }

  closeToast() {
    Taro.eventCenter.trigger("sp-toast:close");
  }
}

export default new Spx();
