import Taro, { getCurrentInstance } from '@tarojs/taro'
import classNames from 'classnames'
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
import _keys from 'lodash/keys'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import log from './log'
import canvasExp from './canvasExp'
import calCommonExp from './calCommonExp'
import entryLaunch from './entryLaunch'
import validate from './validate'
import checkAppVersion from './updateManager'
import linkPage from './linkPage'

const store = configStore()

export * from './platforms'

const isPrimitiveType = (val, type) => Object.prototype.toString.call(val) === type

export function isFunction (val) {
  return isPrimitiveType(val, '[object Function]')
}

export function isNumber (val) {
  return isPrimitiveType(val, '[object Number]')
}

export function isPointerEvent (val) {
  return isPrimitiveType(val, '[object PointerEvent]')
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

/** 在支付宝平台 */
export const isAlipay = Taro.getEnv() == Taro.ENV_TYPE.ALIPAY

/** 在微信平台 */
export const isWeixin = Taro.getEnv() == Taro.ENV_TYPE.WEAPP

/** 在H5平台 */
export const isWeb = Taro.getEnv() == Taro.ENV_TYPE.WEB

export const getBrowserEnv = () => {
  const ua = navigator.userAgent
  // console.log( `user-agent:`, ua );
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

/** 在H5平台(微信浏览器) */
export const isWxWeb = isWeb && !!getBrowserEnv().weixin

export function isObjectValueEqual (a, b) {
  var aProps = Object.getOwnPropertyNames(a)
  var bProps = Object.getOwnPropertyNames(b)
  if (aProps.length != bProps.length) {
    return false
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i]
    if (a[propName] !== b[propName]) {
      return false
    }
  }
  return true
}

export const isIphoneX = () => {
  if (isWeixin) {
    try {
      const {
        model,
        system,
        windowWidth,
        windowHeight,
        screenHeight,
        screenWidth,
        pixelRatio,
        brand
      } = Taro.getSystemInfoSync()
      const { networkType } = Taro.getNetworkType()

      let px = screenWidth / 750 //rpx换算px iphone5：1rpx=0.42px

      Taro.$systemSize = {
        windowWidth,
        windowHeight,
        screenHeight,
        screenWidth,
        model,
        px,
        pixelRatio,
        brand,
        system,
        networkType
      }
      if (system.indexOf('iOS') !== -1) {
        Taro.$system = 'iOS'
      }
      S.set('ipxClass', model.toLowerCase().indexOf('iphone x') >= 0 ? 'is-ipx' : '')
    } catch (e) {
      console.log(e)
    }
  }
}

// TODO: 验证方法在h5及边界情况稳定性
export function getCurrentRoute () {
  const router = getCurrentInstance().router
  // eslint-disable-next-line
  const { $taroTimestamp, ...params } = router.params || {}
  const path = router.path
  const fullPath = `${path}${Object.keys(params).length > 0 ? '?' + qs.stringify(params) : ''}`

  return {
    path,
    fullPath,
    params
  }
}

// 除以100以后的千分符
export function formatPriceToHundred (price) {
  if (price) {
    return (Number(price) / 100)
      .toFixed(2)
      .toString()
      .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
  } else {
    return 0
  }
}

export async function normalizeQuerys (params = {}) {
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

export function pickBy (arr = [], keyMaps = {}) {
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

export function navigateTo (url, isRedirect) {
  if (isObject(isRedirect) || isPointerEvent(isRedirect)) {
    isRedirect = false
  }

  if (isRedirect) {
    return Taro.redirectTo({ url })
  }

  return Taro.navigateTo({ url })
}

export function resolvePath (baseUrl, params = {}) {
  const queryStr = typeof params === 'string' ? params : qs.stringify(params)

  return `${baseUrl}${baseUrl.indexOf('?') >= 0 ? '&' : '?'}${queryStr}`
}

export function formatTime (time, formatter = 'YYYY-MM-DD') {
  const newTime = time.toString().length < 13 ? time * 1000 : time
  return dayjs(newTime).format(formatter)
}

export function formatDateTime (time, formatter = 'YYYY-MM-DD HH:mm:ss') {
  const newTime = time.toString().length < 13 ? time * 1000 : time
  return dayjs(newTime).format(formatter)
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
    return _findKey(STATUS_TYPES_MAP, (o) => o === status)
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

// 注入美洽客服插件
export const meiqiaInit = () => {
  ;(function (m, ei, q, i, a, j, s) {
    m[i] =
      m[i] ||
      function () {
        ;(m[i].a = m[i].a || []).push(arguments)
      }
    ;(j = ei.createElement(q)), (s = ei.getElementsByTagName(q)[0])
    j.async = true
    j.charset = 'UTF-8'
    j.src = 'https://static.meiqia.com/dist/meiqia.js?_=t'
    s.parentNode.insertBefore(j, s)
  })(window, document, 'script', '_MEIQIA')
}

const redirectUrl = async (api, url, type = 'redirectTo') => {
  if (!browser.weixin) {
    Taro[type]({ url })
    return
  }
  let newUrl = getUrl(url)
  let { redirect_url } = await api.wx.getredirecturl({ url: newUrl })
  global.location.href = redirect_url
}

const getUrl = (url) => {
  let href = global.location.href
  let hrefList = href.split('/')

  return `${hrefList[0]}//${hrefList[2]}${url}`
}

export function tokenParse (token) {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  console.log('Taro.base64ToArrayBuffer', Taro)
  var arr_base64 = Taro.base64ToArrayBuffer(base64)
  arr_base64 = String.fromCharCode.apply(null, new Uint8Array(arr_base64))
  var jsonPayload = decodeURIComponent(
    arr_base64
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}

// 解析字符串
function getQueryVariable (herf) {
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
function validColor (color) {
  var re1 = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i
  var re2 =
    /^rgb\(([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\)$/i
  var re3 =
    /^rgba\(([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,([0-9]|[0-9][0-9]|25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9])\,(1|1.0|0.[0-9])\)$/i
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
export async function buriedPoint (data) {
  const params = getCurrentInstance().router.params
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

export function paramsSplice (params) {
  let str = ''
  let arr = []
  for (var key in params) {
    let p = `${key}=${params[key]}`
    arr.push(p)
  }
  str = arr.join('&')
  return str
}

export function resolveFavsList (list, favs) {
  return list.map((t) => {
    const { item_id } = t
    return {
      ...t,
      is_fav: Boolean(favs[item_id])
    }
  })
}

// 判断是否在导购货架
export function isGoodsShelves () {
  const system = Taro.getSystemInfoSync()
  log.debug(`this system is: ${system.environment}`)
  if (system && system.environment && system.environment === 'wxwork') {
    return true
  } else {
    return false
  }
}

export function styleNames (styles) {
  if (!styles || typeof styles !== 'object') {
    return '""'
  }
  let styleNames = ''
  _keys(styles).forEach((key) => {
    if (typeof styles[key] === 'string') {
      styleNames += `${key}:${styles[key]};`
      return
    }
    if (typeof styles[key] !== 'object' || styles[key].length === 0) {
      return
    }
    let conditions = styles[key]

    _keys(conditions).forEach((value) => {
      if (
        (typeof conditions[value] !== 'function' && conditions[value]) ||
        (typeof conditions[value] === 'function' && conditions[value]())
      ) {
        styleNames += `${key}:${value};`
        return
      }
    })
  })
  return `${styleNames}`
}

export function getThemeStyle () {
  const result = store.getState()
  const { colorPrimary, colorMarketing, colorAccent, rgb } = result.sys
  return {
    '--color-primary': colorPrimary,
    '--color-marketing': colorMarketing,
    '--color-accent': colorAccent,
    '--color-rgb': rgb
  }
}

export function isNavbar () {
  return isWeb && !getBrowserEnv().weixin
}

export const hasNavbar = isWeb && !getBrowserEnv().weixin

export function showToast (title) {
  Taro.showToast({
    title,
    icon: 'none'
  })
}

export function hex2rgb (hex) {
  if (![4, 7].includes(hex.length)) {
    throw new Error('格式错误')
  }
  let result = hex.slice(1)
  // 如果是颜色叠值, 统一转换成6位颜色值
  if (result.length === 3) {
    result = result
      .split('')
      .map((a) => `${a}${a}`)
      .join('')
  }
  const rgb = []
  // 计算hex值
  for (let i = 0, len = result.length; i < len; i += 2) {
    rgb[i / 2] = getHexVal(result[i]) * 16 + getHexVal(result[i + 1])
  }
  function getHexVal (letter) {
    let num = -1
    switch (letter.toUpperCase()) {
      case 'A':
        num = 10
        break
      case 'B':
        num = 11
        break
      case 'C':
        num = 12
        break
      case 'D':
        num = 13
        break
      case 'E':
        num = 14
        break
      case 'F':
        num = 15
        break
    }

    if (num < 0) {
      num = Number(letter)
    }

    return num
  }
  return rgb
}

export function exceedLimit ({ size: fileSize }) {
  const size = fileSize / 1024 / 1024
  return size > 2
}

function isBase64 (str) {
  if (str.indexOf('data:') != -1 && str.indexOf('base64') != -1) {
    return true
  } else {
    return false
  }
}

//判断是否是商家入驻
const isMerchantModule = (() => {
  if (!isWeb) return false
  return /\/subpages\/merchant/.test(location.pathname)
})()

function isUndefined (val) {
  return typeof val === 'undefined'
}

export {
  classNames,
  log,
  debounce,
  throttle,
  calCommonExp,
  canvasExp,
  getQueryVariable,
  validColor,
  entryLaunch,
  validate,
  checkAppVersion,
  linkPage,
  redirectUrl,
  isBase64,
  isMerchantModule,
  isUndefined
}

export * from './platforms'

export * from './system'

export * from './store'
