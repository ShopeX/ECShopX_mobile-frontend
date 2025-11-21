/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { getCurrentPages } from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { TABBAR_PATH, TABBAR_ICON } from '@/consts'
import { classNames, styleNames, getCurrentRoute, isWeb } from '@/utils'
import { intercept as routerIntercept } from '@/plugin/routeIntercept'
import { updateCurDistributorId } from '@/store/slices/purchase'
import './index.scss'

function SpTabbar(props) {
  const navipage = '/pages/item/list?isTabBar=true'
  const { colorPrimary, tabbar = {} } = useSelector((state) => state.sys)
  const { cartCount = 0 } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
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
      customPageId: item?.customPage?.id,
      text: item.text === '购物车' && cartCount > 0 ? cartCount : null,
      max: item.max
    }
  })

  let currentIndex = 0
  const pages = Taro.getCurrentPages()
  if (pages.length > 0) {
    let currentPage = pages[pages.length - 1].route
    currentPage = isWeb ? currentPage.split('?')[0] : `/${currentPage}`
    const {
      params: { id: customPageId }
    } = getCurrentRoute()
    currentIndex = tabList?.findIndex((tab) => {
      if (currentPage == '/pages/custom/custom-page') {
        return tab.customPageId && customPageId == tab.customPageId
      } else {
        if (routerIntercept.routes?.[process.env.APP_PLATFORM]?.[TABBAR_PATH[tab.name]]) {
          return (
            routerIntercept.routes?.[process.env.APP_PLATFORM]?.[TABBAR_PATH[tab.name]] ==
            currentPage
          )
        } else {
          return TABBAR_PATH[tab.name] == currentPage
        }
      }
    })
  }

  const handleTabbarClick = (index) => {
    const tabItem = tabList[index]
    const {
      path,
      params: { id: customPageId }
    } = getCurrentRoute()
    // 如果是跳转自定义页面则判断id是否一致
    let otherCustomPage =
      path == '/pages/custom/custom-page' &&
      path == TABBAR_PATH[tabItem.name] &&
      tabItem.customPageId != customPageId
    if (path != TABBAR_PATH[tabItem.name] || otherCustomPage) {
      if (tabItem.name == 'purchase') {
        dispatch(updateCurDistributorId(null))
      }
      if (TABBAR_PATH[tabItem.name] !== navipage) {
        let url =
          tabItem.name == 'customPage'
            ? `${TABBAR_PATH[tabItem.name]}?isTabBar=true&id=${tabItem.customPageId}`
            : TABBAR_PATH[tabItem.name]
        Taro.redirectTo({ url })
      } else {
        Taro.navigateTo({ url: TABBAR_PATH[tabItem.name] })
      }
    }
  }

  return (
    <AtTabBar
      fixed
      classNames={classNames(
        {
          'sp-tabbar': true
        }
        // className,
      )}
      color={color}
      iconSize='20'
      backgroundColor={backgroundColor}
      selectedColor={selectedColor}
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
