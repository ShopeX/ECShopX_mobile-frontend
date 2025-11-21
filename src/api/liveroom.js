/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import req from './req'

export function getLiveRoomList(params = {}) {
  // 获取直播列表
  return req.get('/promotion/live/list', params)
}

export function getReturnList() {
  // 获取视频回放列表
  return req.get('/promotion/replay/list')
}
