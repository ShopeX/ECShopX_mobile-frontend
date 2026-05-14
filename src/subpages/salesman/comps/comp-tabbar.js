/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { classNames, getCurrentRoute, isWeb } from '@/utils'
import { updateSalesmanCount } from '@/store/slices/cart'
import { useTranslation, $t } from '@/i18n'
import './comp-tabbar.scss'

const TABBAR_ROUTES = [
  {
    iconType: 'dianpushouye',
    url: '/subpages/salesman/index'
  },
  {
    iconType: 'dianpufenlei',
    url: '/subpages/salesman/my'
  }
]

function CompTabbar(props) {
  useTranslation()
  const dispatch = useDispatch()
  const { cartSalesman = 0 } = useSelector((state) => state.cart)

  const TABBAR_LIST = useMemo(
    () => [
      {
        title: $t('1734e75c.db1c89'),
        iconType: TABBAR_ROUTES[0].iconType,
        url: TABBAR_ROUTES[0].url
      },
      {
        title: $t('1734e75c.041759'),
        iconType: TABBAR_ROUTES[1].iconType,
        url: TABBAR_ROUTES[1].url
      }
    ],
    []
  )

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
