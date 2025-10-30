// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { SG_DIANWU_TOKEN } from '@/consts'
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
  const $instance = getCurrentInstance()
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
    const { path } = $instance
    const { distributor_id } = $instance.router.params
    const token = Taro.getStorageSync(SG_DIANWU_TOKEN)
    if (path != tabItem.url) {
      Taro.redirectTo({
        url: `${tabItem.url}?token=${token}&distributor_id=${distributor_id}&from=tabbar`
      })
    }
  }

  return (
    <View className='comp-tabbar'>
      <AtTabBar
        iconSize='20'
        selectedColor='#4d84fc'
        tabList={tabList}
        onClick={handleTabbarClick}
        current={currentIndex}
      />
    </View>
  )
}

CompTabbar.options = {
  addGlobalClass: true
}

export default CompTabbar
