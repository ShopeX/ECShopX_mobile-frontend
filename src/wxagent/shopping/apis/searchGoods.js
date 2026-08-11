/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子接口：searchGoods —— 按关键词搜索在售商品。
 * 复用主包 `src/api/item.js#search` 同一接口 GET /goods/items 与同一批查询参数。
 */
var http = require('../lib/request')

function fen2yuan(v) {
  var n = Number(v)
  if (!isFinite(n)) return undefined
  return Math.round(n) / 100
}

function normalizeItem(raw) {
  // 原始字段见 src/doc/goods.js（goodsId/title/imgUrl/price(分)/store）
  return {
    itemId: raw.goodsId || raw.item_id || raw.itemId,
    title: raw.title || raw.item_name || '',
    image: raw.imgUrl || raw.item_main_image || (raw.pics && raw.pics[0]) || '',
    price: fen2yuan(raw.price),
    store: raw.store,
    distributorId: raw.distributor_id || raw.distributorId
  }
}

async function searchGoods(args) {
  args = args || {}
  var keyword = (args.keyword || '').trim()
  var page = args.page || 1
  var pageSize = Math.min(args.pageSize || 10, 20)

  var params = {
    page: page,
    pageSize: pageSize,
    keywords: keyword,
    approve_status: 'onsale,only_show',
    item_type: 'normal',
    is_point: 'false'
  }
  if (args.distributorId != null) params.distributor_id = args.distributorId

  var res = await http.request({ url: '/goods/items', method: 'GET', data: params })
  var list = (res && res.list) || []
  var total = (res && res.total_count) || list.length
  var goods = list.map(normalizeItem).filter(function (g) {
    return g.itemId
  })

  if (!goods.length) {
    return {
      isError: false,
      content: [
        {
          type: 'text',
          text: '没有搜索到与「' + keyword + '」相关的在售商品。可以换个关键词，或让我推荐热门商品。'
        }
      ],
      structuredContent: { keyword: keyword, total: 0, goods: [] }
    }
  }

  return {
    isError: false,
    content: [
      {
        type: 'text',
        text:
          '已为「' +
          keyword +
          '」找到 ' +
          total +
          ' 件在售商品，下面展示前 ' +
          goods.length +
          ' 件。接下来为用户展示商品列表卡片，让用户选择想看的商品或直接下单。'
      }
    ],
    structuredContent: { keyword: keyword, total: total, goods: goods }
  }
}

module.exports = searchGoods
