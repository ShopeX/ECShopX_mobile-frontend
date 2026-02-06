/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import api from '@/api'
import configStore from '@/store'
import { updateShopInfo } from '@/store/slices/shop'
import { SG_CHECK_STORE_RULE, SG_ROUTER_PARAMS } from '@/consts'

const { store } = configStore()

/** 云店：APP_PLATFORM === 'standard'；bbc：其他 */
const isStandard = process.env.APP_PLATFORM === 'standard'

/**
 * 根据店铺 id 跳转：云店则切换当前店铺并跳转首页，bbc 则跳转店铺详情页
 * @param {number|string} distributor_id 店铺 id
 * @returns {Promise<void>}
 */
export async function navigateToStoreByDistributorId(distributor_id) {
  if (isStandard) {
    try {
      const shopInfo = await api.shop.getShop({ distributor_id })
      // if (shopInfo?.status === false) {
      //   Taro.showToast({ title: '店铺已注销，去别的店铺看看吧', icon: 'none' })
      //   return
      // }
      store.dispatch(updateShopInfo(shopInfo))
      Taro.setStorageSync('curStore', shopInfo)
      Taro.setStorageSync(SG_CHECK_STORE_RULE, 0)
      Taro.setStorageSync(SG_ROUTER_PARAMS, {})
      Taro.reLaunch({ url: '/pages/index' })
    } catch (e) {
      Taro.showToast({ title: e?.message || '店铺信息获取失败', icon: 'none' })
    }
  } else {
    Taro.navigateTo({ url: `/subpages/store/index?id=${distributor_id}` })
  }
}

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
