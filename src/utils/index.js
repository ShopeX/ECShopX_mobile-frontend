import classNames from 'classnames'
import styleNames from 'stylenames'
import Taro from '@tarojs/taro'
import qs from 'qs'
import moment from 'moment'
import copy from 'copy-to-clipboard'
import S from '@/spx'

export { default as log } from './log'

const isPrimitiveType = (val, type) => Object.prototype.toString.call(val) === type

export function isFunction (val) {
  return isPrimitiveType(val, '[object Function]')
}

export function isNumber (val) {
  return isPrimitiveType(val, '[object Number]')
}

export function isObject (val) {
  return isPrimitiveType(val, '[object Object]')
}

export function isArray (arr) {
  return Array.isArray(arr)
}

export function isString (val) {
  return typeof val === 'string'
}

export function normalizeArray (...args) {
  return args.reduce((ret, item) => ret.concat(item), [])
}

export function getCurrentRoute (router) {
  const { params, path } = router
  const fullPath = `${path}${params ? '?' + qs.stringify(params) : ''}`

  return {
    path,
    fullPath,
    params
  }
}

export function normalizeQuerys (params = {}) {
  const { scene, ...rest } = params
  const queryStr = decodeURIComponent(scene)

  const ret = {
    ...rest,
    ...qs.parse(queryStr)
  }

  return ret
}

export function resolvePath (baseUrl, params = {}) {
  const queryStr = typeof params === 'string'
    ? params
    : qs.stringify(params)

  return `${baseUrl}${baseUrl.indexOf('?') >= 0 ? '&' : '?'}${queryStr}`
}

export function formatTime (time, formatter = 'YYYY-MM-DD') {
  return moment(time).format(formatter)
}

export function copyText (text, msg = '内容已复制') {
  return new Promise((resolve, reject) => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.setClipboardData({
        data: text,
        success: resolve
      })
    } else {
      if (copy(Text)) {
        S.toast(msg)
        resolve(text)
      }
    }
  })
}

export {
  classNames,
  styleNames
}