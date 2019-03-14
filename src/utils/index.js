import classNames from 'classnames'
import styleNames from 'stylenames'
import Taro from '@tarojs/taro'
import qs from 'qs'
import moment from 'moment'
import copy from 'copy-to-clipboard'
import S from '@/spx'
import { STATUS_TYPES_MAP } from '@/consts'
import _get from 'lodash/get'
import _findKey from 'lodash/findKey'
import _pickBy from 'lodash/pickBy'
import log from './log'

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
  if (process.env.TARO_ENV === 'weapp') {
    // eslint-disable-next-line
    const page = getCurrentPages().pop()
    router = page.$component.$router
  }
  const { path, params: origParams } = router
  const params = _pickBy(origParams, val => val !== '')

  const fullPath = `${path}${Object.keys(params).length > 0 ? '?' + qs.stringify(params) : ''}`

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

export function pickBy (arr, keyMaps = {}) {
  const picker = (item) => {
    const ret = {}

    Object.keys(keyMaps).forEach(key => {
      const val = keyMaps[key]

      if (isString(val)) {
        ret[key] = _get(item, val)
      } else if (isFunction(val)) {
        ret[key] = val(item)
      } else {
        ret[key] = val
      }
    })

    return ret
  }

  if (isArray(arr)) {
    return arr.map(picker)
  } else {
    return picker(arr)
  }
}

export function navigateTo (url, isRedirect) {
  if (isObject(isRedirect)) {
    isRedirect = false
  }
  return Taro[!isRedirect ? 'navigateTo' : 'redirectTo']({
    url
  })
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

export function formatDataTime (time, formatter = 'YYYY-MM-DD hh:mm:ss') {
  return moment(time).format(formatter)
}

export function copyText (text, msg = '内容已复制') {
  return new Promise((resolve, reject) => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.setClipboardData({
        data: text,
        success: resolve,
        error: reject
      })
    } else {
      if (copy(text)) {
        S.toast(msg)
        resolve(text)
      } else {
        reject()
      }
    }
  })
}

export function resolveOrderStatus (status, isBackwards) {
  if (isBackwards) {
    return _findKey(STATUS_TYPES_MAP, o => o === status)
  }

  return STATUS_TYPES_MAP[status]
}

export {
  classNames,
  styleNames,
  log
}
