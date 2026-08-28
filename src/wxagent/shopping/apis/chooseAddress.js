/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子接口：chooseAddress —— 唤起系统地址选择器选择/填写收货地址，并落库为默认地址。
 *
 * 最佳实践（参考微信官方 demo getAddress）：
 *  - 原子组件环境不支持 wx.chooseAddress，必须在原子接口里调用；
 *  - 选完写入后端 POST /member/address（与 src/api/member.js#addressCreate 一致），
 *    设为默认地址，这样后续在小程序原生结算页会自动带出该地址，形成闭环。
 *  - 字段映射与 src/marketing/pages/member/edit-address.js 对 wx.chooseAddress 的用法一致。
 */
var http = require('../lib/request')

function chooseSystemAddress() {
  return new Promise(function (resolve, reject) {
    if (!wx || typeof wx.chooseAddress !== 'function') {
      reject(new Error('当前环境不支持 wx.chooseAddress'))
      return
    }
    wx.chooseAddress({
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err || new Error('用户取消选择地址'))
      }
    })
  })
}

async function chooseAddress() {
  var picked
  try {
    picked = await chooseSystemAddress()
  } catch (e) {
    return {
      isError: false,
      content: [
        {
          type: 'text',
          text: '用户未选择收货地址（已取消或环境不支持）。可用 listAddresses 展示已有地址，或引导用户重新点击选择地址。'
        }
      ],
      structuredContent: { hasAddress: false, address: null }
    }
  }

  var payload = {
    username: picked.userName,
    telephone: picked.telNumber,
    province: picked.provinceName,
    city: picked.cityName,
    county: picked.countyName,
    adrdetail: picked.detailInfo,
    is_def: '1'
  }

  var res = await http.request({ url: '/member/address', method: 'POST', data: payload })
  var addressId = (res && (res.address_id || res.addressId)) || ''
  var summary =
    (picked.userName || '') +
    ' ' +
    (picked.telNumber || '') +
    ' ' +
    (picked.provinceName || '') +
    (picked.cityName || '') +
    (picked.countyName || '') +
    (picked.detailInfo || '')

  return {
    isError: false,
    content: [
      {
        type: 'text',
        text:
          '已保存收货地址并设为默认：' +
          summary +
          '。接下来为用户展示地址卡片；用户确认商品后即可用 createOrder 直接生成订单（默认使用该地址）。'
      }
    ],
    structuredContent: {
      hasAddress: true,
      addresses: [
        {
          addressId: addressId,
          name: picked.userName,
          mobile: picked.telNumber,
          province: picked.provinceName,
          city: picked.cityName,
          county: picked.countyName,
          detail: picked.detailInfo,
          isDefault: true
        }
      ]
    }
  }
}

module.exports = chooseAddress
