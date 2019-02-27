import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtInputNumber, AtButton } from 'taro-ui'
import { GoodsItem, SpCheckbox, SpNote, Address, Loading, Price } from '@/components'
import { log } from '@/utils'
import api from '@/api'

import './index.scss'

function resolveCartItems (cartlist) {
  cartlist.forEach(shopCart => {
    shopCart.cartitems.forEach(group => {
      const itemlist = group.cartitemlist.map(item => {
        const { item_id, sku_id, spec_info, price, store, quantity, title, image_default_id: img } = item
        return {
          item_id, sku_id, spec_info, item_price: price.price, price: price.total_price, store, quantity, title, img
        }
      })

      group.cartitemlist = itemlist
    })
  })

  return cartlist
}

function normalizeItems (list) {
  const items = new Set()

  list.forEach(({ cartitems }) => {
    cartitems.forEach(group => {
      group.cartitemlist.forEach(item => items.add(item))
    })
  })

  return items
}

// TODO: redux cart compute
export default class CartIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      list: null,
      selection: new Set(),
      totalPrice: '0.00',
      items: null,
      cartMode: 'default'
    }
  }

  componentDidMount () {
  }

  componentDidShow () {
    this.fetch()
  }

  async fetch () {
    const { cartlist } = await api.cart.get()
    // const list = resolveCartItems(cartlist)
    // const items = normalizeItems(list)

    const list = []
    const items = []

    this.setState({
      list,
      items
    })
  }

  get isTotalChecked () {
    return this.state.items.size === this.state.selection.size
  }

  toggleCartMode = () => {
    const cartMode = this.state.cartMode !== 'edit' ? 'edit' : 'default'
    this.setState({
      cartMode
    })
  }

  handleSelectionChange (item_id, checked) {
    this.state.selection[checked ? 'add' : 'delete'](item_id)
    const selection = new Set(this.state.selection)

    this.setState({
      selection
    })

    log.debug(`[cart change] item: ${item_id}, selection: ${selection}`)
  }

  handleQuantityChange (item, quantity) {
    console.log(item, quantity)
  }

  handleAllSelect = (checked) => {
    const { items, selection } = this.state
    if (checked) {
      for (let item of items.values()) {
        selection.add(item.item_id)
      }
    } else {
      selection.clear()
    }

    this.setState({
      selection
    })
  }

  handleDelect = () => {
    console.log('delete')
  }

  handleCheckout = () => {
    Taro.navigateTo({
      url: '/pages/cart/checkout'
    })

    this.setState({
      selection: new Set()
    })
  }

  // TODO: 对接api
  render () {
    const { list, selection, totalPrice, cartMode } = this.state

    if (!list) {
      return <Loading />
    }

    const totalSelection = selection.size
    const totalItems = totalSelection
    const isEmpty = !list.length

    return (
      <View className='page-cart-index'>
        <ScrollView
          className='cart-list__wrap'
          scrollY
        >
          {
            !isEmpty && (
              <View className='cart-list__actions'>
                <Text
                  clasName='btn-cart-mode'
                  onClick={this.toggleCartMode}
                >{cartMode === 'edit' ? '完成' : '编辑'}</Text>
              </View>
            )
          }
          <View className='cart-list'>
            {
              list.map(shopCart =>
                <View className='cart-group__shop' key={shopCart.shop_id}>
                  {
                    shopCart.cartitems.map((group, gIdx) => {
                      return (
                        <View
                          className='cart-group'
                          key={gIdx}
                        >
                          {
                            group.cartitemlist.map(info => {
                              return (
                                <GoodsItem
                                  key={info.item_id}
                                  info={info}
                                  renderFooter={
                                    <block>
                                      <AtInputNumber
                                        min={1}
                                        max={999999}
                                        value={this.state.quantity}
                                        onChange={this.handleQuantityChange.bind(this, info)}
                                      />
                                    </block>
                                  }
                                >
                                  <SpCheckbox
                                    key={info.item_id}
                                    checked={selection.has(info.item_id)}
                                    onChange={this.handleSelectionChange.bind(this, info.item_id)}
                                  />
                                </GoodsItem>
                              )
                            })
                          }
                        </View>
                      )
                    })
                  }
                </View>
              )
            }
            {
              !list.length && (
                <View>
                  <SpNote customStyle={'margin-bottom: 20px'} img='cart_empty.png'>快去给我挑点宝贝吧~</SpNote>
                  <AtButton
                    circle
                    type='primary'
                    onClick={() => Taro.navigateTo({ url: '/pages/items/list' })}
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
                  <Text className='cart-total__hint'>不含运费</Text>
                  <View className='cart-total'>
                    <Price
                      primary
                      value={totalPrice}
                    />
                  </View>
                  <AtButton
                    circle
                    type='primary'
                    className='btn-checkout'
                    disabled={totalItems <= 0}
                    onClick={this.handleCheckout}
                  >结算({totalItems})</AtButton>
                </View>
              : <View className='cart-toolbar__bd'>
                    <AtButton
                      circle
                      type='primary'
                      className='btn-checkout'
                      onClick={this.handleDelect}
                    >删除</AtButton>
                  </View>
          }
        </View>
      </View>
    )
  }
}
