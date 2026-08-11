/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子接口：getGoodsDetail —— 获取单个商品详情（含价格、库存、规格概要）。
 * 复用主包 `src/api/item.js#detail` 同一接口 GET /goods/items/{item_id}。
 */
var http = require('../lib/request')

function fen2yuan(v) {
  var n = Number(v)
  if (!isFinite(n)) return undefined
  return Math.round(n) / 100
}

async function getGoodsDetail(args) {
  args = args || {}
  var itemId = args.itemId
  if (!itemId) {
    return {
      isError: true,
      content: [{ type: 'text', text: '缺少 itemId，无法查询商品详情。请先用 searchGoods 拿到商品的 itemId。' }]
    }
  }

  var detail = await http.request({ url: '/goods/items/' + itemId, method: 'GET' })
  detail = detail || {}

  var images = detail.pics || detail.images || []
  if ((!images || !images.length) && detail.item_main_image) images = [detail.item_main_image]

  // 规格概要：ecshopx 商品的规格描述在 item_spec_desc（无规格商品为空）
  var specDesc = detail.item_spec_desc || detail.spec_items || []
  var hasSku = Array.isArray(specDesc) && specDesc.length > 0

  var structured = {
    itemId: detail.item_id || detail.goods_id || itemId,
    title: detail.item_name || detail.title || '',
    price: fen2yuan(detail.price),
    marketPrice: fen2yuan(detail.market_price),
    store: detail.store,
    unit: detail.item_unit || detail.unit || '',
    image: images[0] || '',
    distributorId: detail.distributor_id,
    hasSku: hasSku,
    specSummary: hasSku
      ? specDesc.map(function (s) {
          return { name: s.spec_name || s.name, values: s.spec_values || s.values }
        })
      : []
  }

  var actionText = hasSku
    ? '该商品有多个规格，请引导用户选择规格；用户确认规格后再用 createOrder 生成订单（itemId 须取所选规格的 itemId）。'
    : '该商品无规格，用户确认购买数量后可直接调用 createOrder 生成订单（需已有收货地址）。'

  return {
    isError: false,
    content: [
      {
        type: 'text',
        text:
          '商品「' +
          structured.title +
          '」当前售价 ' +
          (structured.price != null ? structured.price + ' 元' : '未知') +
          '，库存 ' +
          (structured.store != null ? structured.store : '未知') +
          '。接下来为用户展示商品详情卡片。' +
          actionText
      }
    ],
    structuredContent: structured
  }
}

module.exports = getGoodsDetail
