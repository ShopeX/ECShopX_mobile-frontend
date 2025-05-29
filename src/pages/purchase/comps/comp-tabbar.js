import Taro, { useDidShow } from '@tarojs/taro'
import React, { useEffect, useState, memo } from 'react'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { classNames, entryLaunch, getCurrentRoute, getDistributorId, isWeb } from '@/utils'
import { updateCartSalesman, updateSalesmanCount } from '@/store/slices/cart'
import './comp-tabbar.scss'

const TABBAR_LIST = [
  {
    title: '活动',
    iconType: 'dianpushouye',
    url: '/pages/purchase/index'
  },
  {
    title: '身份切换',
    key: 'identity',
    iconType: 'dianpushangpinlist',
    url: '/subpages/purchase/select-identity',
    text: true
  },
  {
    title: '我的',
    iconType: 'dianpufenlei',
    url: '/subpages/purchase/member?from=purchase_home'
  }
]

function CompTabbar(props) {
  const dispatch = useDispatch()
  const { colorPrimary } = useSelector((state) => state.sys)
  const { cartSalesman = 0 } = useSelector((state) => state.cart)
  const { hasValidIdentity } = useSelector((state) => state.purchase)

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // 初始化购物车数量
    // cartSalesmanNumber()
  }, [])

  const cartSalesmanNumber = async () => {
    await dispatch(updateSalesmanCount({ shop_type: 'distributor', isSalesmanPage: 1 }))
  }

  let tabbarList = JSON.parse(JSON.stringify(TABBAR_LIST))
  // if(!hasValidIdentity){
  //   tabbarList = tabbarList.filter(item=>item.key != 'identity')
  // }

  const tabList = tabbarList.map((item) => {
    return {
      title: item.title,
      name: item.title,
      iconType: item.iconType,
      selectedIconType: `${item.iconType}-fill`,
      iconPrefixClass: 'iconfont icon',
      url: item.url
      // text: item?.text ? (cartSalesman > 0 ? cartSalesman : null) : null
    }
  })

  // let currentIndex = 0

  // const pages = Taro.getCurrentPages()
  // if (pages.length > 0) {
  //   let currentPage = pages[pages.length - 1].route
  //   currentPage = isWeb ? currentPage.split('?')[0] : `/${currentPage.split('?')[0]}`
  //   const _currentIndex =  tabbarList.findIndex((tab) => {
  //     return tab.url.split('?')[0] == currentPage
  //   })
  //   if(_currentIndex != -1){
  //     currentIndex = _currentIndex
  //   }
  // }

  useDidShow(() => {
    changeIndex()
  })

  useEffect(() => {
    changeIndex()
  }, [])

  const changeIndex = () => {
    const pages = Taro.getCurrentPages()
    if (pages.length > 0) {
      let currentPage = pages[pages.length - 1].route
      currentPage = isWeb ? currentPage.split('?')[0] : `/${currentPage.split('?')[0]}`
      const _currentIndex = tabbarList.findIndex((tab) => {
        return tab.url.split('?')[0] == currentPage
      })
      if (_currentIndex != -1) {
        setCurrentIndex(_currentIndex)
      }
    }
  }

  console.log('comp-tabbar currentIndex:', currentIndex)

  const handleTabbarClick = async (index) => {
    const tabItem = tabList[index]
    const { path } = getCurrentRoute()
    if (path != tabItem.url) {
      let url = `${tabItem.url}`
      // if (['/subpages/purchase/select-identity'].includes(tabItem.url)) {
      //   url = `${tabItem.url}`
      // }
      Taro.reLaunch({ url })
    }
  }

  return (
    <AtTabBar
      fixed
      classNames={classNames({
        'comp-tabbar': true
      })}
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
