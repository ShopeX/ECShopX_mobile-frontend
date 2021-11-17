import Taro from '@tarojs/taro'
import classNames from 'classnames'
import styleNames from 'stylenames'
import qs from 'qs'
import dayjs from 'dayjs'
import copy from 'copy-to-clipboard'
import S from '@/spx'
import { STATUS_TYPES_MAP } from '@/consts'
import api from '@/api'
import configStore from '@/store'
import _get from 'lodash/get'
import _findKey from 'lodash/findKey'
import _pickBy from 'lodash/pickBy'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import log from './log'
import canvasExp from './canvasExp'
import calCommonExp from './calCommonExp'
import entryLaunch from './entryLaunch'
import validate from './validate'
import { isWeb } from './platforms'
import { getPointName } from './point'

const isPrimitiveType = (val, type) => Object.prototype.toString.call(val) === type
const { store } = configStore()

export function isFunction(val) {
  return isPrimitiveType(val, '[object Function]')
}

export function isNumber(val) {
  return isPrimitiveType(val, '[object Number]')
}

export function isPointerEvent(val) {
  return isPrimitiveType(val, '[object PointerEvent]')
}
/**
 * 保留两个位小数，不足补0
 * @param { Number } value
 */
export const returnFloat = (value) => {
  var value = Math.round(parseFloat(value) * 100) / 100
  var s = value.toString().split('.')
  if (s.length == 1) {
    value = value.toString() + '.00'
    return value
  }
  if (s.length > 1) {
    if (s[1].length < 2) {
      value = value.toString() + '0'
    }
    return value
  }
}
export function isObject(val) {
  return isPrimitiveType(val, '[object Object]')
}

export function isArray(arr) {
  return Array.isArray(arr)
}

export function isString(val) {
  return typeof val === 'string'
}

export function normalizeArray(...args) {
  return args.reduce((ret, item) => ret.concat(item), [])
}

export function getCurrentRoute(router) {
  if (Taro.getEnv() == 'WEAPP' || Taro.getEnv() == 'ALIPAY') {
    // eslint-disable-next-line
    const page = getCurrentPages().pop()
    router = page.$component.$router
  }
  const { path, params: origParams } = router
  const params = _pickBy(origParams, (val) => val !== '')

  const fullPath = `${path}${Object.keys(params).length > 0 ? '?' + qs.stringify(params) : ''}`

  return {
    path,
    fullPath,
    params
  }
}

// 除以100以后的千分符
export function formatPriceToHundred(price) {
  if (price) {
    return (Number(price) / 100)
      .toFixed(2)
      .toString()
      .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
  } else {
    return 0
  }
}

export async function normalizeQuerys(params = {}) {
  const { scene, ...rest } = params
  const queryStr = decodeURIComponent(scene)
  const obj = qs.parse(queryStr)
  if (obj.sid || obj.share_id) {
    const data = await api.wx.getShareId({
      share_id: obj.sid || obj.share_id
    })
    return {
      ...rest,
      ...data
    }
  }
  const ret = {
    ...rest,
    ...obj
  }

  return ret
}

