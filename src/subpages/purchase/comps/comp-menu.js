/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { isWeb } from '@/utils'
import { useTranslation, $t } from '@/i18n'
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
    nameKey: 'f367f1ff.83d472',
    icon: 'm_menu_jiatingfengxiang.png',
    link: `/subpages/purchase/share`
  },
  {
    key: 'dianwu',
    nameKey: 'f367f1ff.e88f0c',
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
  useTranslation()
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
    <CompPanel title={$t('f367f1ff.202c27')}>
      <View className='comp-menu'>
        {menus.map((item, index) => (
          <View className='menu-item' key={`menu-item__${index}`} onClick={onLink.bind(this, item)}>
            <SpImage className='menu-image' src={item.icon} width={100} height={100} />
            <Text className='menu-name'>
              {item.key == 'popularize'
                ? isPromoter
                  ? $t(item.nameKey)
                  : $t('f367f1ff.2a7f66')
                : $t(item.nameKey)}
            </Text>
          </View>
        ))}
      </View>
    </CompPanel>
  )
}

export default CompMenu
