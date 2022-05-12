import Taro from '@tarojs/taro'
import React from 'react'
import { View, Image, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { classNames, styleNames, isWeb, VERSION_PLATFORM, VERSION_STANDARD } from '@/utils'
import { SG_APP_CONFIG } from '@/consts'

import './comp-menu.scss'

const MENUS = [
  {
    key: 'popularize',
    name: '推广管理',
    icon: 'm_menu_tuiguang.png',
    link: '/marketing/pages/distribution/index'
  },
  {
    key: 'group',
    name: '我的拼团',
    icon: 'm_menu_pintuan.png',
    link: '/marketing/pages/member/group-list'
  },
  // {
  //   key: 'pointMenu',
  //   name: '积分商城',
  //   icon: 'm_menu_poin.png',
  //   link: '/pointitem/pages/list'
  // },
  // {
  //   key: "boost_activity",
  //   name: "助力活动",
  //   icon: "m_menu_zhulihuodong.png",
  //   link: "/boost/pages/home/index",
  // },
  // {
  //   key: "boost_order",
  //   name: "助力订单",
  //   icon: "m_menu_zhulidingdan.png",
  //   link: "/boost/pages/order/index",
  // },
  // {
  //   key: 'offline_order',
  //   name: '线下订单',
  //   icon: 'm_menu_xianxiadingdan.png',
  //   link: '/others/pages/bindOrder/index'
  // },
  // community_order: { name: "社区团购", icon: "m_menu_tuangou.png" },
  {
    key: 'activity',
    name: '活动预约',
    icon: 'm_menu_baoming.png',
    link: '/marketing/pages/member/item-activity'
  },
  { key: 'prorate', name: '推广管理', icon: 'm_menu_tuiguang.png' },
  {
    key: 'purchase',
    name: '内购',
    icon: 'm_menu_tuangou.png',
    link: '/marketing/pages/member/purchase'
  },
  {
    key: 'dianwu',
    name: '店务管理',
    icon: 'm_menu_dianwu.png',
    link: '/subpages/dianwu/index'
  }

  // {
  //   key: "complaint",
  //   name: "投诉记录",
  //   icon: "m_menu_toushu.png",
  //   link: "/marketing/pages/member/complaint-record",
  // },
]

const MENUS_CONST = [
  {
    key: 'tenants',
    name: '商家入驻',
    icon: 'm_menu_merchat.png',
    link: '/subpages/merchant/login'
  }
]

// const MENUS_OFFLINE = [
//   {
//     key: 'offline_order',
//     name: '线下订单',
//     icon: 'm_menu_xianxiadingdan.png',
//     link: '/others/pages/bindOrder/index'
//   }
// ]

const MENUS_COMMUNITY = [
  {
    key: 'community',
    name: '社区团购',
    icon: 'm_menu_tuangou.png',
    link: '/subpages/community/index'
  }
]

function CompMenu(props) {
  const { accessMenu, onLink = () => {}, isPromoter } = props
  const config = Taro.getStorageSync(SG_APP_CONFIG)
  if (!accessMenu) {
    return null
  }
  let menus = MENUS.filter((item) => accessMenu[item.key])
  if (isWeb) {
    menus = menus.filter((m_item) => m_item.key != 'popularize')
  }
  if (!config.whitelist_status) {
    menus = menus.filter((m_item) => m_item.key != 'purchase')
  }
  //商家入驻是否开启
  if (accessMenu.merchant_status && !VERSION_STANDARD) {
    menus = menus.concat(MENUS_CONST)
  }

  // 社区团购
  if (VERSION_PLATFORM) {
    menus = menus.concat(MENUS_COMMUNITY)
  }

  // if (accessMenu.offline_order) {
  //   menus = menus.concat(MENUS_OFFLINE)
  // }

  return (
    <View className='comp-menu'>
      {menus.map((item, index) => (
        <View className='menu-item' key={`menu-item__${index}`} onClick={onLink.bind(this, item)}>
          <SpImage className='menu-image' src={item.icon} width={100} height={100} />
          <Text className='menu-name'>
            {item.key == 'popularize' ? (isPromoter ? item.name : '我要推广') : item.name}
          </Text>
        </View>
      ))}
    </View>
  )
}

export default CompMenu
