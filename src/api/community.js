import req from './req'

export function getCommunityList(params) {
  return req.get('/community/orders', params)
}

export function getActivityLits(params) {
  // 获取团长活动列表
  return req.get('/community/chief/activity', params)
}

<<<<<<< HEAD
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
  return req.get(`/community/chief/items` ,params)
}
=======
export function confirmDelivery(activity_id) {
  return req.post(`/community/chief/confirm_delivery/${activity_id}`)
}

export function checkChief() {
  // 检查用户是否是团长
  return req.post('/community/checkChief')
}
>>>>>>> 0914f646f77d4bc6ef4d169318ecbad8e57a5bd7
