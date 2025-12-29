/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import req from './req'

export function groupList(params = {}) {
  return req.get('/promotions/groups', params)
}

export function groupDetail(id, params = {}) {
  return req.get(`/groupOrders/${id}`, params)
}

export function myGroupList(params = {}) {
  return req.get('/groupOrders', params)
}
