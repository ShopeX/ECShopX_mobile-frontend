import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { SpCheckbox, SpNote, TabBar, Loading, Price, NavBar, GoodsItem } from '@/components'
import { log, navigateTo, pickBy } from '@/utils'
import debounce from 'lodash/debounce'
import api from '@/api'
import { withLogin, withPager } from '@/hocs'
import { getTotalPrice, getTotalCount } from '@/store/cart'
import CartItem from './comps/cart-item'

import './espier-index.scss'

@connect(({ cart }) => ({
  list: cart.list,
  cartIds: cart.cartIds,
  defaultAllSelect: false,
  totalPrice: getTotalPrice(cart),
  // workaround for none selection cartItem num change
  totalItems: getTotalCount(cart, true)
}), (dispatch) => ({
  onUpdateCartNum: (cart_id, num) => dispatch({ type: 'cart/updateNum', payload: { cart_id, num: +num } }),
  onUpdateCart: (list) => dispatch({ type: 'cart/update', payload: list }),
  onCartSelection: (selection) => dispatch({ type: 'cart/selection', payload: selection })
}))
@withPager
@withLogin()
export default class CartIndex extends Component {
  static defaultProps = {
    totalPrice: '0.00',
    list: null,
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      loading: true,
      selection: new Set(),
      cartMode: 'default',
      curPromotions: null,
      groups: [],
      likeList: [],
      invalidList: []
    }

