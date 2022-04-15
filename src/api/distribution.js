import req from './req'

export function become() {
  return req.post('/promoter')
}

export function update(params = {}) {
  return req.put('/promoter', params)
}

export function dashboard() {
  return req.get('/promoter/index')
}

export function info(params = {}) {
  return req.get('/promoter/info', params)
}

export function subordinate(params) {
  return req.get('/promoter/children', params)
}

export function commission(params = {}) {
  return req.get('/promoter/brokerages', params)
}

export function statistics() {
  return req.get('/promoter/brokerage/count')
}

export function withdrawRecord(params) {
  return req.get('/promoter/cash_withdrawal', params)
}

export function withdraw() {
  return req.post('/promoter/cash_withdrawal')
}

export function qrcode(params) {
  return req.get('/promoter/qrcode', params)
}

export function items(params) {
  return req.get('/promoter/relgoods', params)
}

export function release(params) {
  return req.post('/promoter/relgoods', params)
}

export function unreleased(params) {
  return req.delete('/promoter/relgoods', params)
}

export function shopAchievement(params) {
  return req.get('/promoter/taskBrokerage/count', params)
}

export function shopTrade(params) {
  return req.get('/promoter/taskBrokerage/logs', params)
}
export function shopBanner(params) {
  return req.get('/promoter/banner', params)
}

export function getCategorylevel(params) {
  return req.get('/goods/categorylevel', params)
}

// 小店上架分类
export function getShopCategorylevel(params) {
  return req.get('/goods/shopcategorylevel', params)
}

export function getCustompage() {
  return req.get('/promoter/custompage')
}

export function getCash(params) {
  return req.post('/promoter/cash_withdrawal', params)
}

// 获取小店上架商品
export function getShopGoods(params) {
  return req.get('/goods/shopitems', params)
}

// 查询商家是否可用
export function merchantIsvaild(params) {
  return req.get(`/distributor/merchant/isvaild`, params)
}

// 获取分销员认证信息
export function adapayCert(params) {
  return req.get('/adapay/popularize/cert', params)
}

// 新建分销员认证信息
export function adapayCreateCert(params) {
  return req.post('/adapay/popularize/create_cert', params)
}

// 修改分销员认证信息
export function adapayUpdateCert(params) {
  return req.post('/adapay/popularize/update_cert', params)
}
