import req from './req'

// 获取进行中员工内购详情
export function purchaseInfo(params = {}) {
  return req.get('/promotion/employeepurchase/getinfo', params)
}

// 员工内购绑定成为家属
export function purchaseBind(params = {}) {
  return req.post(`/promotion/employeepurchase/dependents`, params)
}

// 获取员工内购分享码
export function purchaseCode(params = {}) {
  return req.get('/promotion/employeepurchase/sharecode', params)
}
