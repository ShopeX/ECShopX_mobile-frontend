import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabBar } from 'taro-ui'
import req from '@/api/req'
import api from '@/api'
import { navigateTo, getCurrentRoute } from '@/utils'
import S from '@/spx'
import { getTotalCount } from '@/store/cart'

@connect(({ tabBar }) => ({
  tabBar: tabBar.current
}))
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
      backgroundColor: '',
      color: '',
      selectedColor: '',
      tabList: []
    }
  }

  componentDidMount () {
    const { config, data } = this.props.tabBar
    const { backgroundColor, color, selectedColor } = config
    this.setState({
      backgroundColor,
      color,
      selectedColor
    })
    let list = []
    data.map(item => {
      let obj = {
        title: item.text,
        iconType: item.iconPath && item.selectedIconPath ? '' : item.name,
        iconPrefixClass: 'icon',
        image: item.iconPath,
        selectedImage: item.selectedIconPath,
        url: item.pagePath,
        urlRedirect: true
      }
      if (item.name === 'cart') {
        Object.assign(obj, {withLogin: true})
      }
      if (item.name === 'member') {
        Object.assign(obj, {withLogin: true, text: this.props.cartTotalCount || '', max: '99'})
      }
      list.push(obj)
    })
    this.setState({
      tabList: list
    }, () => {
      this.updateCurTab()
    })
  }

  componentDidShow () {
    if (this.state.tabList.length > 0) {
      this.fetchCart()
    }
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
    const { tabList } = this.state
    const cartTabIdx = tabList.findIndex(item => item.url.indexOf('cart') !== -1)
    const updateCartCount = (count) => {
      tabList[cartTabIdx].text = count || ''
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
          url: APP_AUTH_PAGE
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
        color={color}
        backgroundColor={backgroundColor}
        selectedColor={selectedColor}
        tabList={tabList}
        onClick={this.handleClick}
        current={current}
      />
    )
  }
}
