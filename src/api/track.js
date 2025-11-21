/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import req from './req'

export function viewnum(param = {}) {
  return req.post('/track/viewnum', {})
}
