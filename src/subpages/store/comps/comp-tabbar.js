import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { classNames, entryLaunch, getCurrentRoute, getDistributorId } from '@/utils'
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
    const currentPage = pages[pages.length - 1].route
    currentIndex = TABBAR_LIST.findIndex((tab) => tab.url == `/${currentPage}`)
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
      classNames={classNames(
        {
          'comp-tabbar': true
        }
      )}
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
