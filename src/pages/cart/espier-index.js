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
      cartMode: 'default'
    }
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
    cb && cb(list)
  }

  updateCart = debounce(() => {
    this.fetch()
  }, 500)

  get isTotalChecked () {
    return this.props.cartIds.length === this.state.selection.size
  }

  navigateBack = () => {

  }

  toggleCartMode = () => {
    const cartMode = this.state.cartMode !== 'edit' ? 'edit' : 'default'
    this.setState({
      cartMode
    })
  }

  handleSelectionChange (cart_id, checked) {
    this.state.selection[checked ? 'add' : 'delete'](cart_id)
    const selection = new Set(this.state.selection)

    this.setState({
      selection
    })
    this.props.onCartSelection([...selection])

    log.debug(`[cart change] item: ${cart_id}, selection:`, selection)
  }

  handleDelect = async (cart_id) => {
    await api.cart.del({ cart_id })
    const cartIds = this.state.cartIds.filter(t => t !== cart_id)

    this.setState({
      cartIds
    })
    this.updateCart()
  }

  handleQuantityChange = async (cart_id, num) => {
    await api.cart.updateNum({ cart_id, num })
    this.updateCart()
  }

  handleAllSelect = (checked) => {
    const { selection } = this.state
    const { list } = this.state

    if (checked) {
      list.forEach(shopCart => {
        shopCart.list.forEach(item => {
          selection.add(item.cart_id)
        })
      })
    } else {
      selection.clear()
    }

    this.setState({
      selection: new Set(selection)
    })
    this.props.onCartSelection([...selection])
  }

  // handleDelect = () => {
  //   const { list } = this.props
  //   this.state.selection.forEach(item_id => {
  //     this.props.onCartDel({ item_id })
  //   })
  //   const selection = list.filter(item => !this.state.selection.has(item.item_id))
  //     .map(({ item_id }) => item_id)

  //   this.setState({
  //     selection: new Set(selection)
  //   })
  //   this.props.onCartSelection(selection)
  //   this.toggleCartMode()
  // }

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
      quantity: 'num'
    })
  }

  navigateTo = (...args) => {
    navigateTo.apply(this, args)
  }

  render () {
    const { selection, cartMode } = this.state
    const { totalPrice, list } = this.props

    if (!list) {
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