    this.updating = false
    this.lastCartId = null
  }

  componentDidMount () {
    this.fetchCart((list) => {
      if (this.props.defaultAllSelect) {
        this.handleAllSelect(true)
      }
      const groups = this.resolveActivityGroup(list)
      let selection = []
      list.forEach(shopCart => {
        const checkedIds = shopCart.list
          .filter(t => t.is_checked)
          .map(t => t.cart_id)

        selection = [...selection, ...checkedIds]
      })
      this.updateSelection(selection)

      // this.props.list 此时为空数组
      setTimeout(() => {
        this.setState({
          groups,
          loading: false
        })
      }, 40)
    })

    this.nextPage()

  }

  componentDidShow () {
    if (this.state.loading) return
    this.updateCart()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.list !== this.props.list) {
      const groups = this.resolveActivityGroup(nextProps.list)
      this.setState({
        groups
      })
    }
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize
    }
    const { list, total_count: total } = await api.cart.likeList(query)

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
    })

    this.setState({
      likeList: [...this.state.likeList, ...nList],
    })

    return {
      total
    }
  }

  // 活动分组
  resolveActivityGroup (cartList) {
    const groups = cartList.map(shopCart => {
      const { list, used_activity = [] } = shopCart
      const tDict = list.reduce((acc, val) => {
        acc[val.cart_id] = val
        return acc
      }, {})
      const activityGrouping = shopCart.activity_grouping
      const group = used_activity.map((act) => {
        const activity = activityGrouping.find(a => String(a.activity_id) === String(act.activity_id))
        const itemList = activity.cart_ids.map(id => {
          const cartItem = tDict[id]
          delete tDict[id]
          return cartItem
        })

        return {
          activity,
          list: itemList
        }
      })

      // 无活动列表
      group.push({
        activity: null,
        list: Object.values(tDict)
      })

      return group
    })

    return groups
  }

  async fetchCart (cb) {
    const { valid_cart, invalid_cart } = await api.cart.get()

    const list = valid_cart.map(shopCart => {
      const tList = this.transformCartList(shopCart.list)
      return {
        ...shopCart,
        list: tList
      }
    })

    const invalidList = this.transformCartList(invalid_cart)
    this.setState({
      invalidList
    })

    log.debug('[cart fetchCart]', list)
    this.props.onUpdateCart(list)
    cb && cb(list)
  }

  updateCart = debounce(async () => {
    this.updating = true
    try {
      await this.fetchCart()
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

  updateSelection (selection = []) {
    this.setState({
      selection: new Set(selection)
    })

    this.props.onCartSelection(selection)
  }

  async handleSelectionChange (cart_id, checked) {
    const selection = this.state.selection
    selection[checked ? 'add' : 'delete'](cart_id)
    this.updateSelection([...selection])

    await api.cart.select({
      cart_id,
      is_checked: checked
    })

    log.debug(`[cart change] item: ${cart_id}, selection:`, selection)
    this.updateCart()
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

    this.updateSelection(cartIds)
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

  handleAllSelect = async (checked) => {
    const { selection } = this.state
    const { cartIds } = this.props

    if (checked) {
      cartIds.forEach(cartId => selection.add(cartId))
    } else {
      selection.clear()
    }

    Taro.showLoading()
    try {
      await api.cart.select({
        cart_id: cartIds,
        is_checked: checked
      })
    } catch (e) {
      console.log(e)
    }
    Taro.hideLoading()
    this.updateSelection([...selection])
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
    Taro.showLoading({
      mask: true
    })
    this.setState({
      curPromotions: null
    })
    await api.cart.updatePromotion({
      activity_id,
      cart_id
    })
    await this.fetchCart()
    Taro.hideLoading()
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
      is_checked: 'is_checked',
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
    const { selection, groups, invalidList, cartMode, loading, curPromotions, likeList, page } = this.state
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
              groups.map((activityGroup, idx) => {
                return (
                  <View
                    className='cart-list__shop'
                    key={idx}
                  >
                    {
                      activityGroup.map(shopCart => {
                        const { activity } = shopCart

                        return shopCart.list.length > 0 && (
                          <View
                            className='cart-group'
                            key={shopCart.shop_id}
                          >
                            {activity && (
                              <View className='cart-group__activity'>
                                <View
                                  className='cart-group__activity-item'
                                >
                                  <Text className='cart-group__activity-label'>{activity.activity_tag}</Text>
                                  <Text>{activity.activity_name}</Text>
                                </View>
                              </View>
                            )}
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
                            {activity && activity.gifts && (
                              <View className='cart-group__gifts'>
                                <View className='cart-group__gifts-hd'>赠品</View>
                                <View className='cart-group__gifts-bd'>
                                  {activity.gifts.map(gift => {
                                    return (
                                      <View
                                        className='gift-item'
                                        key={gift.item_id}
                                      >
                                        <Image
                                          className='gift-item__img'
                                          src={gift.pics[0]}
                                          mode='aspectFill'
                                        />
                                        <View className='gift-item__title'>{gift.item_name}</View>
                                        <Text className='gift-item__num'>x{gift.gift_num}</Text>
                                      </View>
                                    )
                                  })}
                                </View>
                              </View>
                            )}
                          </View>
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
                    onClick={this.navigateTo.bind(this, APP_HOME_PAGE, true)}
                  >随便逛逛</AtButton>
                </View>
              )
            }
          </View>

          {list.length && (
            <View className='cart-list cart-list__disabled'>
              <View className='cart-list__hd'><Text>已失效</Text></View>
              <View className='cart-list__bd'>
                {invalidList.map(item => {
                  return (
                    <CartItem
                      isDisabled
                      key={item.cart_id}
                      info={item}
                    >
                      <View className='cart-item__act'>
                        <View></View>
                        <View
                          className='in-icon in-icon-close'
                          onClick={this.handleDelect.bind(this, item.cart_id)}
                        />
                      </View>
                    </CartItem>
                  )
                })}
              </View>
            </View>
          )}

          {
            likeList.length
              ? <View className='cart-list cart-list__disabled'>
                <View className='cart-list__hd like__hd'><Text className='cart-list__title'>猜你喜欢</Text></View>
                <View className='goods-list goods-list__type-grid'>
                  {
                    likeList.map(item => {
                      return (
                        <GoodsItem
                          key={item.item_id}
                          info={item}
                          onClick={() => this.handleClickItem(item)}
                        />
                      )
                    })
                  }
                </View>
              </View>
              : null
          }
          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
          }
          {
            !page.isLoading && !page.hasNext && !likeList.length
            && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
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
                    {list.length && list[0].discount_fee > 0 && (
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
          {curPromotions && curPromotions.map(item => {
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
