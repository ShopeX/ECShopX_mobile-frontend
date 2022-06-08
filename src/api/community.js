import req from './req'

export function getCommunityList(params) {
  return req.get('/community/orders', params)
}

export function getActivityList(params) {
  // 获取团长活动列表
  return req.get('/community/chief/activity', params)
}

export function getMemberActivityList(params) {
  // 个人中心活动列表
  return req.get('/community/member/activity', params)
}

export function createActivityZiti(params) {
  return req.post('/community/chief/ziti', params)
}

export function modifyActivityZiti(id, params) {
  return req.post(`/community/chief/ziti/${id}`, params)
}

export function getActivityZiti(id) {
  return req.get(`/community/chief/ziti`)
}

export function getChiefItems(params) {
  return req.get(`/community/chief/items`, params)
}

export function createChiefActivity(params) {
  return req.post('/community/chief/activity', params)
}

export function getChiefActivity(activity_id) {
  return req.get(`/community/chief/activity/${activity_id}`)
}

export function modiflyChiefActivity(activity_id, params) {
  return req.post(`/community/chief/activity/${activity_id}`, params)
}

export function confirmDelivery(activity_id) {
  // 团长确认收货
  return req.post(`/community/chief/confirm_delivery/${activity_id}`)
}

export function checkChief() {
  // 检查用户是否是团长
  return req.post('/community/checkChief')
}

export function getActiveDetail(activity_id) {
  // 消费者获取活动详情
  return req.get(`/community/member/activity/${activity_id}`)
}

// export function getChiefActiveDetail(activity_id) {
//   // 团长获取活动详情
//   return req.get(`/community/chief/activity/${activity_id}`)
// }

export function updateActivityStatus(activity_id, parmas) {
  // 团长修改活动状态
  return req.post(`/community/chief/activity_status/${activity_id}`, parmas)
}

export function exportOrder(parmas) {
  // 导出团购订单
  return req.get(`/community/orders/export`, parmas)
}

export function scanOrderCode(parmas) {
  // 核销码
  return req.post('/community/orders/qr_writeoff', parmas)
}

export function activityOrderItem(activity_id) {
  // 团长查看活动商品统计
  return req.post(`/community/chief/activity_order_item/${activity_id}`)
}

export function closeCode(parmas) {
  // 活动核销码
  return req.post(`/community/orders/batch_writeoff`, parmas)
}

// 获取所有可团商品
export function getMemberItems(params) {
  return req.get('/community/member/items', params)
}


// 获取申请信息
export function getAppayFields(params) {
  return req.get('/community/chief/apply_fields', params)
}

// 提交申请
export function applyChief(params) {
  return req.post('/community/chief/apply', params)
}

// 获取申请进度
export function getApplyChief(params) {
  return req.get('/community/chief/apply', params)
}

// 获取团长申请说明
export function aggrementAndExplanation(params) {
  return req.get('/community/chief/aggrement_and_explanation', params)
}

// 团长业绩统计
export function getChiefCashWithdraw() {
  return req.get('/community/chief/cash_withdrawal/count')
}

// 团长提现记录
export function getCashWithDraw(params) {
  return req.get('/community/chief/cash_withdrawal', params)
}

// 获取团长提现账户
export function getCashWithDrawAccount() {
  return req.get('/community/chief/cash_withdrawal/account' )
}

// 更新团长提现账户
export function updateCashWithDrawAccount(params) {
  return req.post('/community/chief/cash_withdrawal/account', params)
}

// 团长佣金提现申请
export function chiefCashWithdraw(params) {
  return req.post('/community/chief/cash_withdrawal', params)
}