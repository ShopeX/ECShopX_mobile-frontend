import Taro from '@tarojs/taro'
import api from '@/api'

//跳转到店铺首页
export function JumpStoreIndex (info) {
  //distributor_id 代表总店 如果点击总店 直接跳转到首页
  if (info.distributor_id == 0) {
    return JumpPageIndex()
  }
  Taro.navigateTo({ url: `/pages/store/index?id=${info.distributor_id}` })
}

//跳转到首页
export function JumpPageIndex () {
  Taro.navigateTo({ url: `/pages/index` })
}

//跳转到商品详情页
export function JumpGoodDetail (itemId, distributor_id) {
  Taro.navigateTo({ url: `/pages/item/espier-detail?id=${itemId}&dtid=${distributor_id || 0}` })
}

//获取总店
export async function getHeadShop () {
  const res = await api.shop.getHeadquarters()
  return res
}
