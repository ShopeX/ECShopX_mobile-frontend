/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import req from './req'

// 案例列表
export function getDesignList(data) {
  return req.post('/kujiale/desginList', data)
}

// 案例详情
export function getDesignDetail(data) {
  return req.post('/kujiale/desginDetail', data)
}
// 标签列表
export function getDesignTagsList(data) {
  return req.get('/kujiale/desginTagsList', data)
}

// 省市
export function getLocationList(data) {
  return req.get('/kujiale/getLocationList', data)
}
