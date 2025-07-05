import Taro, { getCurrentInstance } from '@tarojs/taro'
import { stringify } from 'qs'
import configStore from '@/store'
// import { WGTS_NAV_MAP } from '@/consts'

const { store } = configStore()

function linkPage(data) {
  const { id, title, linkPage, linkType, type, distributor_id, navigation = false, content, seletedTags = [] } = data
  const { id: dtid } = getCurrentInstance().router.params
  // h5链接
  if (linkType == 1) {
    Taro.navigateTo({
      url: `/pages/webview?url=${encodeURIComponent(data.linkUrl)}`
    })
    return
  }
  if (navigation) {
    let tags = []
    seletedTags.forEach(item => {
      tags.push({
        tag_id: item.tag_id,
        tag_name: item.tag_name
      })
    })
    let seleted = stringify(tags);
    Taro.navigateTo({
      url: `/subpages/ecshopx/navigation-ibs?content=${content}&id=${id}&seletedTags=${encodeURIComponent(seleted)}`
    })
    return
  }
  let url = ''
  console.log('linkPage----', data)
  switch (linkPage) {
    case 'lottery':
      url = `/subpages/game-activity/index?id=${id}`
      break
    case 'goods':
      url = `/pages/item/espier-detail?id=${id}&dtid=${distributor_id}`
      break
    case 'sale_category':
      url = '/pages/item/list?cat_id=' + id
      break
    case 'category':
    case 'management_category':
      url = '/pages/item/list?main_cat_id=' + id
      break
    case 'article':
      url = '/pages/article/index?id=' + id
      break
    case 'planting':
      url = '/subpage/pages/recommend/detail?id=' + id
      break
    case 'custom_page':
      url = '/pages/custom/custom-page?id=' + id
      break
    case 'marketing':
      if (id == 'coupon_list') {
        url = '/subpages/marketing/coupon-center'
      } else if (id == 'groups_list') {
        url = '/marketing/pages/item/group-list'
      }
      break
    case 'seckill':
      url = '/marketing/pages/item/seckill-goods-list?seckill_id=' + id
      break
    case "purchase_activity":
      url = '/subpages/purchase/select-identity?is_redirt=1&activity_id='+id
      clearPurchaseDtid()
      break
    case 'link':
      if (id == 'vipgrades') {
        url = '/subpage/pages/vip/vipgrades'
      } else if (id == 'purchase') {
        url = '/subpages/purchase/select-identity?is_redirt=1'
        clearPurchaseDtid()
      } else if (id == 'recharge') {
        url = '/others/pages/recharge/index'
      } else if (id == 'serviceH5Coach') {
      } else if (id == 'pointShop') {
        url = '/subpages/pointshop/list'
      } else if (id == 'levelMemberVip') {
        url = '/subpage/pages/vip/vipgrades'
      } else if (id == 'serviceH5Coach') {
        url = '/marketing/pages/service/wap-link?tp=o'
      } else if (id == 'serviceH5Sales') {
        url = '/marketing/pages/service/wap-link?tp=r'
      } else if (id == 'storelist') {
        url = '/marketing/pages/service/store-list'
      } else if (id == 'aftersales') {
        url = '/marketing/pages/service/refund-car'
      } else if (id == 'mycoach') {
        url = '/marketing/pages/service/online-guide'
      } else if (id == 'hottopic') {
        url = '/pages/recommend/list'
      } else if (id === 'floorguide') {
        url = '/pages/floorguide/index'
      } else if (id === 'grouppurchase') {
        url = '/groupBy/pages/home/index'
      } else if(id === 'registActivity'){
        url = '/marketing/pages/member/activity-list'
      } else {
        url = ''
      }
      break
    case 'tag':
      url = '/pages/item/list?tag_id=' + id
      break
    case 'regactivity':
      url = '/marketing/pages/reservation/goods-reservate?activity_id=' + id
      break
    case 'liverooms':
      url = 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + id
      break
    case 'store':
      url = `/subpages/store/index?id=${id}`
      break
    case 'custom':
      url = id
      break
    case 'liverooms':
      url = 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + id
      break
    default:
  }

  if (id === 'pointitems') {
    url = '/subpages/pointshop/list'
  }

  if (id == 'applyChief') {
    url = `/subpages/community/apply-chief?distributor_id=${dtid || distributor_id}`
  }

  if (linkPage === 'other_wxapp') {
    Taro.navigateToMiniProgram({
      appId: data.extra.appid,
      path: data.extra.path
    })
  } else {
    Taro.navigateTo({
      url
    })
  }
}

function clearPurchaseDtid(){
  store.dispatch({
    type: 'purchase/updateCurDistributorId', payload: null
  })
}

export default linkPage
