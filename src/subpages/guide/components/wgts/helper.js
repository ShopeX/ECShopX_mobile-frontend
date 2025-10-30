// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import Taro from '@tarojs/taro'
import { WGTS_NAV_MAP } from '@/consts'

export function linkPage(type, id, item) {
  // console.log('[首页模版点击：linkPage]-type',type)
  // console.log('[首页模版点击：linkPage]-id', id)
  // console.log('[首页模版点击：linkPage]-item',item)
  let url = ''

  switch (type) {
    case 'goods':
      url = '/subpages/guide/item/espier-detail?id=' + id
      break
    case 'category':
      url = '/subpages/guide/item/list?cat_id=' + id
      break
    case 'planting':
      url = '/subpages/guide/recommend/detail?id=' + id
      break
    case 'liverooms':
      url = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${id}`
      break
    case 'coupon':
      url = '/subpages/guide/coupon-home/index?card_id=' + id
      break
    case 'custom_page':
      url = `/subpages/guide/custom/custom-page?id=${id}&version=${item.version}`
      break
    default:
  }
  // if(item.linkPage==='cashcoupon'){
  //   api.member.sendCashCoupon({stock_id:item.id})
  //   return
  // }

  let is_arr = Array.isArray(type) //活动 ['activity','满折/满减/满赠/限时特惠/任选']
  is_arr && (url = `/guide/item/promotion-list?type=${type[1]}&id=${id}`)

  Taro.navigateTo({
    url
  })
}

export default {}
