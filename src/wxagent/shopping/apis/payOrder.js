/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子接口：payOrder —— 发起微信支付（对应运行机制流程图中的「创建预支付订单 + wx.requestPayment + 查询支付状态」）。
 *
 * 真实链路（复用主包 src/hooks/usePayment.js#weappPay 的契约）：
 *   1) POST /payment 取微信支付参数（src/api/cashier.js#getPayment）；
 *   2) wx.requestPayment 拉起收银台；
 *   3) 成功后查询订单详情确认状态（GET /order/{order_id}），产出支付成功卡片。
 *
 * 注意：真实交易，禁止 mock 成功；支付失败/取消一律返回 isError，由用户重新发起。
 */
var http = require('../lib/request')

function fen2yuan(v) {
  var n = Number(v)
  if (!isFinite(n)) return undefined
  return Math.round(n) / 100
}

function requestPayment(params) {
  return new Promise(function (resolve, reject) {
    if (!wx || typeof wx.requestPayment !== 'function') {
      reject(new Error('当前环境不支持 wx.requestPayment'))
      return
    }
    wx.requestPayment({
      timeStamp: params.timeStamp,
      nonceStr: params.nonceStr,
      package: params.package,
      signType: params.signType,
      paySign: params.paySign,
      success: function () {
        resolve()
      },
      fail: function (err) {
        reject(err || new Error('支付未完成'))
      }
    })
  })
}

async function payOrder(args) {
  args = args || {}
  var orderId = args.orderId
  if (!orderId) {
    return {
      isError: true,
      content: [{ type: 'text', text: '缺少 orderId，无法支付。orderId 必须来自 createOrder 返回值，禁止编造。' }]
    }
  }

  // 1. 取微信支付参数（与 usePayment#weappPay 一致）
  // pay_type/pay_channel 由 createOrder 解析后透传，缺省兜底 wxpay/wx_lite
  var payParams
  try {
    payParams = await http.request({
      url: '/payment',
      method: 'POST',
      data: {
        pay_type: args.payType || 'wxpay',
        pay_channel: args.payChannel || 'wx_lite',
        order_id: orderId,
        order_type: 'normal'
      }
    })
  } catch (e) {
    return {
      isError: true,
      content: [{ type: 'text', text: '获取支付参数失败：' + (e.message || '未知错误') + '。请引导用户稍后重试。' }]
    }
  }

  // 2. 拉起微信收银台
  try {
    await requestPayment(payParams || {})
  } catch (e) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: '支付未完成（用户取消或失败）。订单已生成但未支付，请引导用户在卡片上重新点击「确认支付」，禁止宣称已支付成功。'
        }
      ]
    }
  }

  // 3. 查询订单状态确认（GET /order/{order_id}）
  var paidAmount = args.amount
  var title = args.title || ''
  try {
    var od = await http.request({ url: '/order/' + orderId, method: 'GET' })
    od = od || {}
    if (fen2yuan(od.total_fee) != null) paidAmount = fen2yuan(od.total_fee)
    title = od.title || od.item_name || title
  } catch (e) {
    /* 查询失败不影响已支付结果展示 */
  }

  return {
    isError: false,
    content: [
      {
        type: 'text',
        text:
          '支付成功，订单 ' +
          orderId +
          ' 已完成支付' +
          (paidAmount != null ? '（实付 ' + paidAmount + ' 元）' : '') +
          '。接下来为用户展示支付成功卡片，并简短告知用户支付成功、商家将尽快发货。'
      }
    ],
    structuredContent: {
      orderId: orderId,
      paidAmount: paidAmount,
      status: 'paid',
      payTime: new Date().toISOString()
    },
    _meta: { title: title }
  }
}

module.exports = payOrder
