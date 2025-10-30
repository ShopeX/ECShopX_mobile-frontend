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
import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { classNames, entryLaunch, getCurrentRoute, getDistributorId, isWeb } from '@/utils'
import { updateCartSalesman, updateSalesmanCount } from '@/store/slices/cart'
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
  //   url: '/subpages/salesman/cart',
  //   text: true
  // },
  {
    title: '我的信息',
    iconType: 'dianpufenlei',
    url: '/subpages/salesman/my'
  }
]

function CompTabbar(props) {
  const dispatch = useDispatch()
  const { colorPrimary } = useSelector((state) => state.sys)
  const { cartSalesman = 0 } = useSelector((state) => state.cart)

  useEffect(() => {
    // 初始化购物车数量
    // cartSalesmanNumber()
  }, [])

  const cartSalesmanNumber = async () => {
    await dispatch(updateSalesmanCount({ shop_type: 'distributor', isSalesmanPage: 1 }))
  }

  const tabList = TABBAR_LIST.map((item) => {
    return {
      title: item.title,
      name: item.title,
      iconType: item.iconType,
      selectedIconType: `${item.iconType}-fill`,
      iconPrefixClass: 'iconfont icon',
      url: item.url,
      text: item?.text ? (cartSalesman > 0 ? cartSalesman : null) : null
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
      classNames={classNames({
        'comp-tabbar': true
      })}
      iconSize='20'
      selectedColor='#4980FF'
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
