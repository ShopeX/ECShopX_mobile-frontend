/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子接口：createOrder —— 直接生成订单（对应运行机制流程图中的「创建订单」）。
 *
 * 真实链路（复用主包结算页 src/pages/cart/espier-checkout.js 的下单契约）：
 *   1) POST /cart 建立 fastbuy 购物车（src/api/cart.js#fastBuy）；
 *   2) POST /order_new 创建订单（src/api/trade.js#h5create），带 receiver_* 收货字段
 *      （字段映射见 src/doc/checkout.js#RECEIVER_ADDRESS）与 pay_type=wxpay / pay_channel=wx_lite。
 * 返回 order_id 供 payOrder 发起支付，并产出订单确认卡片。
 *
 * 运行时自适应：
 *   - 支付方式：实时拉 /trade/payment/list（platform=wxMiniProgram）解析 payType/payChannel，
 *     兼容原生 wxpay 与 adapay/bspay 聚合（wx_lite），并透传给 payOrder；
 *   - isNostores：平台版（APP_PLATFORM=platform）不传，其余版本传 0。
 */
var http = require('../lib/request')
var config = require('../lib/config')

function fen2yuan(v) {
  var n = Number(v)
  if (!isFinite(n)) return undefined
  return Math.round(n) / 100
}

function pickAddress(list, addressId) {
  list = list || []
  var hit = null
  if (addressId != null && String(addressId) !== '') {
    hit = list.filter(function (a) {
      return String(a.address_id) === String(addressId)
    })[0]
  }
  if (!hit) {
    hit = list.filter(function (a) {
      return a.is_def == 1 || a.is_def === '1'
    })[0]
  }
  if (!hit) hit = list[0]
  return hit || null
}

async function createOrder(args) {
  args = args || {}
  var itemId = args.itemId
  var num = Math.max(parseInt(args.num, 10) || 1, 1)
  if (!itemId) {
    return {
      isError: true,
      content: [{ type: 'text', text: '缺少 itemId，无法下单。请先用 searchGoods/getGoodsDetail 确认商品。' }]
    }
  }

  // 1. 商品详情：库存校验 + 展示信息 + distributorId
  var detail = await http.request({ url: '/goods/items/' + itemId, method: 'GET' })
  detail = detail || {}
  var distributorId = args.distributorId != null ? args.distributorId : detail.distributor_id
  var title = detail.item_name || detail.title || ''
  var price = fen2yuan(detail.price)
  var store = detail.store
  var image = (detail.pics && detail.pics[0]) || detail.item_main_image || ''
  if (store != null && Number(store) < num) {
    return {
      isError: true,
      content: [{ type: 'text', text: '商品「' + title + '」库存不足（剩余 ' + store + '），请让用户减少数量。' }]
    }
  }

  // 2. 收货地址：必须先有地址（receiver_* 必填）
  var addrList = await http.request({ url: '/member/addresslist', method: 'GET' })
  var rawList = Array.isArray(addrList) ? addrList : (addrList && (addrList.list || addrList.data)) || []
  var addr = pickAddress(rawList, args.addressId)
  if (!addr) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: '用户还没有收货地址，无法生成订单。请先用 chooseAddress 让用户选择/填写收货地址，再调用 createOrder。'
        }
      ]
    }
  }

  // 3. 解析微信支付方式（运行时自适应，兼容 wxpay / adapay / bspay 聚合）
  var pay = await http.resolveWeappPayment(distributorId)

  // 4. 建立 fastbuy 购物车（与 src/api/cart.js#fastBuy 入参一致）
  await http.request({
    url: '/cart',
    method: 'POST',
    data: {
      cart_type: 'fastbuy',
      item_id: itemId,
      num: num,
      distributor_id: distributorId,
      isAccumulate: false,
      shop_type: 'distributor'
    }
  })

  // 5. 创建订单（receiver_* 映射见 src/doc/checkout.js#RECEIVER_ADDRESS）
  // isNostores：平台版（VERSION_PLATFORM）需删除该字段，其余版本传 0（与 espier-checkout.js#getParamsInfo 一致）
  var orderPayload = {
    cart_type: 'fastbuy',
    receipt_type: 'logistics',
    order_type: 'normal',
    promotion: 'normal',
    point_use: 0,
    pay_type: pay.payType,
    pay_channel: pay.payChannel,
    distributor_id: distributorId,
    receiver_name: addr.username,
    receiver_mobile: addr.telephone,
    receiver_state: addr.province,
    receiver_city: addr.city,
    receiver_district: addr.county,
    receiver_address: addr.adrdetail,
    receiver_zip: addr.postalCode
  }
  if (config.getPlatform() !== 'platform') {
    orderPayload.isNostores = 0
  }
  var orderRes = await http.request({ url: '/order_new', method: 'POST', data: orderPayload })
  orderRes = orderRes || {}
  var orderId = orderRes.order_id || orderRes.orderId
  if (!orderId) {
    return {
      isError: true,
      content: [{ type: 'text', text: '创建订单失败，请引导用户稍后重试或检查商品与地址。' }]
    }
  }

  var amount =
    fen2yuan(orderRes.total_fee) != null
      ? fen2yuan(orderRes.total_fee)
      : price != null
      ? Math.round(price * num * 100) / 100
      : undefined
  var addressText =
    (addr.username || '') +
    ' ' +
    (addr.telephone || '') +
    ' ' +
    (addr.province || '') +
    (addr.city || '') +
    (addr.county || '') +
    (addr.adrdetail || '')

  return {
    isError: false,
    content: [
      {
        type: 'text',
        text:
          '订单已生成：' +
          title +
          ' ×' +
          num +
          (amount != null ? '，应付 ' + amount + ' 元' : '') +
          '，寄送至 ' +
          addressText +
          '。接下来为用户展示订单确认卡片，引导用户点击「确认支付」完成支付。订单尚未支付，禁止宣称已支付成功。'
      }
    ],
    structuredContent: {
      orderId: orderId,
      title: title,
      num: num,
      amount: amount,
      addressText: addressText,
      status: 'created'
    },
    _meta: { image: image, payType: pay.payType, payChannel: pay.payChannel }
  }
}

module.exports = createOrder
