/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import React from 'react'
import { View, Image, Text } from '@tarojs/components'
import { SpImage, SpLogin, SpCell } from '@/components'
import { isWeixin, VERSION_PLATFORM, VERSION_STANDARD } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './comp-menu.scss'

function CompMenu(props) {
  useTranslation()
  const { accessMenu, onLink = () => {}, isPromoter, zitiNum } = props
  let menus = []
  if (isWeixin && accessMenu.popularize) {
    menus = menus.concat({
      key: 'popularize',
      icon: 'm_menu_tuiguang.png',
      link: '/marketing/pages/distribution/index'
    })
  }
  if (isWeixin && accessMenu.dianwu) {
    menus = menus.concat({
      key: 'dianwu',
      icon: 'm_menu_dianwu.png',
      link: '/subpages/dianwu/index'
    })
  }
  // if ((VERSION_PLATFORM || VERSION_STANDARD) && isWeixin && accessMenu.purchase) {
  //   menus = menus.concat({
  //     key: 'purchase',
  //     name: '内购',
  //     icon: 'm_menu_jiatingfengxiang.png',
  //     link: '/pages/purchase/auth'
  //   })
  // }

  // if (accessMenu.salesPersonList?.total_count > 0) {
  //   menus = menus.concat([
  //     {
  //       key: 'salesman',
  //       name: '业务员',
  //       icon: 'salesman.png',
  //       link: '/subpages/salesman/index'
  //     }
  //   ])
  // }

  if (isWeixin && accessMenu.deliveryStaffList?.total_count > 0) {
    menus = menus.concat([
      {
        key: 'delivery',
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
            title={
              item.key == 'popularize'
                ? isPromoter
                  ? $t('401e9e14.ed7e63')
                  : $t('401e9e14.2a7f66')
                : item.key == 'dianwu'
                ? $t('401e9e14.e88f0c')
                : $t('401e9e14.b7765e')
            }
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
