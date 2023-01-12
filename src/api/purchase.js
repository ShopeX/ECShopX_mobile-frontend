import req from './req'

export function getEnterprisesList(params) { // 获取企业列表
  return req.get('/enterprises', params)
}

export function getEmailCode(params) { // 获取邮箱验证码
  return req.get('/employee/email/vcode', params)
}

export function getEmployeeActivityList(params) { // 获取可参与的活动列表
  return req.get('/employeepurchase/activities', params)
}

export function setEmployeeAuth(params) { // 员工身份验证
  return req.post('/employee/auth', params)
}

export function getEmployeeInviteCode(params) { // 获取员工邀请码
  return req.get('/employee/invitecode', params)
}

export function getEmployeeRelativeBind(params) { // 绑定成为亲友
  return req.post('/employee/relative/bind', params)
}

export function getUserEnterprises(params) { // 获取用户所在企业列表
  return req.get('/user/enterprises', params)
}

export function getEmployeeIsOpen() { // 是否开启内购
  return req.get('/employeepurchase/is_open')
}

export function getEmployeeActivitydata(params) { // 获取员工活动数据
  return req.get('/employee/activitydata', params)
}

export function getEmployeeInvitelist(params) { // 获取员工邀请亲友列表
  return req.get('/employee/invitelist', params)
}

export function getPurchaseActivityItems(params) { // 获取活动商品列表
  return req.get('/employeepurchase/activity/items', params)
}

export function getPurchaseCart(params) { // 获取内购购物车
  return req.get('/employeepurchase/cart', params)
}

export function updatePurchaseCart(params) { // 内购购物车更新
  return req.put('/employeepurchase/cart', params)
}

export function addPurchaseCart(params) { // 内购购物车新增
  return req.post('/employeepurchase/cart', params)
}

export function deletePurchaseCart(params) { // 内购购物车删除
  return req.delete('/employeepurchase/cart', params)
}

export function updatePurchaseCartcount(params) { // 内购购物车数量
  return req.get('/employeepurchase/cartcount', params)
}
