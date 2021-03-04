import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabBar } from 'taro-ui'
import { getCurrentRoute } from '@/utils'
import S from '@/spx'
// import { getTotalCount } from '@/store/cart'

@connect(({ tabBar,cart }) => ({
  tabBar: tabBar.current,
  cartCount: cart.cartCount
}))
export default class TabBar extends Component {

  constructor (props) {
    super(props)

    this.state = {
      localCurrent: 0,
      backgroundColor: '',
      color: '',
      selectedColor: '#1f82e0',
      tabList: []
    }
  }
  
  componentDidMount () {
    this.initTabbarData()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.current !== undefined) {
      this.setState({ localCurrent: nextProps.current })
    }
    if (this.props.cartCount !== nextProps.cartCount) {
      setTimeout(() => {
        this.initTabbarData()
      })
    }
  }

  componentDidShow () {
    if (this.state.tabList.length > 0) {
      this.fetchCart()
    }
  }

  static options = {
    addGlobalClass: true
  }

  initTabbarData () {
    const { tabBar } = this.props
    let list = []
    list = [
      { title: '首页', iconType: 'home', iconPrefixClass: 'icon', url: '/guide/pages/index', urlRedirect: true },
      { title: '分类', iconType: 'category', iconPrefixClass: 'icon', url: '/guide/pages/category/index', urlRedirect: true },
      { title: '优惠券', iconType: 'member', iconPrefixClass: 'icon', url: '/guide/pages/member/index', urlRedirect: true },
      { title: '种草', iconType: 'member', iconPrefixClass: 'icon', url: '/guide/pages/recommend/list', urlRedirect: true },
      { title: '购物车', iconType: 'cart', iconPrefixClass: 'icon', url: '/guide/pages/cart/espier-index', text: this.cartCount || '', max: '99',urlRedirect: true },
    ]

    // if (tabBar) {
    //   const { config, data } = tabBar
    //   const { backgroundColor, color, selectedColor } = config
    //   this.setState({
    //     backgroundColor,
    //     color,
    //     selectedColor
    //   })
    //   data.map(item => {
    //     let obj = {
    //       title: item.text,
    //       iconType: item.iconPath && item.selectedIconPath ? '' : item.name,
    //       iconPrefixClass: 'icon',
    //       image: item.iconPath,
    //       selectedImage: item.selectedIconPath,
    //       url: item.pagePath,
    //       urlRedirect: true
    //     }
    //     if (item.name === 'cart') {
    //       Object.assign(obj, {text: this.cartCount || '', max: '99'})
    //     }
    //     list.push(obj)
    //   })
    // } else {

    // }

    this.setState({
      tabList: list,
    }, () => {
      this.updateCurTab()
    })
  }

  get cartCount () {
    // console.log('computed')
    return this.props.cartCount
  }

  get tabBar () {
    let initTabBar = Taro.getStorageSync('initTabBar')
    if (this.props.tabBar && initTabBar == true) {
      Taro.setStorageSync('initTabBar', false)
      this.initTabbarData()
    }
  }

  updateCurTab () {
    this.fetchCart()
    const { tabList, localCurrent } = this.state
    const fullPath = ((getCurrentRoute(this.$router).fullPath).split('?'))[0]
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

  async fetchCart () {
    if (!S.getAuthToken()) return
    const { tabList } = this.state
    const cartTabIdx = tabList.findIndex(item => item.url.indexOf('cart') !== -1)
    const updateCartCount = (count) => {
      tabList[cartTabIdx].text = count || ''
      this.setState({
        tabList
      })
    }

    const { path } = getCurrentRoute(this.$router)
    if (this.state.tabList[cartTabIdx] && (path === this.state.tabList[cartTabIdx].url)) {
      updateCartCount('')
      return
    }

  }

  handleClick = (current) => {
    const cur = this.state.localCurrent
    const {showbar = true} = this.props
    if(!showbar){
      return false
    }

    if (cur !== current) {
      const curTab = this.state.tabList[current]
      const { url, withLogin } = curTab
      const fullPath = ((getCurrentRoute(this.$router).fullPath).split('?'))[0]
      if (withLogin && !S.getAuthToken()) {
        return Taro.navigateTo({
          url: APP_AUTH_PAGE
        })
      }

      if (url && fullPath !== url) {
        // if (!urlRedirect || (url === '/pages/member/index' && !S.getAuthToken())) {
        //   Taro.navigateTo({ url })
        // } else {
        Taro.redirectTo({ url })
        // }
      }
    }
  }

 

  render () {
    const { color, backgroundColor, selectedColor, tabList, localCurrent } = this.state
 

    if (APP_INTEGRATION) {
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
