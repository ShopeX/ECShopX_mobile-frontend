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
