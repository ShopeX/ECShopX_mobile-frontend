import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { TABBAR_PATH } from '@/consts'
import { classNames, styleNames, getCurrentRoute } from '@/utils'
import './comp-tabbar.scss'

const TABLIST = [
  {
    title: '订单',
    iconType: 'home',
    iconPrefixClass: 'iconfont icon',
    url: '/subpages/community/order',
    urlRedirect: true
  },
  {
    title: '一键开团',
    iconType: 'home',
    iconPrefixClass: 'iconfont icon',
    url: '/subpages/community/group',
    urlRedirect: true
  },
  {
    title: '购物中心',
    iconType: 'home',
    iconPrefixClass: 'iconfont icon',
    url: '/pages/index',
    urlRedirect: true
  },
  {
    title: '个人中心',
    iconType: 'home',
    iconPrefixClass: 'iconfont icon',
    url: '/subpages/community/index',
    urlRedirect: true
  }
]

function CompTabbar(props) {
  const { tabbar = {} } = useSelector((state) => state.sys)
  const { className } = props

  const { color, backgroundColor, selectedColor } = tabbar?.config || {}
  let currentIndex = 0
  const pages = Taro.getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1].route
    currentIndex = TABLIST?.findIndex((tab) => tab.url == `/${currentPage}`)
  }

  console.log('currentIndex:', currentIndex)

  const handleTabbarClick = (index) => {
    const tabItem = TABLIST[index]
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
      tabList={TABLIST}
      onClick={handleTabbarClick}
      current={currentIndex}
    />
  )
}

CompTabbar.options = {
  addGlobalClass: true
}

export default CompTabbar
