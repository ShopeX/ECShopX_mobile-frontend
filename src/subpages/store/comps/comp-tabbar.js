/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { classNames, entryLaunch, getCurrentRoute, getDistributorId, isWeb } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './comp-tabbar.scss'

const TABBAR_LIST = [
  {
    iconType: 'dianpushouye',
    url: '/subpages/store/index'
  },
  {
    iconType: 'dianpushangpinlist',
    url: '/subpages/store/item-list'
  },
  {
    iconType: 'dianpufenlei',
    url: '/subpages/store/category'
  }
]

function CompTabbar(props) {
  useTranslation()
  const { colorPrimary } = useSelector((state) => state.sys)

  const tabList = TABBAR_LIST.map((item, index) => {
    const titleKeys = ['6d4728b0.e8f64a', '6d4728b0.437974', '6d4728b0.c3ece5']
    const title = $t(titleKeys[index])
    return {
      title,
      name: title,
      iconType: item.iconType,
      selectedIconType: `${item.iconType}-fill`,
      iconPrefixClass: 'iconfont icon',
      url: item.url
    }
  })

  let currentIndex = 0
  const pages = Taro.getCurrentPages()
  if (pages.length > 0) {
    let currentPage = pages[pages.length - 1].route
    currentPage = isWeb ? currentPage.split('?')[0] : `/${currentPage}`
    currentIndex = TABBAR_LIST.findIndex((tab) => {
      return tab.url == currentPage
    })
  }

  console.log('comp-tabbar currentIndex:', currentIndex)

  const handleTabbarClick = async (index) => {
    const tabItem = tabList[index]
    const { path } = getCurrentRoute()
    const { id, dtid } = await entryLaunch.getRouteParams()
    const distributor_id = getDistributorId(id || dtid)
    if (path != tabItem.url) {
      Taro.redirectTo({ url: `${tabItem.url}?dtid=${distributor_id}` })
    }
  }

  return (
    <AtTabBar
      fixed
      classNames={classNames({
        'comp-tabbar': true
      })}
      iconSize='20'
      selectedColor={colorPrimary}
      tabList={tabList}
      onClick={handleTabbarClick}
      current={currentIndex}
    />
  )
}

CompTabbar.options = {
  addGlobalClass: true
}

export default CompTabbar
