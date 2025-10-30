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
import api from '@/api'

//跳转到店铺首页
export function JumpStoreIndex(info) {
  //distributor_id 代表总店 如果点击总店 直接跳转到首页
  if (info.distributor_id == 0) {
    return JumpPageIndex()
  }
  Taro.navigateTo({ url: `/subpages/store/index?id=${info.distributor_id}` })
}

//跳转到首页
export function JumpPageIndex() {
  Taro.redirectTo({ url: `/pages/index` })
}

//跳转到商品详情页
export function JumpGoodDetail(itemId, distributor_id, activity_id, enterprise_id) {
  Taro.navigateTo({
    url: `/pages/item/espier-detail?id=${itemId}&dtid=${
      distributor_id || 0
    }&activity_id=${activity_id}&enterprise_id=${enterprise_id}`
  })
}

//获取总店
export async function getHeadShop() {
  const res = await api.shop.getHeadquarters()
  return res
}
