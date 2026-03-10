/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import * as article from './article'
import * as aftersales from './aftersales'
import * as cart from './cart'
import * as cashier from './cashier'
import * as category from './category'
import * as distribution from './distribution'
import * as item from './item'
import * as member from './member'
import * as promotion from './promotion'
import * as region from './region'
import * as seckill from './seckill'
import * as shop from './shop'
import * as track from './track'
import * as trade from './trade'
import * as user from './user'
import * as vip from './vip'
import * as group from './group'
import * as groupBy from './groupBy'
import * as wx from './wx'
import * as alipay from './alipay'
import * as wheel from './wheel'
import * as pointitem from './pointitem'
import * as liveroom from './liveroom'
import * as wgts from './wgts'
import * as purchase from './purchase'
import * as guide from './guide'
import * as im from './im'
import * as salesman from './salesman'
import * as prescriptionDrug from './prescriptionDrug'
import * as design from './design'

// 仅分包使用的 api 不再从主包 index 导出，分包内请直接 import from '@/api/community' 等，以减小主包体积
// 分包用: community, dianwu, game, boost, mdugc, delivery, merchant

export default {
  article,
  aftersales,
  cart,
  cashier,
  category,
  item,
  member,
  promotion,
  region,
  trade,
  user,
  seckill,
  wx,
  shop,
  distribution,
  track,
  vip,
  group,
  groupBy,
  wheel,
  pointitem,
  guide,
  alipay,
  liveroom,
  wgts,
  purchase,
  im,
  salesman,
  prescriptionDrug,
  design
}
