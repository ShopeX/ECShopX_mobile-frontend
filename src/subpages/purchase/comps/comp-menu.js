import Taro from '@tarojs/taro'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Image, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import {
  classNames,
  styleNames,
  isWeixin,
  isWeb,
  VERSION_PLATFORM,
  VERSION_STANDARD,
  VERSION_IN_PURCHASE
} from '@/utils'
import { SG_APP_CONFIG } from '@/consts'
import CompPanel from './comp-panel'

import './comp-menu.scss'

const MENUS = [
  // {
  //   key: 'collection',
  //   name: '我的收藏',
  //   icon: 'm_menu_soucang.png',
  //   link: '/pages/member/item-fav'
  // }
  {
    key: 'purchase',
    name: '分享家属',
    icon: 'm_menu_jiatingfengxiang.png',
    link: '/subpages/purchase/index'
  },
  {
    key: 'dianwu',
    name: '店务管理',
    icon: 'm_menu_dianwu.png',
    link: '/subpages/dianwu/index'
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

// const MENUS_COMMUNITY = [
//   {
//     key: 'community',
//     name: '社区团购',
//     icon: 'm_menu_tuangou.png',
//     link: '/subpages/community/index'
//   }
// ]

function CompMenu(props) {
  const { accessMenu, onLink = () => {}, isPromoter } = props
  const { userInfo = {}, vipInfo = {} } = useSelector((state) => state.user)
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

  // if (userInfo?.is_employee) {
  //   menus.push({
  //     key: 'purchase',
  //     name: '分享家属',
  //     icon: 'm_menu_jiatingfengxiang.png',
  //     link: '/subpages/purchase/index'
  //   })
  // }

  if (menus.length == 0) {
    return null
  }

  return (
    <CompPanel title='我的服务'>
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
    </CompPanel>
  )
}

export default CompMenu
