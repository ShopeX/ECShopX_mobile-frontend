import Taro, { getCurrentInstance } from '@tarojs/taro'
import { stringify } from 'qs'
import configStore from '@/store'

const { store } = configStore()

function linkPage(data) {
  const {
    id,
    title,
    linkPage,
    linkType,
    type,
    distributor_id,
    navigation = false,
    content,
    seletedTags = []
  } = data
  const { id: dtid } = getCurrentInstance().router.params
  if (id === 'homeSearch') {
    Taro.navigateTo({
      url: '/pages/item/list'
    })
    return
  }
  // h5链接
  if (linkType == 1) {
    Taro.navigateTo({
      url: `/pages/webview?url=${encodeURIComponent(data.linkUrl)}`
    })
    return
  }
  if (navigation) {
    let tags = []
    seletedTags.forEach((item) => {
      tags.push({
        tag_id: item.tag_id,
        tag_name: item.tag_name
      })
    })
    let seleted = stringify(tags)
    Taro.navigateTo({
      url: `/subpages/ecshopx/navigation-ibs?content=${content}&id=${id}&seletedTags=${encodeURIComponent(
        seleted
      )}`
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
    // case 'marketing':
    //   if (id == 'coupon_list') {
    //     url = '/subpages/marketing/coupon-center'
    //   } else if (id == 'groups_list') {
    //     url = '/marketing/pages/item/group-list'
    //   }
    //   break
    case 'seckill':
      url = '/marketing/pages/item/seckill-goods-list?seckill_id=' + id
      break
    case 'purchase_activity':
      url = '/subpages/purchase/select-identity?is_redirt=1&activity_id=' + id
      clearPurchaseDtid()
      break
    case 'link':
      const { path = '' } = memberSetting[id] || {}
      url = path
      if (id == 'purchase') {
        clearPurchaseDtid()
      } else if (id == 'applyChief') {
        url += `?distributor_id=${dtid || distributor_id}`
      }
      // if (id == 'purchase') {
      //   clearPurchaseDtid()
      // } else if (id == 'recharge') {
      //   url = '/others/pages/recharge/index'
      // } else if (id == 'serviceH5Coach') {
      // } else if (id == 'pointShop') {
      //   url = '/subpages/pointshop/list'
      // } else if (id == 'levelMemberVip') {
      //   url = '/subpage/pages/vip/vipgrades'
      // } else if (id == 'serviceH5Coach') {
      //   url = '/marketing/pages/service/wap-link?tp=o'
      // } else if (id == 'serviceH5Sales') {
      //   url = '/marketing/pages/service/wap-link?tp=r'
      // } else if (id == 'storelist') {
      //   url = '/marketing/pages/service/store-list'
      // } else if (id == 'aftersales') {
      //   url = '/marketing/pages/service/refund-car'
      // } else if (id == 'mycoach') {
      //   url = '/marketing/pages/service/online-guide'
      // } else if (id == 'hottopic') {
      //   url = '/pages/recommend/list'
      // } else if (id === 'floorguide') {
      //   url = '/pages/floorguide/index'
      // } else if (id === 'grouppurchase') {
      //   url = '/groupBy/pages/home/index'
      // } else if (id === 'registActivity') {
      //   url = '/marketing/pages/member/activity-list'
      // } else if (id == 'applyChief') {
      //   url += `?distributor_id=${dtid || distributor_id}`
      // } else {
      //   url = ''
      // }
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

  // if (id == 'applyChief') {
  //   url = `/subpages/community/apply-chief?distributor_id=${dtid || distributor_id}`
  // }

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

function clearPurchaseDtid() {
  store.dispatch({
    type: 'purchase/updateCurDistributorId',
    payload: null
  })
}

const memberSetting = {
  vipgrades: {
    title: '会员开通',
    path: '/subpage/pages/vip/vipgrades'
  },
  applyChief: {
    title: '社区团长申请',
    path: '/subpages/community/apply-chief'
  },
  recharge: {
    title: '储值卡',
    path: '/others/pages/recharge/index'
  },
  purchase: {
    title: '内购',
    path: '/subpages/purchase/select-identity?is_redirt=1'
  },
  pointShop: {
    title: '积分商城',
    path: '/subpages/pointshop/list'
  },
  registActivity: {
    title: '报名活动', // 我的活动
    path: '/marketing/pages/member/activity-list'
  },
  group: {
    title: '我的拼团',
    path: '/marketing/pages/member/group-list'
  },
  boost_activity: {
    // 平台版本隐藏助力活动和助力订单
    title: '助力活动',
    path: '/boost/pages/home/index'
  },
  boost_order: {
    // 平台版本隐藏助力活动和助力订单
    title: '助力订单',
    path: '/boost/pages/order/index'
  },
  coupon_list: {
    title: '优惠券',
    path: '/subpages/marketing/coupon-center'
  },
  my_collect: {
    title: '我的收藏',
    path: '/pages/member/item-fav'
  },
  tenants: {
    // 云店版本不显示
    title: '商家入驻',
    path: '/subpages/merchant/login'
  },
  address: {
    title: '地址管理',
    path: '/marketing/pages/member/address'
  },
  groups_list: {
    title: '限时团购',
    path: '/marketing/pages/item/group-list'
  },
  hottopic: {
    title: '种草列表',
    path: '/pages/recommend/list'
  },
  zitiOrder: {
    title: '自提订单',
    path: '/subpages/trade/ziti-list'
  },
  community_group_enable: {
    // H5不支持
    title: '社区团购',
    path: '/subpages/community/index'
  },
  storelist: {
    title: '店铺列表',
    path: '/marketing/pages/service/store-list'
  },
  floorguide: {
    title: '楼层引导',
    path: '/pages/floorguide/index'
  },
  grouppurchase: {
    title: '团购',
    path: '/groupBy/pages/home/index'
  },
  levelMemberVip: {
    title: '会员等级',
    path: '/subpage/pages/vip/vipgrades'
  },
  settings: {
    title: '设置',
    path: '/subpages/member/settings'
  }
}

export default linkPage
