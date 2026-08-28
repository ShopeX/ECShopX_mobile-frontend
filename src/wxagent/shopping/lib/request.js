/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子接口环境的 ecshopx-api 请求桥接。
 *
 * 与小程序主包 `src/api/req.js` 的鉴权/解包约定保持一致：
 *  - 鉴权：Authorization: Bearer <token>；token 存于 storage 的 `token` 键（与 Taro 端 SG_TOKEN 共享）
 *  - 多租户：company_id（query）+ authorizer-appid（header）来自 ext.json
 *  - 返回：HTTP 200 且 body.data.status_code 为假值时，业务数据在 body.data；否则视为业务错误
 *  - 401：登录态失效，交由调用方/中间件处理
 *
 * 原子接口环境支持 wx.request / wx.login（见官方「API 支持列表」），但不支持 Taro。
 */
var config = require('./config')

var TOKEN_KEY = 'token'

function getToken() {
  try {
    return wx.getStorageSync(TOKEN_KEY) || ''
  } catch (e) {
    return ''
  }
}

function setToken(token) {
  try {
    wx.setStorageSync(TOKEN_KEY, token)
  } catch (e) {
    /* ignore */
  }
}

function buildQuery(data) {
  var parts = []
  Object.keys(data || {}).forEach(function (k) {
    var v = data[k]
    if (v === undefined || v === null) return
    parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(v))
  })
  return parts.join('&')
}

function buildHeader(extraHeader) {
  var header = Object.assign(
    { 'content-type': 'application/x-www-form-urlencoded' },
    extraHeader || {}
  )
  var token = getToken()
  if (token) header['Authorization'] = 'Bearer ' + token
  var appid = config.getAppId()
  if (appid) header['authorizer-appid'] = appid
  return header
}

/**
 * 发起一次请求并按主包约定解包。
 * @param {Object} opts { url, method, data, header }
 * @returns {Promise<any>} resolve 业务数据（body.data），reject Error（带 .statusCode）
 */
function request(opts) {
  var method = (opts.method || 'GET').toUpperCase()
  var data = Object.assign({}, opts.data || {})
  var companyId = config.getCompanyId()
  if (companyId) data.company_id = companyId

  var base = config.getBaseURL()
  var url = /^https?:\/\//.test(opts.url) ? opts.url : base + '/' + String(opts.url).replace(/^\//, '')

  var reqData = data
  if (method === 'GET') {
    var qs = buildQuery(data)
    if (qs) url += (url.indexOf('?') >= 0 ? '&' : '?') + qs
    reqData = undefined
  } else {
    reqData = buildQuery(data)
  }

  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: reqData,
      header: buildHeader(opts.header),
      success: function (res) {
        var statusCode = res.statusCode
        var body = res.data || {}
        if (statusCode === 200) {
          var payload = body.data || {}
          if (!payload.status_code) {
            resolve(payload)
          } else {
            var be = new Error((payload && payload.message) || '业务处理失败')
            be.statusCode = statusCode
            be.payload = payload
            reject(be)
          }
          return
        }
        var err = new Error((body.data && body.data.message) || 'API error: ' + statusCode)
        err.statusCode = statusCode
        reject(err)
      },
      fail: function (e) {
        var err = new Error((e && e.errMsg) || '网络请求失败')
        err.statusCode = -1
        reject(err)
      }
    })
  })
}

function wxLogin() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        resolve(res.code)
      },
      fail: reject
    })
  })
}

/**
 * 确保存在有效登录态：无 token 时走 wx.login -> POST /login 换取并落 storage。
 * 与 src/api/wx.js login 的入参一致（appid, auth_type:'wxapp', code）。
 * @returns {Promise<string>} token
 */
function ensureLogin() {
  var token = getToken()
  if (token) return Promise.resolve(token)
  return wxLogin().then(function (code) {
    return request({
      url: '/login',
      method: 'POST',
      data: { appid: config.getAppId(), auth_type: 'wxapp', code: code }
    }).then(function (res) {
      var t = res && res.token
      if (t) setToken(t)
      return t || ''
    })
  })
}

/**
 * 解析微信小程序端可用的支付方式（与 src/utils/payment.js#getPaymentList + sp-cashier 默认选择一致）。
 * GET /trade/payment/list?distributor_id&platform=wxMiniProgram -> [{ paymentCode, paymentChannel, paymentName }]
 * 选择规则：优先能走 usePayment#weappPay 的项（pay_type=wxpay，或 adapay/bspay 且 channel=wx_lite），
 * 退而求其次 paymentChannel=='wxpay'，再退 list[0]。失败兜底 {wxpay, wx_lite}。
 * @param {string|number} distributorId
 * @returns {Promise<{payType:string, payChannel:string}>}
 */
function resolveWeappPayment(distributorId) {
  return request({
    url: '/trade/payment/list',
    method: 'GET',
    data: { distributor_id: distributorId, platform: 'wxMiniProgram' }
  })
    .then(function (res) {
      var list = Array.isArray(res) ? res : (res && (res.list || res.data)) || []
      if (!list.length) return { payType: 'wxpay', payChannel: 'wx_lite' }
      var hit =
        list.filter(function (it) {
          var code = it.paymentCode || it.pay_type_code
          var ch = it.paymentChannel || it.pay_channel
          return code === 'wxpay' || ((code === 'adapay' || code === 'bspay') && ch === 'wx_lite')
        })[0] ||
        list.filter(function (it) {
          return (it.paymentChannel || it.pay_channel) === 'wxpay'
        })[0] ||
        list[0]
      return {
        payType: hit.paymentCode || hit.pay_type_code || 'wxpay',
        payChannel: hit.paymentChannel || hit.pay_channel || 'wx_lite'
      }
    })
    .catch(function () {
      return { payType: 'wxpay', payChannel: 'wx_lite' }
    })
}

module.exports = {
  request: request,
  ensureLogin: ensureLogin,
  getToken: getToken,
  resolveWeappPayment: resolveWeappPayment
}
