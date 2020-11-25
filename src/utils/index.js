import Taro from '@tarojs/taro'
import classNames from 'classnames'
import qs from 'qs'
// import moment from 'moment'
import format from 'date-fns/format'
import copy from 'copy-to-clipboard'
import S from '@/spx'
import { STATUS_TYPES_MAP } from '@/consts'
import _get from 'lodash/get'
import _findKey from 'lodash/findKey'
import _pickBy from 'lodash/pickBy'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import log from './log'
import canvasExp from './canvasExp'
import calCommonExp from './calCommonExp'

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

  if (isRedirect) {
    return Taro.redirectTo({ url })
  }

  return Taro.navigateTo({ url })
}

export function resolvePath (baseUrl, params = {}) {
  const queryStr = typeof params === 'string'
    ? params
    : qs.stringify(params)

  return `${baseUrl}${baseUrl.indexOf('?') >= 0 ? '&' : '?'}${queryStr}`
}

export function formatTime (time, formatter = 'yyyy-MM-dd') {
  const newTime = time.toString().length < 13 ? time * 1000 : time
  return format(newTime, formatter)
}

export function formatDataTime (time, formatter = 'yyyy-MM-dd HH:mm:ss') {
  const newTime = time.toString().length < 13 ? time * 1000 : time
  return format(newTime, formatter)
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

export function calcTimer (totalSec) {
  let remainingSec = totalSec
  const dd = Math.floor(totalSec / 24 / 3600)
  remainingSec -= dd * 3600 * 24
  const hh = Math.floor(remainingSec / 3600)
  remainingSec -= hh * 3600
  const mm = Math.floor(remainingSec / 60)
  remainingSec -= mm * 60
  const ss = Math.floor(remainingSec)

  return {
    dd,
    hh,
    mm,
    ss
  }
}

export function resolveOrderStatus (status, isBackwards) {
  if (isBackwards) {
    return _findKey(STATUS_TYPES_MAP, o => o === status)
  }

  return STATUS_TYPES_MAP[status]
}

export function goToPage (page) {
  // eslint-disable-next-line
  const loc = location
  page = page.replace(/^\//, '')
  const url = `${loc.protocol}//${loc.host}/${page}`
  console.log(url)
  loc.href = url
}

export function maskMobile (mobile) {
  return mobile.replace(/^(\d{2})(\d+)(\d{2}$)/, '$1******$3')
}

// 不可使用promise/async异步写法
export function authSetting (scope, succFn, errFn) {
  Taro.getSetting({
    success (res) {
      const result = res.authSetting[`scope.${scope}`]
      if (result === undefined) {
        Taro.authorize({
          scope: `scope.${scope}`
        }).then(succFn, errFn)
      } else if (!result) {
        Taro.openSetting().then(succFn, errFn)
      } else {
        succFn()
      }
    }
  })
}

export function imgCompression (url) {
  const rule = '?imageView2/1/w/80'
  return url +  rule
}


export const browser = (() => {
  if (process.env.TARO_ENV === 'h5') {
    var ua = navigator.userAgent
    return {
      trident: ua.indexOf('Trident') > -1, //IE内核
      presto: ua.indexOf('Presto') > -1, //opera内核
      webKit: ua.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1,//火狐内核
      mobile: !!ua.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1, //android终端
      weixin: ua.match(/MicroMessenger/i),
      qq: ua.match(/\sQQ/i) == " qq", //是否QQ
      isWeapp: (ua.match(/MicroMessenger/i) && ua.match(/miniprogram/i)) || global.__wxjs_environment === 'miniprogram',
      isAlipay: ua.match(/AlipayClient/i)
    }
  }
})()

// 注入美洽客服插件
export const meiqiaInit = () => {
  (function(m, ei, q, i, a, j, s) {
    m[i] = m[i] || function() {
        (m[i].a = m[i].a || []).push(arguments)
    };
    j = ei.createElement(q),
        s = ei.getElementsByTagName(q)[0];
    j.async = true;
    j.charset = 'UTF-8';
    j.src = 'https://static.meiqia.com/dist/meiqia.js?_=t';
    s.parentNode.insertBefore(j, s);
  })(window, document, 'script', '_MEIQIA');
}

export function tokenParse(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var arr_base64 = wx.base64ToArrayBuffer(base64);
  arr_base64 = String.fromCharCode.apply(null, new Uint8Array(arr_base64));
  var jsonPayload = decodeURIComponent(
    arr_base64
      .split("")
      .map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}


export {
  classNames,
  log,
  debounce,
	throttle,
	calCommonExp,
  canvasExp
}
