/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { classNames, getCurrentRoute } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './comp-tabbar.scss'

function CompTabbar(props) {
  const { i18n } = useTranslation()
  const { tabbar = {} } = useSelector((state) => state.sys)
  const { className } = props

  const tabList = useMemo(
    () => [
      {
        title: $t('d1c38327.4c117f'),
        iconType: 'home',
        iconPrefixClass: 'iconfont icon',
        url: '/subpages/community/order',
        urlRedirect: true
      },
      {
        title: $t('d1c38327.fe500e'),
        iconType: 'home',
        iconPrefixClass: 'iconfont icon',
        url: '/subpages/community/group',
        urlRedirect: true
      },
      {
        title: $t('d1c38327.6daddc'),
        iconType: 'home',
        iconPrefixClass: 'iconfont icon',
        url: '/pages/index',
        urlRedirect: true
      },
      {
        title: $t('d1c38327.409120'),
        iconType: 'home',
        iconPrefixClass: 'iconfont icon',
        url: '/subpages/community/index',
        urlRedirect: true
      }
    ],
    [i18n.language]
  )

  const { color, backgroundColor, selectedColor } = tabbar?.config || {}
  let currentIndex = 0
  const pages = Taro.getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1].route
    currentIndex = tabList?.findIndex((tab) => tab.url == `/${currentPage}`)
  }

  const handleTabbarClick = (index) => {
    const tabItem = tabList[index]
    const { path } = getCurrentRoute()
    if (path != tabItem.url) {
      Taro.redirectTo({ url: tabItem.url })
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
      color={color}
      iconSize='18'
      backgroundColor={backgroundColor}
      selectedColor={selectedColor}
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
