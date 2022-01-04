import Taro from '@tarojs/taro'
import { useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { TABBAR_PATH } from '@/consts'
import { classNames, styleNames, getCurrentRoute } from '@/utils'
import './index.scss'

function SpTabbar (props) {
  const { tabbar } = useSelector((state) => state.sys)
  const { className } = props
  console.log('tabbar:', tabbar)

  const { color, backgroundColor, selectedColor } = tabbar.config
  const tabList = tabbar.data.map((item) => {
    return {
      title: item.text,
      name: item.name,
      iconType: item.iconPath && item.selectedIconPath ? '' : item.name,
      iconPrefixClass: 'iconfont icon',
      image: item.iconPath,
      selectedImage: item.selectedIconPath,
      url: item.pagePath,
      urlRedirect: true
    }
  })

  let currentIndex = 0
  const pages = Taro.getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1].route
    currentIndex = tabList.findIndex((tab) => TABBAR_PATH[tab.name] == `/${currentPage}`)
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

SpTabbar.options = {
  addGlobalClass: true
}

export default SpTabbar
