/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { getCurrentPages } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { TABBAR_PATH, TABBAR_ICON, DEFAULT_SAFE_AREA_HEIGHT } from '@/consts'
import { classNames, styleNames, getCurrentRoute, isWeb, isIphoneX } from '@/utils'
import { intercept as routerIntercept } from '@/plugin/routeIntercept'
import './index.scss'
import SpImage from '../sp-image'

function SpTabbar() {
  const navipage = '/pages/item/list?isTabBar=true'
  const [currentIndex, setCurrentIndex] = useState(-1)
  const { tabbar = {} } = useSelector((state) => state.sys)
  const { cartCount = 0 } = useSelector((state) => state.cart)
  const { color, backgroundColor, selectedColor } = tabbar?.config || {}
  const { data: tabList = [] } = tabbar || {}

  const pages = Taro.getCurrentPages()
  useEffect(() => {
    if (pages.length > 0) {
      let currentPage = pages[pages.length - 1].route
      currentPage = isWeb ? currentPage.split('?')[0] : `/${currentPage}`
      const {
        params: { id: customPageId }
      } = getCurrentRoute()
      const currentIndex = tabList?.findIndex((tab) => {
        if (currentPage == '/pages/custom/custom-page') {
          console.log('customPageId', customPageId, tab.customPageId)
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
      if (currentIndex !== -1) {
        setCurrentIndex(currentIndex)
      }
    }
  }, [pages])

  const handleTabbarClick = (index) => {
    const tabItem = tabList[index]
    const {
      path,
      params: { id: customPageId }
    } = getCurrentRoute()
    if (tabItem.name == 'other_wxapp') {
      const path = tabItem.otherWxapp.wxLinkList.find(
        (item) => item.wx_external_routes_id == tabItem.otherWxapp.wx_external_routes_id
      )?.route_info

      // Taro.redirectTo({ url: `/pages/custom/custom-page?isTabBar=true&id=${tabItem.customPageId}` })
    }

    // 如果是跳转自定义页面则判断id是否一致
    let otherCustomPage =
      path == '/pages/custom/custom-page' &&
      path == TABBAR_PATH[tabItem.name] &&
      tabItem.customPageId != customPageId
    if (path != TABBAR_PATH[tabItem.name] || otherCustomPage) {
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
    <View className='sp-tabbar' style={{ backgroundColor: backgroundColor }}>
      {tabList?.map((item, index) => {
        const iconPath = index == currentIndex ? item.selectedIconPath : item.iconPath
        return (
          <View className='sp-tabbar__item' key={index} onClick={() => handleTabbarClick(index)}>
            {/* {index == 0 &&
              (index !== currentIndex ? (
                <>
                  <SpImage src={item.iconPath} className='sp-tabbar__item-image' mode='aspectFill' />
                  <View
                    className='sp-tabbar__item-text'
                    style={{ color: index == currentIndex ? selectedColor : color }}
                  >
                    {item.text}
                  </View>
                </>
              ) : (
                <SpImage
                  src={item.selectedIconPath}
                  className='sp-tabbar__item-cover-image'
                  mode='aspectFill'
                />
              ))} */}

            <View className='sp-tabbar__item-image-wrapper'>
              {/^http/.test(iconPath) ? (
                <SpImage src={iconPath} className='sp-tabbar__item-image' mode='aspectFill' />
              ) : (
                <Text
                  className={`iconfont ${
                    index == currentIndex
                      ? `icon-${TABBAR_ICON[item.name]}-fill`
                      : `icon-${TABBAR_ICON[item.name]}`
                  }`}
                ></Text>
              )}

              {item.name == 'cart' && cartCount > 0 && (
                <View className={`sp-tabbar__item-badge${cartCount > 99 ? '1' : ''}`}>
                  {cartCount > 0 && cartCount <= 99 && (
                    <Text className='cart-count'>{cartCount}</Text>
                  )}
                  {cartCount > 99 && <Text className='cart-count1'>99+</Text>}
                </View>
              )}
            </View>

            <View
              className='sp-tabbar__item-text'
              style={{ color: index == currentIndex ? selectedColor : color }}
            >
              {item.text}
            </View>
          </View>
        )
      })}
    </View>
  )
}

SpTabbar.options = {
  addGlobalClass: true
}

export default React.memo(SpTabbar)
