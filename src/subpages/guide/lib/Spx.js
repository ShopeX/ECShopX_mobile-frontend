import { Spx } from '@/spx'
import Taro from '@tarojs/taro'
import api from '@/api'
import pkg from '../../../../package.json'
import { log, isGoodsShelves } from '@/utils'
import configStore from '@/store'

const TOKEN_TIMESTAMP = 'refresh_token_time'
const QW_SESSION_KEY_TIMESTAMP = 'refresh_session_key_time' //企业微信session_key过期时间
const { store } = configStore()
class QWSPX extends Spx {
  constructor(...options) {
    super(...options)
    console.log('QWSPX:this', this)
    console.log('QWSPX:this.get', this.get)
    if (this.options.autoRefreshToken) {
      // this.startRefreshToken()
      this.refreshQwUserinfo()
    }
  }
  refreshQwUserinfo() {
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

  async autoLogin(ctx, next) {
    const IS_QW_GOODS_SHELVES = isGoodsShelves()
    try {
      await this.trigger('autoLogin', ctx)
      if (IS_QW_GOODS_SHELVES) {
        await this.loginQW(ctx)
        const guideInfo = this.get('GUIDE_INFO', true)
        return guideInfo
      } else {
        if (!super.getAuthToken()) {
          throw new Error('auth token not found, go auth...')
        }
        let userInfo = await super.getMemberInfo()
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
        await super.login(ctx)
        return true
      }
    }
  }

  async loginQW(ctx) {
    console.log('[loginQW] 企微登录 执行')
    let { code } = await this.getQyLoginCode()
    const QwUserInfo = await api.user.getQwUserInfo({
      appname: `${pkg.app_name}`,
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
}

export default new QWSPX()
