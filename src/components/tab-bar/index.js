import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtTabBar } from 'taro-ui'
import api from '@/api'

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
        { title: '首页', iconType: 'shop', iconPrefixClass: 'sp-icon' },
        { title: '分类', iconType: 'menu', iconPrefixClass: 'sp-icon' },
        { title: '购物车', iconType: 'cart', text: this.props.cartTotalCount || '', max: '99', iconPrefixClass: 'sp-icon' },
        { title: '会员', iconType: 'user', iconPrefixClass: 'sp-icon' }
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
    try {
      const { list } = await api.cart.getBasic()
      this.props.onUpdateCart(list)
    } catch (e) {
      console.error(e)
    }
  }

  handleClick = (current) => {
    this.setState({
      current
    })

    if (current === 2) {
      Taro.navigateTo({
        url: '/pages/cart/index'
      })
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
