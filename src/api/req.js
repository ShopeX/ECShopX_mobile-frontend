import Taro from '@tarojs/taro'
import S from '@/spx'
import qs from 'qs'

// function addQuery (url, query) {
//   return url + (url.indexOf('?') >= 0 ? '&' : '?') + query
// }

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
      company_id: 1
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
            return data.data
          } else {
            const errMsg = data.msg || data.err_msg || '操作失败，请稍后重试'
            if (showError) {
              setTimeout(() => {
                Taro.showToast({
                  icon: 'none',
                  title: errMsg
                })
              }, 200)
            }
            return Promise.reject(this.reqError(res))
          }
        }

        if (statusCode === 401) {
          Taro.showToast({
            icon: 'none',
            title: data.msg || data.err_msg || '授权过期请重新授权'
          })
          return S.logout()
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
  baseURL: TARO_APP.BASE_URL,

  // interceptor (chain) {
  //   const { requestParams } = chain
  //   requestParams.company_id = '1'

  //   return chain.proceed(requestParams)
  // }
})

export { API }
