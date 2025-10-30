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
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtTabBar } from 'taro-ui'
import { getCurrentRoute } from '@/utils'
import S from '@/spx'

const defaultTabList = []

// @connect(({ tabBar, cart }) => ({
//   tabBar: tabBar.current,
//   cartCount: cart.cartCount
// }))
export default class TabBar extends Component {
  $instance = getCurrentInstance()
  constructor(props) {
    super(props)

    this.state = {
      localCurrent: 0,
      backgroundColor: '',
      color: '',
      selectedColor: '#1f82e0',
      tabList: []
    }
  }

  static options = {
    addGlobalClass: true
  }

  componentDidMount() {
    this.initTabbarData()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current) {
      this.setState({ localCurrent: nextProps.current })
    }
    this.initTabbarData(nextProps)
  }

  componentDidShow() {
    if (this.state.tabList.length > 0) {
      this.fetchCart()
    }
  }

  initTabbarData(props) {
    const { tabBar } = Object.assign(this.props, props)
    let list = []

    if (tabBar) {
      const { config, data } = tabBar
      const { backgroundColor, color, selectedColor } = config
      this.setState({
        backgroundColor,
        color,
        selectedColor
      })
      data.map((item) => {
        let obj = {
          title: item.text,
          iconType: item.iconPath && item.selectedIconPath ? '' : item.name,
          iconPrefixClass: 'iconfont icon',
          image: item.iconPath,
          selectedImage: item.selectedIconPath,
          url: item.pagePath,
          urlRedirect: true
        }
        if (item.name === 'cart') {
          Object.assign(obj, { text: this.cartCount || '', max: '99' })
        }
        list.push(obj)
      })
    } else {
      list = [
        {
          title: '首页',
          iconType: 'home',
          iconPrefixClass: 'iconfont icon',
          url: '/pages/index',
          urlRedirect: true
        },
        {
          title: '分类',
          iconType: 'category',
          iconPrefixClass: 'iconfont icon',
          url: '/pages/category/index',
          urlRedirect: true
        },
        {
          title: '购物车',
          iconType: 'cart',
          iconPrefixClass: 'iconfont icon',
          url: '/pages/cart/espier-index',
          text: this.cartCount || '',
          max: '99',
          urlRedirect: true
        },
        {
          title: '我的',
          iconType: 'member',
          iconPrefixClass: 'iconfont icon',
          url: '/subpages/member/index',
          urlRedirect: true
        }
      ]
    }

    this.setState(
      {
        tabList: [...list]
      },
      () => {
        this.updateCurTab()
      }
    )
  }

  get cartCount() {
    // console.log('computed')
    return this.props.cartCount
  }

  // get tabBar() {
  //   let initTabBar = Taro.getStorageSync('initTabBar')
  //   if (this.props.tabBar && initTabBar == true) {
  //     Taro.setStorageSync('initTabBar', false)
  //     this.initTabbarData()
  //   }
  // }

  updateCurTab() {
    this.fetchCart()
    const { tabList, localCurrent } = this.state
    const fullPath = getCurrentRoute(this.$instance.router).fullPath.split('?')[0]

    console.log('--updateCurTab--', localCurrent, fullPath, tabList)

    if (tabList.length == 0) {
      return
    }
    const { url } = tabList[localCurrent] || {}
    if (url && url !== fullPath) {
      const nCurrent = tabList.findIndex((t) => t.url === fullPath) || 0
      this.setState({
        localCurrent: nCurrent
      })
    }
  }

  async fetchCart() {
    if (!S.getAuthToken()) return
    const { tabList } = this.state
    const cartTabIdx = tabList.findIndex((item) => item.url.indexOf('cart') !== -1)
    const updateCartCount = (count) => {
      tabList[cartTabIdx].text = count || ''
      this.setState({
        tabList
      })
    }

    const { path } = getCurrentRoute(this.$instance.router)
    if (this.state.tabList[cartTabIdx] && path === this.state.tabList[cartTabIdx].url) {
      updateCartCount('')
      return
    }
  }

  handleClick = (current) => {
    const cur = this.state.localCurrent
    const { showbar = true } = this.props
    if (!showbar) {
      return false
    }

    if (cur !== current) {
      const curTab = this.state.tabList[current]
      const { url, withLogin } = curTab
      const fullPath = getCurrentRoute(this.$instance.router).fullPath.split('?')[0]

      if (withLogin && !S.getAuthToken()) {
        return Taro.navigateTo({
          url: APP_AUTH_PAGE
        })
      }
      if (url && fullPath !== url) {
        // if (!urlRedirect || (url === '/subpages/member/index' && !S.getAuthToken())) {
        //   Taro.navigateTo({ url })
        // } else {
        Taro.redirectTo({ url })
        // }
      }
    }
  }

  render() {
    const { color, backgroundColor, selectedColor, tabList, localCurrent } = this.state
    const { tabBar } = this.props

    return (
      <AtTabBar
        fixed
        color={color}
        backgroundColor={backgroundColor}
        selectedColor={selectedColor}
        tabList={tabList}
        onClick={this.handleClick}
        current={localCurrent}
      />
    )
  }
}