export function pickBy(arr, keyMaps = {}) {
  const picker = (item) => {
    const ret = {}

    Object.keys(keyMaps).forEach((key) => {
      const val = keyMaps[key]

      if (isString(val)) {
        ret[key] = _get(item, val)
      } else if (isFunction(val)) {
        ret[key] = val(item)
      } else if (isObject(val)) {
        ret[key] = _get(item, val.key) || val.default
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

export function navigateTo(url, isRedirect) {
  if (isObject(isRedirect) || isPointerEvent(isRedirect)) {
    isRedirect = false
  }

  if (isRedirect) {
    return Taro.redirectTo({ url })
  }

  return Taro.navigateTo({ url })
}

export function resolvePath(baseUrl, params = {}) {
  const queryStr = typeof params === 'string' ? params : qs.stringify(params)

  return `${baseUrl}${baseUrl.indexOf('?') >= 0 ? '&' : '?'}${queryStr}`
}

export function formatTime(time, formatter = 'YYYY-MM-DD') {
  const newTime = time.toString().length < 13 ? time * 1000 : time
  return dayjs(newTime).format(formatter)
}

export function formatDateTime(time, formatter = 'YYYY-MM-DD HH:mm:ss') {
  const newTime = time.toString().length < 13 ? time * 1000 : time
  return dayjs(newTime, formatter)
}

export function copyText(text, msg = '内容已复制') {
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

export function calcTimer(totalSec) {
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

export function resolveOrderStatus(status, isBackwards) {
  if (isBackwards) {
    return _findKey(STATUS_TYPES_MAP, (o) => o === status)
  }

  return STATUS_TYPES_MAP[status]
}

export function goToPage(page) {
  // eslint-disable-next-line
  const loc = location
  page = page.replace(/^\//, '')
  const url = `${loc.protocol}//${loc.host}/${page}`
  console.log(url)
  loc.href = url
}

export function maskMobile(mobile) {
  return mobile.replace(/^(\d{2})(\d+)(\d{2}$)/, '$1******$3')
}

// 不可使用promise/async异步写法
export function authSetting(scope, succFn, errFn) {
  Taro.getSetting({
    success(res) {
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

export function imgCompression(url) {
  const rule = '?imageView2/1/w/80'
  return url + rule
}

export const browser = (() => {
  if (process.env.TARO_ENV === 'h5') {
    var ua = navigator.userAgent
    return {
      trident: ua.indexOf('Trident') > -1, //IE内核
      presto: ua.indexOf('Presto') > -1, //opera内核
      webKit: ua.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1, //火狐内核
      mobile: !!ua.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1, //android终端
      weixin: ua.match(/MicroMessenger/i),
      qq: ua.match(/\sQQ/i) == ' qq', //是否QQ
      isWeapp:
        (ua.match(/MicroMessenger/i) && ua.match(/miniprogram/i)) ||
        global.__wxjs_environment === 'miniprogram',
      isAlipay: ua.match(/AlipayClient/i)
    }
  }
})()

export const getBrowserEnv = () => {
  if (process.env.TARO_ENV === 'h5') {
    const ua = navigator.userAgent
    return {
      trident: ua.indexOf('Trident') > -1, //IE内核
      presto: ua.indexOf('Presto') > -1, //opera内核
      webKit: ua.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1, //火狐内核
      mobile: !!ua.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1, //android终端
      weixin: ua.match(/MicroMessenger/i),
      qq: ua.match(/\sQQ/i) == ' qq', //是否QQ
      isWeapp:
        (ua.match(/MicroMessenger/i) && ua.match(/miniprogram/i)) ||
        global.__wxjs_environment === 'miniprogram',
      isAlipay: ua.match(/AlipayClient/i)
    }
  }
}

// 注入美洽客服插件
export const meiqiaInit = () => {
  ;(function(m, ei, q, i, a, j, s) {
    m[i] =
      m[i] ||
      function() {
        ;(m[i].a = m[i].a || []).push(arguments)
      }
    ;(j = ei.createElement(q)), (s = ei.getElementsByTagName(q)[0])
    j.async = true
    j.charset = 'UTF-8'
    j.src = 'https://static.meiqia.com/dist/meiqia.js?_=t'
    s.parentNode.insertBefore(j, s)
  })(window, document, 'script', '_MEIQIA')
}

export function tokenParse(token) {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  console.log('Taro.base64ToArrayBuffer', Taro)
  var arr_base64 = Taro.base64ToArrayBuffer(base64)
  arr_base64 = String.fromCharCode.apply(null, new Uint8Array(arr_base64))
  var jsonPayload = decodeURIComponent(
    arr_base64
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}

// 解析字符串
function getQueryVariable(herf) {
  const url = herf.split('?')
  let query = {}
  if (url[1]) {
    const str = url[1]
    // const str = url.substr(1)
    const pairs = str.split('&')
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=')
      query[pair[0]] = pair[1]
    }
  }
  return query
}
/** 是否是合法的color */
function validColor(color) {
  var re1 = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i
  var re2 = /^rgb\(([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\)$/i
  var re3 = /^rgba\(([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,(1|1.0|0.[0-9])\)$/i
  return re2.test(color) || re1.test(color) || re3.test(color)
}

/**
 * 导购埋点上报
 * @param {
 *  event_type: {
 *  activeItemDetail 分享商品详情页
 *  activeSeedingDetail 分享种草详情页
 *  activeDiscountCoupon 分享优惠券
 *  activeCustomPage 分享自定义页面
 *  orderPaymentSuccess 订单支付成功
 * }
 * } data 新增上报数据
 */
export async function buriedPoint(data) {
  const params = this.$router.params
  let {
    gu,
    subtask_id = '',
    dtid = '',
    shop_code = '',
    item_id = '',
    smid = '',
    gu_user_id = ''
  } = await normalizeQuerys(params)
  let employee_number = smid,
    store_bn = ''
  if (gu) {
    ;[employee_number, store_bn] = gu.split('_')
  }
  if (gu_user_id) {
    employee_number = gu_user_id
  }
  // 任务埋点
  if (subtask_id) {
    const { distributor_id: shopId } = Taro.getStorageSync('curStore')
    if (process.env.APP_PLATFORM === 'standard') {
      dtid = shopId
    }
    const newData = {
      employee_number,
      store_bn,
      subtask_id,
      distributor_id: dtid,
      shop_code,
      item_id,
      ...data
    }
    api.wx.taskReportData(newData)
  }
  if (data.event_type && S.getAuthToken() && employee_number) {
    const { userId } = Taro.getStorageSync('userinfo')
    api.wx.interactiveReportData({
      event_id: employee_number,
      user_type: 'wechat',
      user_id: userId,
      event_type: data.event_type,
      store_bn
    })
  }
}

/**
 * 参数拼接
 *
 */

export function paramsSplice(params) {
  let str = ''
  let arr = []
  for (var key in params) {
    let p = `${key}=${params[key]}`
    arr.push(p)
  }
  str = arr.join('&')
  return str
}

export function resolveFavsList(list, favs) {
  return list.map((t) => {
    const { item_id } = t
    return {
      ...t,
      is_fav: Boolean(favs[item_id])
    }
  })
}

// 判断是否在导购货架
export function isGoodsShelves() {
  const system = Taro.getSystemInfoSync()
  log.debug(`this system is: ${system.environment}`)
  if (system && system.environment && system.environment === 'wxwork') {
    return true
  } else {
    return false
  }
}

export function getThemeStyle() {
  const result = store.getState()
  if (typeof result.system != 'undefined') {
    const { colorPrimary, colorMarketing, colorAccent } = result.system
    return {
      '--color-primary': colorPrimary,
      '--color-marketing': colorMarketing,
      '--color-accent': colorAccent
    }
  }
}

export function showToast(title) {
  Taro.showToast({
    title,
    icon: 'none'
  })
}

export function isNavbar() {
  return isWeb && !getBrowserEnv().weixin
}

export {
  classNames,
  styleNames,
  log,
  debounce,
  throttle,
  calCommonExp,
  canvasExp,
  getQueryVariable,
  validColor,
  entryLaunch,
  validate,
  getPointName
}
export * from './platforms'
