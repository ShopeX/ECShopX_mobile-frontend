import req from './req'

// 获取推荐商家
export function getNearbyShop (params) {
  return req.get('/distributor/list', params)
}
