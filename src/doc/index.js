/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 * 仅主包用到的 doc 子模块在此导出；仅分包用到的请分包内直接 import from '@/doc/address' 等以减小主包体积。
 */
import * as goods from './goods'
import * as cart from './cart'
import * as coupon from './coupon'
import * as checkout from './checkout'
import * as category from './category'
import * as article from './article'
import * as payment from './payment'
import * as trade from './trade'
import * as purchase from './purchase'
import * as wgt from './wgt'

// 仅分包用，分包内直接 import from '@/doc/xxx': address, shop, member, mdugc, activity, case

export default {
  goods,
  cart,
  coupon,
  checkout,
  category,
  article,
  payment,
  trade,
  purchase,
  wgt
}
