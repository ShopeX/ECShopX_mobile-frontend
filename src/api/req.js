import Taro from '@tarojs/taro'
import S from '@/spx'
import qs from 'qs'

function addQuery (url, query) {
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + query
}


class API {
  constructor (options = {}) {
    let { baseURL = '/' } = options
    if (!/\/$/.test(baseURL)) {
      baseURL = baseURL + '/'
    }

    this.options = options
    this.baseURL = baseURL
    this.genMethods(['get', 'post', 'delete', 'put'])
  }

  genMethods (methods) {
    methods.forEach((method) => {
      this[method] = (url, data, config = {}) => this.makeReq({
        ...config,
        method,
        url,
        data
      })
    })
  }

  errorToast (data) {
    const errMsg = data.msg || data.err_msg || (data.error && data.error.message) || '操作失败，请稍后重试'
    setTimeout(() => {
      Taro.showToast({
        icon: 'none',
        title: errMsg
      })
    }, 200)
  }

  makeReq (config) {
    const { url, data, header = {}, method = 'GET', showLoading, showError = true } = config
    const methodIsGet = method.toLowerCase() === 'get'

    let reqUrl = /^http/.test(url) ? url : `${this.baseURL}${url.replace(/^\//, '')}`
    const query = (!data || typeof data === 'string')
      ? qs.parse(data)
      : data

    if (!methodIsGet) {
      header['content-type'] = header['content-type'] || 'application/x-www-form-urlencoded'
    }
    header['Authorization'] = `Bearer ${S.getAuthToken()}`

    const options = {
      ...config,
      url: reqUrl,
      data: query,
      method: method.toUpperCase(),
      header: header
    }

    if (showLoading) {
      Taro.showLoading({
        mask: true
      })
    }

    // TODO: update taro version
    // if (this.options.interceptor && Taro.addInterceptor) {
    //   Taro.addInterceptor(this.options.interceptor)
    // }
    options.data = {
      ...(options.data || {}),
      company_id: APP_COMPANY_ID
    }
    if (options.method === 'GET') {
      options.url = addQuery(options.url, qs.stringify(options.data))
      delete options.data
    } else {
      // nest data
      options.data = qs.stringify(options.data)
    }

    return Taro.request(options)
      .then(res => {
        // eslint-disable-next-line
        const { data, statusCode, header } = res
        if (showLoading) {
          Taro.hideLoading()
        }

        if (statusCode >= 200 && statusCode < 300) {
          if (data.data !== undefined) {
            if (options.url.indexOf('token/refresh') >= 0) {
              data.data.token = res.header.authorization
            }
            return data.data
          } else {
            if (showError) {
              this.errorToast(data)
            }
            return Promise.reject(this.reqError(res))
          }
        }

        if (statusCode === 401) {
          S.logout()
          if (showError) {
            data.err_msg = data.err_msg || '授权过期请重新授权'
            this.errorToast(data)
          }
          Taro.redirectTo({
            url: '/pages/auth/login'
          })
          return Promise.reject(this.reqError(res))
        }

        if (statusCode >= 400) {
          if (showError) {
            this.errorToast(data)
          }
          return Promise.reject(this.reqError(res))
        }

        return Promise.reject(this.reqError(res, `API error: ${statusCode}`))
      })
  }

  reqError (res, msg = '') {
    const data = (res.data || {})
    const errMsg = data.msg || data.err_msg || msg
    const err = new Error(errMsg)
    err.res = res
    return err
  }
}

export default new API({
  baseURL: APP_BASE_URL,

  // interceptor (chain) {
  //   const { requestParams } = chain
  //   requestParams.company_id = '1'

  //   return chain.proceed(requestParams)
  // }
})

export { API }
