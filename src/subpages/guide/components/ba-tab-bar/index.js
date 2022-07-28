import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtTabBar } from 'taro-ui'
import { getCurrentRoute } from '@/utils'
import S from '@/subpages/guide/lib/Spx.js'
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
    this.initTabbarData()
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
        title: '首页',
        iconType: 'home',
        iconPrefixClass: 'iconfont icon-home',
        url: '/subpages/guide/index',
        urlRedirect: true
      },
      {
        title: '分类',
        iconType: 'category',
        iconPrefixClass: 'iconfont icon-category',
        url: '/subpages/guide/category/index',
        urlRedirect: true
      },
      {
        title: '优惠券',
        iconType: 'member',
        iconPrefixClass: 'iconfont icon-coupon',
        url: '/subpages/guide/coupon-home/index',
        urlRedirect: true
      },
      {
        title: '种草',
        iconType: 'member',
        iconPrefixClass: 'iconfont icon-faverite',
        url: '/subpages/guide/recommend/list',
        urlRedirect: true
      },
      {
        title: '购物车',
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
    const fullPath = getCurrentRoute(getCurrentInstance().router).fullPath.split('?')[0]
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

    const { path } = getCurrentRoute(getCurrentInstance().router)
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
      const fullPath = getCurrentRoute(getCurrentInstance().router).fullPath.split('?')[0]
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
        backgroundColor={backgroundColor}
        selectedColor={selectedColor}
        tabList={tabList}
        onClick={this.handleClick}
        current={localCurrent}
      />
    )
  }
}
