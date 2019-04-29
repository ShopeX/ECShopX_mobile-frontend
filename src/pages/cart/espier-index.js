import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtActionSheet, AtActionSheetItem } from 'taro-ui'
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
      loading: true,
      selection: new Set(),
      cartMode: 'default',
      curPromotions: null
    }

    this.updating = false
    this.lastCartId = null
  }

  componentDidMount () {
    this.fetch(() => {
      if (this.props.defaultAllSelect) {
        this.handleAllSelect(true)
      }
      this.setState({
        loading: false
      })
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

  updateCart = debounce(async () => {
    this.updating = true
    try {
      await this.fetch()
    } catch (e) {
      console.log(e)
    }
    this.updating = false
  }, 600)

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
    this.updating = true
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

  handleClickPromotion = (cart_id) => {
    let promotions
    this.props.list.some((cart) => {
      cart.list.some(item => {
        if (item.cart_id === cart_id) {
          promotions = item.promotions.slice()
        }
      })
    })

    this.setState({
      curPromotions: promotions
    })
  }

  handleSelectPromotion = async (item) => {
    const { marketing_id: activity_id, cart_id } = item
    this.setState({
      curPromotions: null
    })
    await api.cart.updatePromotion({
      activity_id,
      cart_id
    })
    this.updateCart()
  }

  handleClosePromotions = () => {
    this.setState({
      curPromotions: null
    })
  }

  handleCheckout = () => {
    if (this.updating) {
      Taro.showToast({
        title: '正在计算价格，请稍后',
        icon: 'none'
      })
      return
    }

    Taro.navigateTo({
      url: '/pages/cart/espier-checkout?cart_type=cart'
    })
  }

  transformCartList (list) {
    return pickBy(list, {
      item_id: 'item_id',
      cart_id: 'cart_id',
      activity_id: 'activity_id',
      title: 'item_name',
      desc: 'brief',
      curSymbol: 'cur.symbol',
      promotions: ({ promotions = [], cart_id }) => promotions.map(p => {
        p.cart_id = cart_id
        return p
      }),
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
    const { selection, cartMode, loading, curPromotions } = this.state
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
          className='cart-list__scroll'
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
                    <View className='cart-group__activity'>
                      {shopCart.cart_used_activity.map((item) => {
                        return (
                          <View
                            className='cart-group__activity-item'
                            key={item.activity_name}
                          >
                            <Text className='cart-group__activity-label'>{item.activity_tag}</Text>
                            <Text>{item.activity_name}</Text>
                          </View>
                        )
                      })}
                    </View>
                    {
                      shopCart.list.map((item) => {
                        return (
                          <CartItem
                            key={item.cart_id}
                            info={item}
                            onNumChange={this.handleQuantityChange.bind(this, item.cart_id)}
                            onClickPromotion={this.handleClickPromotion.bind(this, item.cart_id)}
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
                    {list[0].discount_fee > 0 && (
                      <View className='cart-total__discount'>
                        <Text className='cart-total__hint'>优惠：</Text>
                        <Price
                          primary
                          value={-1 * list[0].discount_fee}
                          unit='cent'
                        />
                      </View>
                    )}
                    <View className='cart-total__total'>
                      <Text className='cart-total__hint'>总计：</Text>
                      <Price
                        primary
                        value={totalPrice}
                      />
                    </View>
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

        <AtActionSheet
          title='请选择商品优惠'
          isOpened={Boolean(curPromotions)}
          onClose={this.handleClosePromotions}
        >
          {curPromotions.map(item => {
            return (
              <AtActionSheetItem
                key={item.marketing_id}
                onClick={this.handleSelectPromotion.bind(this, item)}
              ><Text className='cart-promotion__label'>{item.promotion_tag}</Text><Text>{item.marketing_name}</Text></AtActionSheetItem>
            )
          })}
        </AtActionSheet>

        <TabBar
          current={3}
        />
      </View>
    )
  }
}
