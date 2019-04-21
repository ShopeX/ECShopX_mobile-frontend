import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'
import { SpCheckbox, SpNote, TabBar, Loading, Price, NavBar } from '@/components'
import { log, navigateTo, pickBy } from '@/utils'
import debounce from 'lodash/debounce'
import api from '@/api'
import { withLogin } from '@/hocs'
import { getTotalPrice } from '@/store/cart'
import CartItem from './comps/cart-item'

import './espier-index.scss'

@connect(({ cart }) => ({
  list: cart.list,
  cartIds: cart.cartIds,
  defaultAllSelect: true,
  totalPrice: getTotalPrice(cart)
}), (dispatch) => ({
  onUpdateCartNum: (cart_id, num) => dispatch({ type: 'cart/updateNum', payload: { cart_id, num } }),
  onUpdateCart: (list) => dispatch({ type: 'cart/update', payload: list }),
  onCartSelection: (selection) => dispatch({ type: 'cart/selection', payload: selection })
}))
@withLogin()
export default class CartIndex extends Component {
  static defaultProps = {
    totalPrice: '0.00',
    list: null
  }

  constructor (props) {
    super(props)

    this.state = {
      selection: new Set(),
      loading: true,
      cartMode: 'default'
    }

    this.lastCartId = null
  }

  componentDidMount () {
    this.fetch(() => {
      if (this.props.defaultAllSelect) {
        this.handleAllSelect(true)
      }
    })
  }

  async fetch (cb) {
    const { valid_cart } = await api.cart.get()

    const list = valid_cart.map(shopCart => {
      const tList = this.transformCartList(shopCart.list)
      return {
        ...shopCart,
        list: tList
      }
    })

    log.debug('[cart fetch]', list)
    this.props.onUpdateCart(list)
    this.setState({
      loading: false
    })
    cb && cb(list)
  }

  updateCart = debounce(async () => {
    // Taro.showLoading({
    //   mask: true,
    //   title: '正在加载...'
    // })
    await this.fetch()
    // Taro.hideLoading()
  }, 500, {
    leading: true
  })

  get isTotalChecked () {
    return this.props.cartIds.length === this.state.selection.size
  }

  toggleCartMode = () => {
    const cartMode = this.state.cartMode !== 'edit' ? 'edit' : 'default'
    this.setState({
      cartMode
    })
  }

  async handleSelectionChange (cart_id, checked) {
    this.state.selection[checked ? 'add' : 'delete'](cart_id)
    const selection = new Set(this.state.selection)

    this.setState({
      selection
    })
    this.props.onCartSelection([...selection])
    await api.cart.select({
      cart_id,
      is_checked: checked
    })

    log.debug(`[cart change] item: ${cart_id}, selection:`, selection)
  }

  handleDelect = async (cart_id) => {
    const res = await Taro.showModal({
      title: '将当前商品移出购物车?',
      showCancel: true,
      cancel: '取消',
      confirmText: '确认',
      confirmColor: '#0b4137'
    })
    if (!res.confirm) return

    await api.cart.del({ cart_id })

    const cartIds = this.props.cartIds.filter(t => t !== cart_id)
    const selection = new Set(cartIds)
    this.setState({
      selection
    })
    this.props.onCartSelection(cartIds)
    this.updateCart()
  }

  async changeCartNum (cart_id, num) {
    this.updateCart.cancel()
    await api.cart.updateNum({ cart_id, num })
    this.updateCart()
  }

  debounceChangeCartNum = debounce(async (cart_id, num) => {
    await this.changeCartNum(cart_id, num)
  }, 400)

  handleQuantityChange = async (cart_id, num) => {
    this.props.onUpdateCartNum(cart_id, num)
    this.updateCart.cancel()
    if (this.lastCartId === cart_id || this.lastCartId === undefined) {
      await this.debounceChangeCartNum(cart_id, num)
    } else {
      this.lastCartId = cart_id
      await this.changeCartNum(cart_id, num)
    }
  }

