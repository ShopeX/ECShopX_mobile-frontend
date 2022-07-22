import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { TABBAR_PATH, TABBAR_ICON } from '@/consts'
import { classNames, styleNames, getCurrentRoute } from '@/utils'
import { intercept as routerIntercept } from '@/plugin/routeIntercept'
import './index.scss'

function SpTabbar(props) {
  const { colorPrimary, tabbar = {} } = useSelector((state) => state.sys)
  const { cartCount = 0 } = useSelector((state) => state.cart)
  const { className } = props

  const { color, backgroundColor, selectedColor } = tabbar?.config || {}
  const tabList = tabbar?.data.map((item) => {
    return {
      title: item.text,
      name: item.name,
      iconType: item.iconPath ? '' : TABBAR_ICON[item.name],
      selectedIconType: item.selectedIconPath ? '' : `${TABBAR_ICON[item.name]}-fill`,
      iconPrefixClass: 'iconfont icon',
      image: item.iconPath,
      selectedImage: item.selectedIconPath,
      url: item.pagePath,
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
      if (routerIntercept.routes?.[process.env.APP_PLATFORM]?.[TABBAR_PATH[tab.name]]) {
        return (
          routerIntercept.routes?.[process.env.APP_PLATFORM]?.[TABBAR_PATH[tab.name]] ==
          `/${currentPage}`
        )
      } else {
        return TABBAR_PATH[tab.name] == `/${currentPage}`
      }
    })
  }

  console.log('currentIndex:', currentIndex)

  const handleTabbarClick = (index) => {
    const tabItem = tabList[index]
    const { path } = getCurrentRoute()
    if (path != TABBAR_PATH[tabItem.name]) {
      Taro.redirectTo({ url: TABBAR_PATH[tabItem.name] })
    }
  }

  return (
    <AtTabBar
      fixed
      classNames={classNames(
        {
          'sp-tabbar': true
        },
        className
      )}
      // color={colorPrimary}
      iconSize='20'
      backgroundColor={backgroundColor}
      selectedColor={colorPrimary}
      tabList={tabList}
      onClick={handleTabbarClick}
      current={currentIndex}
    />
  )
}

SpTabbar.options = {
  addGlobalClass: true
}

export default SpTabbar
