import Taro from '@tarojs/taro'

//跳转到店铺首页
export function JumpStoreIndex(info){
    Taro.navigateTo({ url: `/pages/store/index?id=${info.distributor_id}` })
}