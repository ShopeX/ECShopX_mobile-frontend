/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * shopping SKILL 注册入口：注册原子接口 + 统一登录中间件。
 * 路径须与 app.json 的 agent.skills[].path 一致（wxagent/shopping）。
 */
var http = require('./lib/request')

var searchGoods = require('./apis/searchGoods')
var getGoodsDetail = require('./apis/getGoodsDetail')
var listAddresses = require('./apis/listAddresses')
var chooseAddress = require('./apis/chooseAddress')
var createOrder = require('./apis/createOrder')
var payOrder = require('./apis/payOrder')

var skill = wx.modelContext.createSkill('wxagent/shopping')

// 无需登录态的只读接口（避免对游客强制 wx.login）
var PUBLIC_APIS = { searchGoods: true, getGoodsDetail: true }

// 统一登录中间件：会员相关接口（地址/下单）执行前确保有 token
skill.use(async function (ctx, next) {
  if (!PUBLIC_APIS[ctx.name]) {
    await http.ensureLogin()
  }
  await next()
})

skill.registerAPI('searchGoods', searchGoods)
skill.registerAPI('getGoodsDetail', getGoodsDetail)
skill.registerAPI('listAddresses', listAddresses)
skill.registerAPI('chooseAddress', chooseAddress)
skill.registerAPI('createOrder', createOrder)
skill.registerAPI('payOrder', payOrder)
