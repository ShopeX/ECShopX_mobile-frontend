import req from './req'

export function getSalespersonSalemanShopList (params = {}) {
  return req.get('/salesperson/salemanShopList', params)
}

export function promoterIndex (params = {}) {
  return req.get('/promoter/index', params)
}

// 业务员首页统计
export function getSalesmanCount (params = {}) {
  return req.get('/promoter/getSalesmanCount', params)
}

// 业务员我的
export function promoterInfo (params = {}) {
  return req.get('/promoter/info', params)
}

// 业务员业绩
export function promoterGetSalesmanStatic (params = {}) {
  return req.get('/salespersonadmin/brokagestaticlist', params)
}

// 协议
export function shopsProtocolsaleman (params = {}) {
  return req.get('/shops/protocolsaleman', params)
}

//分类
export function get (params={}) {
  return req.get('/goods/promoter/category', params)
}

//实名认证
export function tradePaymentListInfo (params={}) {
  return req.get('/trade/payment/listInfo', params)
}

//实名认证
export function salespersonBindusersalesperson (data) {
  return req.post('/salesperson/bindusersalesperson', data)
}

//提现
export function salespersonApplyCashWithdrawal (data) {
  return req.post('/salesman/applyCashWithdrawal', data)
}

//提现记录
export function salesmanGetCashWithdrawalList (params={}) {
  return req.get('/salesman/getCashWithdrawalList', params)
}

//业务员列表
export function salespersonadminSalespersonlist(params) {
  return req.get('/salespersonadmin/salespersonlist', params)
}

//业务员添加
export function salespersonadminAddsalesperson (data) {
  return req.post('/salespersonadmin/addsalesperson', data)
}

//业务员编辑
export function salespersonadminUpdatesalesperson (data) {
  return req.post('/salespersonadmin/updatesalesperson', data)
}

//业务员业绩查询
export function salespersonadminBrokagestaticlist(params) {
  return req.get('/salespersonadmin/brokagestaticlist', params)
}

//业务员编辑数据回显
export function salespersonadminSalespersoninfo(params) {
  return req.get('/salespersonadmin/salespersoninfo', params)
}