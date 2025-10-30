// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React from 'react'
import { View, Image, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { isWeb } from '@/utils'
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
    name: '分享亲友',
    icon: 'm_menu_jiatingfengxiang.png',
    link: `/subpages/purchase/share`
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
  if (!accessMenu) {
    return null
  }
  let menus = MENUS.filter((item) => accessMenu[item.key])
  if (isWeb) {
    menus = menus.filter((m_item) => m_item.key != 'popularize')
  }

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
