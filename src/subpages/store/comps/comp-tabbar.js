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
import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { classNames, entryLaunch, getCurrentRoute, getDistributorId, isWeb } from '@/utils'
import './comp-tabbar.scss'

const TABBAR_LIST = [
  {
    title: '店铺首页',
    iconType: 'dianpushouye',
    url: '/subpages/store/index'
  },
  {
    title: '商品列表',
    iconType: 'dianpushangpinlist',
    url: '/subpages/store/item-list'
  },
  {
    title: '商品分类',
    iconType: 'dianpufenlei',
    url: '/subpages/store/category'
  }
]

function CompTabbar(props) {
  const { colorPrimary } = useSelector((state) => state.sys)

  const tabList = TABBAR_LIST.map((item) => {
    return {
      title: item.title,
      name: item.title,
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
