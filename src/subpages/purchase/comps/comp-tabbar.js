import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { PURCHASE_TABBAR_PATH, PURCHASE_TABBAR_ICON } from '@/consts'
import { classNames, getCurrentRoute, paramsSplice } from '@/utils'
import { intercept as routerIntercept } from '@/plugin/routeIntercept'
import './comp-tabbar.scss'

const TABBAR_LIST = [
  {
    title: '首页',
    iconType: 'shouye',
    url: 'subpages/purchase/index'
  },
  {
    title: '分类',
    iconType: 'fenlei',
    url: 'subpages/purchase/category'
  },
  {
    title: '购物车',
    iconType: 'gwche',
    url: 'subpages/purchase/espier-index'
  },
  {
    title: '我的',
    iconType: 'huiyuan',
    url: 'subpages/purchase/member'
  }
]

function CompTabbar(props) {
  const { colorPrimary } = useSelector((state) => state.sys)
  const { tabbar, purchase_share_info = {} } = useSelector((state) => state.purchase)
  const { cartCount = 0 } = useSelector((state) => state.cart)
  const { backgroundColor } = tabbar?.config || {}

  const tabList = tabbar?.data.map((item) => {
    return {
      title: item.text,
      name: item.name,
      iconType: item.iconPath ? '' : PURCHASE_TABBAR_ICON[item.name],
      selectedIconType: item.selectedIconPath ? '' : `${PURCHASE_TABBAR_ICON[item.name]}-fill`,
      iconPrefixClass: 'iconfont icon',
      image: item.iconPath,
      selectedImage: item.selectedIconPath,
      url: PURCHASE_TABBAR_PATH[item.name],
      urlRedirect: true,
      text: item.text === '购物车' && cartCount > 0 ? cartCount : null,
      max: item.max
    }
  })

  let currentIndex = 0
  const pages = Taro.getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1].route
    currentIndex = tabList?.findIndex((tab) => {
      if (routerIntercept.routes?.[process.env.APP_PLATFORM]?.[PURCHASE_TABBAR_PATH[tab.name]]) {
        return (
          routerIntercept.routes?.[process.env.APP_PLATFORM]?.[PURCHASE_TABBAR_PATH[tab.name]] ==
          `/${currentPage}`
        )
      } else {
        return PURCHASE_TABBAR_PATH[tab.name] == `/${currentPage}`
      }
    })
  }

  console.log('comp-tabbar currentIndex:', currentIndex)

  const handleTabbarClick = async (index) => {
    const tabItem = tabList[index]
    console.log(tabItem, 'tabItem')
    const { path } = getCurrentRoute()
    if (path != tabItem.url) {
      Taro.redirectTo({ url: `/${tabItem.url}` })
      // Taro.redirectTo({ url: `/${tabItem.url}?${paramsSplice(purchase_share_info)}` })
    }
  }

  console.log(tabbar, 'tabbar')

  return (
    <AtTabBar
      fixed
      classNames={classNames({ 'comp-tabbar': true })}
      iconSize='20'
      backgroundColor={backgroundColor}
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
