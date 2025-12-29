/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import req from './req'

export function seckillList(params = {}) {
  return req.get('/promotion/seckillactivity/getlist', params)
}

export function seckillGoodsList(params = {}) {
  return req.get('/promotion/seckillactivity/getinfo', params)
}
