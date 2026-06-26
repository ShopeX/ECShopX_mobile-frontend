/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子接口：listAddresses —— 获取当前会员的收货地址列表。
 * 复用主包 `src/api/member.js#addressList` 同一接口 GET /member/addresslist。
 */
var http = require('../lib/request')

function normalizeAddress(raw) {
  return {
    addressId: raw.address_id || raw.addressId,
    name: raw.username || raw.receiver_name || '',
    mobile: raw.telephone || raw.mobile || raw.telphone || '',
    province: raw.province || '',
    city: raw.city || '',
    county: raw.county || raw.district || '',
    detail: raw.adrdetail || raw.address || raw.detail || '',
    isDefault: raw.is_def == 1 || raw.is_def === '1' || raw.is_default == 1
  }
}

async function listAddresses() {
  var res = await http.request({ url: '/member/addresslist', method: 'GET' })
  var rawList = Array.isArray(res) ? res : (res && (res.list || res.data)) || []
  var addresses = rawList.map(normalizeAddress).filter(function (a) {
    return a.addressId
  })

  if (!addresses.length) {
    return {
      isError: false,
      content: [
        {
          type: 'text',
          text: '当前还没有收货地址。请引导用户用 chooseAddress 唤起系统地址选择器选择/填写并保存收货地址。'
        }
      ],
      structuredContent: { addresses: [] }
    }
  }

  return {
    isError: false,
    content: [
      {
        type: 'text',
        text:
          '共有 ' +
          addresses.length +
          ' 个收货地址。接下来为用户展示地址卡片，让用户选择一个用于本次下单（选中后记下其 addressId）。'
      }
    ],
    structuredContent: { addresses: addresses }
  }
}

module.exports = listAddresses
