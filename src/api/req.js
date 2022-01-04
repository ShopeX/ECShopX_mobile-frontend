import Taro from '@tarojs/taro'
import qs from 'qs'
import S from '@/spx'
import { isAlipay, isWeixin, isWeb,isMerchantModule } from '@/utils'
import log from '@/utils/log'
import { HTTP_STATUS } from './consts'

function addQuery (url, query) {
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + query
}

const request = (() => {
  if (isWeb) {
    // h5环境，请求失败时，需要额外处理
    return async (...args) => {
      let res
      try {
        res = await Taro.request(...args)
      } catch (e) {
        res = e
        if (e instanceof global.Response) {
          const data = await e.json()
          res = {
            data,
            statusCode: e.status,
            header: e.headers
          }
        }
      }

      return res
    }
  }

  return Taro.request
})()
class RequestQueue {
  constructor () {
    this.requestList = []
    this.isRunning = false
  }

  push (req) {
    this.requestList.push(req)
  }

  destroy () {
    this.isRunning = false
    this.requestList = []
  }

  run () {
    this.isRunning = true
    const next = async () => {
      const req = this.requestList.shift()
      log.debug(`requestQueue length is ${this.requestList.length}`)
      if (!req) return

      await req()
      if (this.requestList.length > 0 && this.isRunning) {
        await next()
      }
    }

    next()
  }
}

class API {
  constructor (options = {}) {
    this.setOptions(options)
    this.isRefreshingToken = false
    this.requestQueue = new RequestQueue()
  }

  setOptions (opts) {
    let { baseURL = '/' } = opts
    if (!/\/$/.test(baseURL)) {
      baseURL = baseURL + '/'
    }
    this.baseURL = baseURL

    const options = {
      company_id: process.env.APP_COMPANY_ID
    }
    if (isWeixin || isAlipay) {
      const extConfig = Taro.getExtConfigSync
        ? Taro.getExtConfigSync()
        : { appid: process.env.APP_ID }
      options.appid = extConfig.appid
      if (extConfig.company_id) {
        options.company_id = extConfig.company_id
      }
    }
    this.options = options
  }

  errorToast (data) {
    let errMsg = data.message || (data.data && data.data.message) || '操作失败，请稍后重试'

    if (errMsg.length > 11) {
      errMsg = errMsg.substring(0, 11) + '\n' + errMsg.substring(11)
    }

    setTimeout(() => {
      Taro.showToast({
        icon: 'none',
        title: errMsg
      })
    }, 200)
  }

  getReqUrl (url) {
    return /^http/.test(url) ? url : `${this.baseURL}${url.replace(/^\//, '')}`
  }

  handleLogout () {
    this.requestQueue.destroy()
    this.isRefreshingToken = false
    S.logout()
    setTimeout(() => {
      let url=isMerchantModule?'/subpages/merchant/login':'/pages/member/index'
      Taro.redirectTo({ url});
    }, 300)
  }

  intereptorReq (params) {
    const { url, data, header = {}, method = 'GET' } = params
    const { company_id, appid } = this.options
    const methodIsGet = method.toLowerCase() === 'get'

    const reqUrl = this.getReqUrl(url)
    const query = !data || typeof data === 'string' ? qs.parse(data) : data
    if (company_id) {
      query.company_id = company_id
    }

    if (!methodIsGet) {
      header['content-type'] = header['content-type'] || 'application/x-www-form-urlencoded'
    }

    const token = S.getAuthToken()
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    // 处理版本区分
    if (isWeb) {
      if (process.env.APP_VUE_SAAS) {
        header['origin'] = global.location.host
      }
    }

    if ((isWeixin || isAlipay) && appid) {
      header['authorizer-appid'] = appid
    }

    const config = {
      ...params,
      url: reqUrl,
      data: query,
      method: method.toUpperCase(),
      header: header
    }

    // 清理请求参数
    if (methodIsGet) {
      config.url = addQuery(config.url, qs.stringify(config.data))
      delete config.data
    } else {
      config.data = qs.stringify(config.data)
    }

    return config
  }

  intereptorRes (res) {
    const { data, statusCode, config } = res
    const { showError = true } = config

    if (statusCode == HTTP_STATUS.SUCCESS) {
      const { status_code } = data.data
      if (!status_code) {
        return data.data
      } else {
        // status_code 不为0，表示有错误
        if (showError) {
          this.errorToast(data)
        }
        return Promise.reject(this.reqError(res))
      }
    }

    if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
      if ((data.data && data.data.code) === HTTP_STATUS.USER_FORBIDDEN) {
        if (showError) {
          this.errorToast(data)
        }
        return Promise.reject(this.reqError(res, '帐号已被禁用'))
      }

      this.handleLogout()
      return Promise.reject(this.reqError(res))
    }

