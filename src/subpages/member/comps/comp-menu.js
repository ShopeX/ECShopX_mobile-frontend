import Taro from '@tarojs/taro'
import React from 'react'
import { View, Image, Text } from '@tarojs/components'
import { SpImage, SpLogin, SpCell } from '@/components'
import {
  isWeixin,
  VERSION_PLATFORM,
  VERSION_STANDARD,
} from '@/utils'

import './comp-menu.scss'

function CompMenu(props) {
  const { accessMenu, onLink = () => {}, isPromoter, zitiNum } = props
  let menus = []
  if (isWeixin && accessMenu.popularize) {
    menus = menus.concat({
      key: 'popularize',
      name: '推广管理',
      icon: 'm_menu_tuiguang.png',
      link: '/marketing/pages/distribution/index'
    })
  }
  if (accessMenu.dianwu) {
    menus = menus.concat({
      key: 'dianwu',
      name: '店务管理',
      icon: 'm_menu_dianwu.png',
      link: '/subpages/dianwu/index'
    })
  }
  if ((VERSION_PLATFORM || VERSION_STANDARD) && isWeixin && accessMenu.purchase) {
      menus = menus.concat({
      key: 'purchase',
      name: '内购',
      icon: 'm_menu_jiatingfengxiang.png',
      link: '/pages/purchase/auth'
    })
  }

  if (accessMenu.salesPersonList?.total_count > 0) {
    menus = menus.concat([
      {
        key: 'salesman',
        name: '业务员',
        icon: 'salesman.png',
        link: '/subpages/salesman/index'
      }
    ])
  }

  if (accessMenu.deliveryStaffList?.total_count > 0) {
    menus = menus.concat([
      {
        key: 'delivery',
        name: '配送员',
        icon: 'delivery_personnel.png',
        link: '/subpages/delivery/index'
      }
    ])
  }

  if (menus.length == 0) return null

  return (
    <View className='comp-menu'>
      {menus.map((item, index) => (
        <SpLogin
          className='menu-item'
          key={`menu-item__${index}`}
          onChange={onLink.bind(this, item)}
        >
          <SpCell
            title={item.key == 'popularize' ? (isPromoter ? item.name : '我要推广') : item.name}
            value={item.key == 'zitiOrder' ? zitiNum : ''}
            border
            isLink
          />
        </SpLogin>
      ))}
    </View>
  )
}

export default CompMenu