  handleAllSelect = (checked) => {
    const { selection } = this.state
    const { cartIds } = this.props

    if (checked) {
      cartIds.forEach(cartId => selection.add(cartId))
    } else {
      selection.clear()
    }

    this.setState({
      selection: new Set(selection)
    })
    this.props.onCartSelection([...selection])
  }

  handleCheckout = () => {
    Taro.navigateTo({
      url: '/pages/cart/espier-checkout'
    })
  }

  transformCartList (list) {
    return pickBy(list, {
      item_id: 'item_id',
      cart_id: 'cart_id',
      title: 'item_name',
      desc: 'brief',
      curSymbol: 'cur.symbol',
      img: ({ pics }) => pics,
      price: ({ price }) => (+price / 100).toFixed(2),
      market_price: ({ market_price }) => (+market_price / 100).toFixed(2),
      num: 'num'
    })
  }

  navigateTo = (...args) => {
    navigateTo.apply(this, args)
  }

  render () {
    const { selection, cartMode, loading } = this.state
    const { totalPrice, list } = this.props

    if (loading) {
      return <Loading />
    }

    const totalSelection = selection.size
    const totalItems = totalSelection
    const isEmpty = !list.length

    return (
      <View className='page-cart-index'>
        <NavBar
          title='购物车'
          leftIconType='chevron-left'
          fixed='true'
        />

        <ScrollView
          className='cart-list__wrap'
          scrollY
        >
          {
            // !isEmpty && (
            //   <View className='cart-list__actions'>
            //     <Text
            //       clasName='btn-cart-mode'
            //       onClick={this.toggleCartMode}
            //     >{cartMode === 'edit' ? '完成' : '编辑'}</Text>
            //   </View>
            // )
          }
          <View className='cart-list'>
            {
              list.map((shopCart) => {
                return (
                  <View
                    className='cart-group__shop'
                    key={shopCart.shop_id}
                  >
                    {
                      shopCart.list.map((item) => {
                        return (
                          <CartItem
                            key={item.cart_id}
                            info={item}
                            onNumChange={this.handleQuantityChange.bind(this, item.cart_id)}
                          >
                            <View className='cart-item__act'>
                              <SpCheckbox
                                key={item.item_id}
                                checked={selection.has(item.cart_id)}
                                onChange={this.handleSelectionChange.bind(this, item.cart_id)}
                              />
                              <View
                                className='in-icon in-icon-close'
                                onClick={this.handleDelect.bind(this, item.cart_id)}
                              />
                            </View>
                          </CartItem>
                        )
                      })
                    }
                  </View>
                )
              })
            }

            {
              !list.length && (
                <View>
                  <View style='margin-bottom: 20px'>
                    <SpNote img='cart_empty.png'>快去给我挑点宝贝吧~</SpNote>
                  </View>
                  <AtButton
                    className='btn-rand'
                    type='primary'
                    onClick={this.navigateTo.bind(this, '/pages/home/index', true)}
                  >随便逛逛</AtButton>
                </View>
              )
            }
          </View>
        </ScrollView>

        <View
          className={`toolbar cart-toolbar ${isEmpty && 'hidden'}`}
        >
          <View className='cart-toolbar__hd'>
            <SpCheckbox
              checked={this.isTotalChecked}
              onChange={this.handleAllSelect}
            >全选</SpCheckbox>
          </View>
          {
            cartMode !== 'edit'
              ? <View className='cart-toolbar__bd'>
                  <View className='cart-total'>
                    <Text className='cart-total__hint'>总计：</Text>
                    <Price
                      primary
                      value={totalPrice}
                    />
                  </View>
                  <AtButton
                    type='primary'
                    className='btn-checkout'
                    disabled={totalItems <= 0}
                    onClick={this.handleCheckout}
                  >结算</AtButton>
                </View>
              : <View className='cart-toolbar__bd'>
                    <AtButton
                      type='primary'
                      className='btn-checkout'
                      onClick={this.handleDelect}
                    >删除</AtButton>
                  </View>
          }
        </View>

        <TabBar
          current={3}
        />
      </View>
    )
  }
}