    if (statusCode === HTTP_STATUS.NOT_FOUND) {
      return Promise.reject(this.reqError(res, '请求资源不存在'))
    }

    if (statusCode === HTTP_STATUS.BAD_GATEWAY) {
      return Promise.reject(this.reqError(res, '服务端出现了问题'))
    }

    return Promise.reject(this.reqError(res, `API error: ${statusCode}`))
  }

  async refreshToken () {
    this.isRefreshingToken = true
    const token = S.getAuthToken()
    try {
      await this.makeReq(
        {
          header: {
            Authorization: `Bearer ${token}`
          },
          method: 'get',
          url: this.getReqUrl('/token/refresh'),
          noPending: true
        },
        (res) => {
          console.log('refreshing token: ', res)
          const { statusCode } = res
          if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
            return this.handleLogout()
          }

          const newToken = res.header.Authorization.split(' ')[1]
          S.setAuthToken(newToken)
        }
      )
    } catch (e) {
      console.log(e)
    }

    this.isRefreshingToken = false
  }

  request = request

  /**
   *
   *
   * @param {Object} config 请求参数
   * @param {function(Object)} [intereptorRes] 处理请求回调数据的方法
   * @param {function(Object)} [intereptorReq] 处理请求参数的方法
   * @return {Object} 请求返回的数据
   * @memberof API
   */
  async makeReq (config = {}, intereptorRes, intereptorReq) {
    const { showLoading } = config
    const options = intereptorReq ? intereptorReq(config) : this.intereptorReq(config)

    if (showLoading) {
      Taro.showLoading({
        mask: true
      })
    }

    let ret
    try {
      const res = await this.request(options)
      res.config = options
      if (
        res.statusCode === HTTP_STATUS.UNAUTHORIZED &&
        (res.data.data && res.data.data.code) === HTTP_STATUS.TOKEN_NEEDS_REFRESH &&
        S.getAuthToken()
      ) {
        // token失效时重造请求，并刷新token
        if (!this.isRefreshingToken) {
          await this.refreshToken()
        }
        ret = await this.pendingReq(config, intereptorRes, intereptorReq, true)
      } else {
        if (!this.isRefreshingToken || config.noPending) {
          ret = intereptorRes ? intereptorRes(res) : this.intereptorRes(res)
        } else {
          // 正在刷新token，将请求放入队列
          ret = await this.pendingReq(config, intereptorRes, intereptorReq)
        }
      }
    } catch (e) {
      console.log(e)
    }

    if (showLoading) {
      Taro.hideLoading()
    }

    return ret
  }

  pendingReq (config, intereptorRes, intereptorReq, isSend) {
    return new Promise((resolve) => {
      const pendingReq = async () => {
        // 仅加入队列一次
        const reqConfig = {
          ...config,
          noPending: true
        }
        const data = await this.makeReq(reqConfig, intereptorRes, intereptorReq)
        resolve(data)
      }
      this.requestQueue.push(pendingReq)
      if (isSend) this.requestQueue.run()
    })
  }

  get (url, data, config) {
    return this.makeReq({
      ...config,
      url,
      data,
      method: 'GET'
    })
  }

  reqError (res, msg = '') {
    const errMsg = (res.data && res.data.message) || msg
    const err = new Error(errMsg)
    err.res = res
    return err
  }

  post (url, data, config) {
    return this.makeReq({
      ...config,
      url,
      data,
      method: 'POST'
    })
  }

  put (url, data, config) {
    return this.makeReq({
      ...config,
      url,
      data,
      method: 'PUT'
    })
  }

  delete (url, data, config) {
    return this.makeReq({
      ...config,
      url,
      data,
      method: 'DELETE'
    })
  }
}

if (process.env.NODE_ENV === 'production' && !isWeb) {
  Taro.addInterceptor(Taro.interceptors.logInterceptor)
}

console.log('===> process.env.APP_BASE_URL', process.env.APP_BASE_URL)

console.log('===> process.env.APP_MAP_KEY', process.env.APP_MAP_KEY)

export default new API({
  baseURL: process.env.APP_BASE_URL
})

export { API }
