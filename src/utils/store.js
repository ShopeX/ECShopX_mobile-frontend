import Taro from '@tarojs/taro'

//跳转到店铺首页
export function JumpStoreIndex(info){ 
    Taro.navigateTo({ url: `/pages/store/index?id=${info.distributor_id}` })
}

//跳转到首页
export function JumpPageIndex(){ 
    Taro.navigateTo({ url: `/pages/index` })
}

//跳转到商品详情页
export function JumpGoodDetail(itemId,distributor_id){ 
    Taro.navigateTo({ url: `/pages/item/espier-detail?id=${itemId}&dtid=${distributor_id}` })
}