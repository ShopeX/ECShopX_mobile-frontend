import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabBar } from 'taro-ui'
import api from '@/api'
import { navigateTo, getCurrentRoute } from '@/utils'
import S from '@/spx'
import { getTotalCount } from '@/store/cart'

// @connect(({ cart }) => ({
//   cart,
//   cartTotalCount: getTotalCount(cart)
// }), (dispatch) => ({
//   onUpdateCart: (list) => dispatch({ type: 'cart/update', payload: { list } })
// }))
export default class TabBar extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      current: 0,
      tabList: [
        { title: '首页', iconType: 'home', iconPrefixClass: 'in-icon', url: '/pages/home/index', urlRedirect: true },
        { title: '分类', iconType: 'menu', iconPrefixClass: 'in-icon', url: '/pages/category/index', urlRedirect: true },
        { title: '种草', iconType: 'grass', iconPrefixClass: 'in-icon', url: '/pages/recommend/list', urlRedirect: true },
        { title: '购物车', iconType: 'cart', iconPrefixClass: 'in-icon', url: '/pages/cart/espier-index', text: this.props.cartTotalCount || '', max: '99', withLogin: true, urlRedirect: true },
        { title: '个人中心', iconType: 'user', iconPrefixClass: 'in-icon', url: '/pages/member/index', urlRedirect: true, withLogin: true }
      ]
    }
  }

  componentDidMount () {
    this.updateCurTab()
  }

  componentDidShow () {
    this.fetchCart()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.current !== undefined) {
      this.setState({ current: nextProps.current })
    }
  }

  updateCurTab () {
    this.fetchCart()
    const { tabList, current } = this.state
    const { fullPath } = getCurrentRoute(this.$router)
    const { url } = tabList[current]
    if (url && url !== fullPath) {
      const nCurrent = tabList.findIndex((t) => t.url === fullPath) || 0
      this.setState({
        current: nCurrent
      })
    }
  }

  async fetchCart () {
    if (!S.getAuthToken()) return
    const cartTabIdx = 3
    const updateCartCount = (count) => {
      const { tabList } = this.state
      tabList[cartTabIdx].text = count
      this.setState({
        tabList
      })
    }

    const { path } = getCurrentRoute(this.$router)
    if (path === this.state.tabList[cartTabIdx].url) {
      updateCartCount('')
      return
    }

    try {
      const { item_count } = await api.cart.count()
      updateCartCount(item_count)
    } catch (e) {
      console.error(e)
    }
  }

  handleClick = (current) => {
    const cur = this.state.current

    if (cur !== current) {
      const curTab = this.state.tabList[current]
      const { url, urlRedirect, withLogin } = curTab
      const { fullPath } = getCurrentRoute(this.$router)

      if (withLogin && !S.getAuthToken()) {
        return Taro.redirectTo({
          url: '/pages/auth/login'
        })
      }

      if (url && fullPath !== url) {
        if (!urlRedirect || (url === '/pages/member/index' && !S.getAuthToken())) {
          Taro.navigateTo({ url })
        } else {
          Taro.redirectTo({ url })
        }
      }
    }
  }

  render () {
    const { tabList, current } = this.state

    // eslint-disable-next-line
    if (APP_INTEGRATION) {
      return <View></View>
    }

    return (
      <AtTabBar
        fixed
        tabList={tabList}
        onClick={this.handleClick}
        current={current}
      />
    )
  }
}
