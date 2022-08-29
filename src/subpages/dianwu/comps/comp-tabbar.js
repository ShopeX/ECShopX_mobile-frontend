import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { classNames, entryLaunch, getCurrentRoute, getDistributorId } from '@/utils'
import './comp-tabbar.scss'

const TABBAR_LIST = [
  {
    title: '收银台',
    iconType: 'dianpushouye',
    url: '/subpages/dianwu/cashier'
  },
  {
    title: '商品查询',
    iconType: 'dianpushangpinlist',
    url: '/subpages/dianwu/list'
  },
  {
    title: '取单',
    iconType: 'dianpufenlei',
    url: '/subpages/dianwu/pending-checkout'
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
      selectedColor='#4d84fc'
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
