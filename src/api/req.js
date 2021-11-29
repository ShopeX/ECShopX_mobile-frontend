import Taro from '@tarojs/taro'
import S from '@/spx'

import api from '@/api'
import qs from 'qs'

import { isAlipay, isWeb } from '@/utils'
import log from '@/utils/log'

function addQuery(url, query) {
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + query
}

class RequestQueue {
  constructor() {
    this.requestList = []
  }

  push(req) {
    this.requestList.push(req)
  }

  async run() {
    const request = this.requestList.shift()
    log.debug(`requestQueue length is ${this.requestList.length}`)
    if (request) {
      await request()
      if (this.requestList.length > 0 && !API.isRefreshing) {
        this.run()
      }
    }
  }
}

const requestQueue = new RequestQueue()

class API {
  constructor(options = {}) {
    console.log('constructor',API)
    let { baseURL = '/' } = options
    if (!/\/$/.test(baseURL)) {
      baseURL = baseURL + '/'
    }

    options.company_id = process.env.APP_COMPANY_ID

    // if (process.env.TARO_ENV === 'weapp' || isAlipay) {
    //   const extConfig = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {}
    //   options.appid = extConfig.appid
    //   if (extConfig.company_id) {
    //     options.company_id = extConfig.company_id
    //   }
    // }

    this.options = options
    this.baseURL = baseURL
    this.genMethods(['get', 'post', 'delete', 'put'])
  }

  static isRefreshing = false

  genMethods(methods) {
    methods.forEach((method) => {
      this[method] = (url, data, config = {}) =>
        this.makeReq({
          ...config,
          method,
          url,
          data
        })
    })
  }

  errorToast(data) {
    let errMsg = data.message || '操作失败，请稍后重试'

    let newText = ''
    if (errMsg.length > 11) {
      newText = errMsg.substring(0, 11) + '\n' + errMsg.substring(11)
    } else {
      newText = errMsg
    }
    setTimeout(() => {
      Taro.showToast({
        icon: 'none',
        title: newText
      })
    }, 200)
  }

  makeReq(config) {
    const { url, data, header = {}, method = 'GET', showLoading, showError = true } = config
    const methodIsGet = method.toLowerCase() === 'get'

    let reqUrl = /^http/.test(url) ? url : `${this.baseURL}${url.replace(/^\//, '')}`
    const query = !data || typeof data === 'string' ? qs.parse(data) : data

    if (!methodIsGet) {
      header['content-type'] = header['content-type'] || 'application/x-www-form-urlencoded'
    }

    const token = S.getAuthToken()
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    const { company_id, appid } = this.options
    if (process.env.TARO_ENV === 'weapp' || isAlipay) {
      if (appid) {
        header['authorizer-appid'] = appid
      }
    }

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

    options.data = {
      ...(options.data || {}),
      company_id
    }
    if (options.method === 'GET') {
      options.url = addQuery(options.url, qs.stringify(options.data))
      delete options.data
    } else {
      // nest data
      if (isAlipay && options.method === 'DELETE') {
        options.url = addQuery(options.url, qs.stringify(options.data))
        options.data = options.data
        options.dataType = 'json'
        options.headers = options.header
        options.responseType = 'text'
        options.responseCharset = 'utf-8'
      } else {
        options.data = qs.stringify(options.data)
      }
    }

    const _this = this
    console.log('Taro.request( config )',config)
    console.log('Taro.request( this.options )',this.options)
    console.log('Taro.request( options )',options)
    return Taro.request( options ).then( ( res ) => {
      // debugger;
      if (showLoading) {
        Taro.hideLoading()
      }
      const { statusCode } = res
      const { data } = res.data
      if ( statusCode >= 200 && statusCode < 300 ) {
        const { status_code, message, code } = data
        if ( status_code ) {
          if ( status_code == 401 ) {
            if ( code == 401001 ) {
              requestQueue.push( () => {
                return new Promise( ( resolve, reject ) => {
                  resolve( _this.makeReq( config ) )
                } )
              } )
              if ( !API.isRefreshing ) {
                API.isRefreshing = true
                api.wx
                  .refreshToken()
                  .then( ( res ) => {
                    // log.debug( `token refresh success: ${res.token}` )
                    API.isRefreshing = false
                    S.setAuthToken( res.token )
                    requestQueue.run()
                  } )
                  .catch( ( e ) => {
                    API.isRefreshing = false
                    Taro.redirectTo( { url: '/pages/member/index' } )
                  } )
                  .finally( () => {
                    API.isRefreshing = false
                  } )
              }
            } else if ( code == 401002 ) {
              this.errorToast( {
                msg: '帐号已被禁用'
              } )
              return Promise.reject( this.reqError( data, '帐号已被禁用' ) )
            } else {
              S.setAuthToken( '' )
              Taro.redirectTo( { url: '/pages/member/index' } )
            }

          } else {
            this.errorToast( data )
            return Promise.reject( this.reqError( data ) )
          }
        } else {
          if ( options.url.indexOf( 'token/refresh' ) >= 0 ) {
            data['token'] = res.header.Authorization.replace( 'Bearer ', '' )
          }
          return data
        }
      } else {
        return Promise.reject( this.reqError( data, `API error: ${statusCode}` ) )
      }
    } ).catch( e => {
      return Promise.reject( this.reqError( {
        message: e.statusText,
        statusCode: e.status
      }))
    })
  }

  reqError(res, msg = '') {
    const errMsg = res.message || msg
    const err = new Error(errMsg)
    err.res = res
    err.code = res.statusCode
    return err
  }
}

export default new API({
  baseURL:"https://ecshopx.shopex123.com/index.php/api/h5app/wxapp"
  //  process.env.APP_BASE_URL
})

// export default Taro.request

// export { API }
