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
  return req.get('/promoter/getSalesmanStatic', params)
}

// 协议
export function shopsProtocolsaleman (params = {}) {
  return req.get('/shops/protocolsaleman', params)
}

//分类
export function get (params={}) {
  return req.get('/goods/category', params)
}
