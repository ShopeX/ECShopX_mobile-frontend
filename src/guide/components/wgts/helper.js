import Taro from '@tarojs/taro'
import { WGTS_NAV_MAP } from '@/consts'

export function linkPage(type, id, item) {
  // console.log('[首页模版点击：linkPage]-type',type)
  // console.log('[首页模版点击：linkPage]-id', id)
  // console.log('[首页模版点击：linkPage]-item',item)
  let url = ''

  switch (type) {
    case 'goods':
      url = '/guide/item/espier-detail?id=' + id
      break
    case 'category':
      url = '/guide/item/list?cat_id=' + id
      break
    case 'planting':
      url = '/guide/recommend/detail?id=' + id
      break
    case 'liverooms':
      url = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${id}`
      break
    case 'coupon':
      url = '/guide/coupon-home/index?card_id=' + id
      break
    case 'custom_page':
      url = `/guide/custom/custom-page?id=${id}&version=${item.version}`
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
