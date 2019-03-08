import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabBar } from 'taro-ui'
import api from '@/api'
import { navigateTo, getCurrentRoute } from '@/utils'
import S from '@/spx'

@connect(({ cart }) => ({
  cart,
  cartTotalCount: cart.list.reduce((acc, item) => item.quantity + acc, 0)
}), (dispatch) => ({
  onUpdateCart: (list) => dispatch({ type: 'cart/update', payload: { list } })
}))
export default class TabBar extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      current: 0,
      tabList: [
        { title: '首页', iconType: 'shop', iconPrefixClass: 'sp-icon', url: '/pages/home/index' },
        { title: '分类', iconType: 'menu', iconPrefixClass: 'sp-icon', url: '/pages/category/index' },
        { title: '购物车', iconType: 'cart', text: this.props.cartTotalCount || '', max: '99', iconPrefixClass: 'sp-icon', url: '/pages/cart/index' },
        { title: '会员', iconType: 'user', iconPrefixClass: 'sp-icon', url: '/pages/member/index' }
      ]
    }
  }

  componentDidMount () {
    this.fetchCart()
  }

  componentWillReceiveProps (nextProps) {
    const { tabList } = this.state

    if (nextProps.cartTotalCount != this.state.tabList[2].text) {
      tabList[2].text = nextProps.cartTotalCount
      this.setState({
        tabList
      })
    }

    if (nextProps.current !== undefined && nextProps.current !== this.state.current) {
      this.setState({ current: nextProps.current })
    }
  }

  async fetchCart () {
    if (!S.getAuthToken()) return

    try {
      const { list } = await api.cart.getBasic()
      this.props.onUpdateCart(list)
    } catch (e) {
      console.error(e)
    }
  }

  handleClick = (current) => {
    const cur = this.state.current
    this.setState({
      current
    })

    if (cur !== current) {
      const curTab = this.state.tabList[current]
      const { url, urlRedirect } = curTab
      const { fullPath } = getCurrentRoute(this.$router)

      if (url && fullPath !== url) {
        navigateTo(url, urlRedirect)
      }
    }
  }

  render () {
    const { tabList } = this.state
    return (
      <AtTabBar
        fixed
        tabList={tabList}
        onClick={this.handleClick}
        current={this.state.current}
      ></AtTabBar>
    )
  }
}
