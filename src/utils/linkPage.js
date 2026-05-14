/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { stringify } from 'qs'
import configStore from '@/store'
import { setShowGuideConsultModal } from '@/store/slices/shop'
import { $t } from '@/i18n'
import { getDistributorId } from '.'

const { store } = configStore()

function linkPage(data) {
  console.log('linkPage----', data)
  const {
    id,
    title,
    linkPage,
    linkType,
    type,
    distributor_id,
    navigation = false,
    officialAccountRawId,
    officialArticleLink,
    content,
    seletedTags = []
  } = data
  const { id: dtid } = getCurrentInstance()?.router?.params
  console.log('id----', id)
  if (id === 'homeSearch') {
    Taro.navigateTo({
      url: '/subpages/item/list'
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
      url = `/subpages/item/espier-detail?id=${id}&dtid=${distributor_id || getDistributorId()}`
      break
    case 'sale_category':
      url = '/subpages/item/list?cat_id=' + id
      break
    case 'category':
    case 'management_category':
      url = '/subpages/item/list?main_cat_id=' + id
      break
    case 'article':
      url = '/pages/article/index?id=' + id
      break
    case 'planting':
      url = '/pages/recommend/detail?id=' + id
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
        url += `?distributor_id=${dtid || distributor_id || getDistributorId()}`
      } else if (id == 'kujiale') {
        url = '/subpages/case/list'
      } else if (id == 'nearby_store') {
        url = '/subpages/store/nearby-list'
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
      url = '/subpages/item/list?tag_id=' + id
      break
    case 'regactivity':
      url = '/marketing/pages/reservation/goods-reservate?activity_id=' + id
      break
    case 'liverooms':
      url = 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + id
      break
    case 'live':
      url = 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + id
      break
    case 'store':
      url = `/subpages/store/index?id=${id}`
      break
    case 'customer_service':
      // 企微导购服务 (id: guide_service)：与 FloatSalesperson 一致，弹出联系顾问弹框
      if (id === 'guide_service') {
        store.dispatch(setShowGuideConsultModal(true))
        return
      }
      if (id === 'officialProfile') {
        wx.openOfficialAccountProfile({
          username: officialAccountRawId,
          success: (res) => {
            console.log('res=========', res)
          },
          fail: (err) => {
            console.log('err=========', err)
          }
        })
        return
      }
      if (id === 'officialChat') {
        wx.openOfficialAccountChat({
          username: officialAccountRawId,
          success: (res) => {
            console.log('res=========', res)
          },
          fail: (err) => {
            console.log('err=========', err)
          }
        })
        return
      }
      if (id === 'officialArtical') {
        wx.openOfficialAccountArticle({
          url: officialArticleLink,
          success: (res) => {
            console.log('res=========', res)
          },
          fail: (err) => {
            console.log('err=========', err)
          }
        })
        return
      }
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
    title: $t('ece5ca3e.f035ca'),
    path: '/subpage/pages/vip/vipgrades'
  },
  applyChief: {
    title: $t('ece5ca3e.38d966'),
    path: '/subpages/community/apply-chief'
  },
  recharge: {
    title: $t('ece5ca3e.1200d5'),
    path: '/others/pages/recharge/index'
  },
  purchase: {
    title: $t('d0465c10.36d204'),
    path: '/subpages/purchase/select-identity'
  },
  pointShop: {
    title: $t('cc8689c4.a13364'),
    path: '/subpages/pointshop/list'
  },
  registActivity: {
    title: $t('ece5ca3e.7fb92b'), // 我的活动
    path: '/marketing/pages/member/activity-list'
  },
  group: {
    title: $t('9503e8f0.75a1d2'),
    path: '/marketing/pages/member/group-list'
  },
  boost_activity: {
    // 平台版本隐藏助力活动和助力订单
    title: $t('ece5ca3e.5c34aa'),
    path: '/boost/pages/home/index'
  },
  boost_order: {
    // 平台版本隐藏助力活动和助力订单
    title: $t('ece5ca3e.94b1e6'),
    path: '/boost/pages/order/index'
  },
  coupon_list: {
    title: $t('250b375e.2f3635'),
    path: '/subpages/marketing/coupon-center'
  },
  my_coupon: {
    title: '我的优惠券',
    path: '/subpages/marketing/coupon'
  },
  my_collect: {
    title: $t('ece5ca3e.975ff6'),
    path: '/pages/member/item-fav'
  },
  tenants: {
    // 云店版本不显示
    title: $t('ece5ca3e.1107a8'),
    path: '/subpages/merchant/login'
  },
  address: {
    title: $t('cb93ea29.bca1ea'),
    path: '/marketing/pages/member/address'
  },
  groups_list: {
    title: $t('ece5ca3e.f38e72'),
    path: '/marketing/pages/item/group-list'
  },
  hottopic: {
    title: $t('ece5ca3e.26b2d6'),
    path: '/pages/recommend/list'
  },
  zitiOrder: {
    title: $t('d5036137.9c9137'),
    path: '/subpages/trade/ziti-list'
  },
  community_group_enable: {
    // H5不支持
    title: $t('ece5ca3e.b7c829'),
    path: '/subpages/community/index'
  },
  storelist: {
    title: $t('5cfe28e8.a4d703'),
    path: '/marketing/pages/service/store-list'
  },
  floorguide: {
    title: $t('ece5ca3e.a5c567'),
    path: '/pages/floorguide/index'
  },
  grouppurchase: {
    title: $t('0b8348a9.f47464'),
    path: '/groupBy/pages/home/index'
  },
  levelMemberVip: {
    title: $t('ece5ca3e.6c1583'),
    path: '/subpage/pages/vip/vipgrades'
  },
  settings: {
    title: $t('162d72a5.e366cc'),
    path: '/subpages/member/settings'
  },
  itemList: {
    title: '商品列表',
    path: '/subpages/item/list'
  }
}

export default linkPage
