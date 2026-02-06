/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import req from './req'

// 获取推荐商家
export function getNearbyShop(params) {
  return req.get('/distributor/list', params)
}

//获取挂件优惠券
// page_no: 1
// page_size: 10
// regionauth_id:  区域（小镇）ID
// card_id:  卡券ID，多个用英文逗号拼接
// distributor_id: 店铺ID
export function getCoupon(params) {
  return req.get('/getCardList', params)
}
