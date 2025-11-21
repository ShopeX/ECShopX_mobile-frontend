/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import req from './req'

export function list() {
  req.get('/region.json')
}

export default {}
