import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { classNames, entryLaunch, getCurrentRoute, getDistributorId,isWeb } from '@/utils'
import './comp-tabbar.scss'

const TABBAR_LIST = [
  {
    title: '首页',
    iconType: 'dianpushouye',
    url: '/subpages/salesman/index'
  },
  // {
  //   title: '购物车',
  //   iconType: 'dianpushangpinlist',
  //   url: '/subpages/salesman/cart'
  // },
  {
    title: '我的信息',
    iconType: 'dianpufenlei',
    url: '/subpages/salesman/my'
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
    if (path != tabItem.url) {
      Taro.redirectTo({ url: `${tabItem.url}` })
    }
  }

  return (
    <AtTabBar
      fixed
      classNames={classNames(
        {
          'comp-tabbar': true
        }
      )}
      iconSize='20'
      selectedColor={'#4980FF'}
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
