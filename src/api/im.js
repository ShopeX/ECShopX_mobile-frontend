/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import req from './req'

export function getImConfigByDistributor(distributor_id) {
  return req.get(`/im/meiqia/distributor/${distributor_id}`)
}
