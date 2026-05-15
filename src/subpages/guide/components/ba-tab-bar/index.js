/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { getCurrentRoute, isIphoneX } from '@/utils'
import { DEFAULT_SAFE_AREA_HEIGHT } from '@/consts'
import { $t, i18n } from '@/i18n'
import S from '@/spx'
// import { getTotalCount } from '@/store/cart'

@connect(({ tabBar, cart }) => ({
  tabBar: tabBar.current,
  cartCount: cart.cartCount
}))
export default class TabBar extends Component {
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

  componentDidMount() {
    this._onLanguageChanged = () => this.initTabbarData()
    i18n.on('languageChanged', this._onLanguageChanged)
    this.initTabbarData()
  }

  componentWillUnmount() {
    if (this._onLanguageChanged) {
      i18n.off('languageChanged', this._onLanguageChanged)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== undefined) {
      this.setState({ localCurrent: nextProps.current })
    }
    if (this.props.cartCount !== nextProps.cartCount) {
      setTimeout(() => {
        this.initTabbarData()
      })
    }
  }

  componentDidShow() {
    if (this.state.tabList.length > 0) {
      this.fetchCart()
    }
  }

  static options = {
    addGlobalClass: true
  }

  initTabbarData() {
    const { tabBar } = this.props
    let list = []
    list = [
      {
        title: $t('1734e75c.db1c89'),
        iconType: 'home',
        iconPrefixClass: 'iconfont icon-home',
        url: '/subpages/guide/index',
        urlRedirect: true
      },
      {
        title: $t('e6f782b6.d0771a'),
        iconType: 'category',
        iconPrefixClass: 'iconfont icon-category',
        url: '/subpages/guide/category/index',
        urlRedirect: true
      },
      {
        title: $t('250b375e.2f3635'),
        iconType: 'member',
        iconPrefixClass: 'iconfont icon-coupon',
        url: '/subpages/guide/coupon-home/index',
        urlRedirect: true
      },
      {
        title: $t('f742d318.93f34a'),
        iconType: 'member',
        iconPrefixClass: 'iconfont icon-faverite',
        url: '/subpages/guide/recommend/list',
        urlRedirect: true
      },
      {
        title: $t('d886af7d.c017be'),
        iconType: 'cart',
        iconPrefixClass: 'iconfont icon-cart',
        url: '/subpages/guide/cart/espier-index',
        text: this.cartCount || '',
        max: '99',
        urlRedirect: true
      }
    ]
    this.setState(
      {
        tabList: list
      },
      () => {
        this.updateCurTab()
      }
    )
  }

  get cartCount() {
    return this.props.cartCount
  }

  get tabBar() {
    let initTabBar = Taro.getStorageSync('initTabBar')
    if (this.props.tabBar && initTabBar == true) {
      Taro.setStorageSync('initTabBar', false)
      this.initTabbarData()
    }
  }

  updateCurTab() {
    this.fetchCart()
    const { tabList, localCurrent } = this.state
    const fullPath = getCurrentRoute(getCurrentInstance()?.router).fullPath.split('?')[0]
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

    const { path } = getCurrentRoute(getCurrentInstance()?.router)
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
      console.log('tabbar-withLogin', url, withLogin)
      const fullPath = getCurrentRoute(getCurrentInstance()?.router).fullPath.split('?')[0]
      // if (withLogin && !S.getAuthToken()) {
      //   return Taro.navigateTo({
      //     url: process.env.APP_AUTH_PAGE
      //   });
      // }

      if (url && fullPath !== url) {
        // if (!urlRedirect || (url === '/pages/member/index' && !S.getAuthToken())) {
        //   Taro.navigateTo({ url })
        // } else {
        Taro.redirectTo({ url })
        // }
      }
    }
  }

  render() {
    const { color, backgroundColor, selectedColor, tabList, localCurrent } = this.state

    if (process.env.APP_INTEGRATION) {
      return <View></View>
    }

    return (
      <AtTabBar
        fixed
        color={color}
        customStyle={{
          height: this.props.height,
          paddingBottom: `${isIphoneX() ? Taro.pxTransform(DEFAULT_SAFE_AREA_HEIGHT) : 0}`
        }}
        backgroundColor={backgroundColor}
        selectedColor={selectedColor}
        tabList={tabList}
        onClick={this.handleClick}
        current={localCurrent}
      />
    )
  }
}
