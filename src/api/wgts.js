/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import req from './req'

// 获取推荐商家
export function getNearbyShop(params) {
  return req.get('/distributor/list', params)
}
