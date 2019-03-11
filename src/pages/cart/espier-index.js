import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtInputNumber, AtButton } from 'taro-ui'
import { GoodsItem, SpCheckbox, SpNote, Loading, Price } from '@/components'
import { log, navigateTo, pickBy } from '@/utils'
// import api from '@/api'
import { withLogin } from '@/hocs'

import './index.scss'

@connect(({ cart }) => ({
  list: cart.list,
  defaultAllSelect: true
}), (dispatch) => ({
  onCartUpdate: (item, num) => dispatch({ type: 'cart/update', payload: { item, num } }),
  onCartDel: (item) => dispatch({ type: 'cart/delete', payload: item }),
  onCartSelection: (selection) => dispatch({ type: 'cart/selection', payload: selection })
}))
@withLogin()
export default class CartIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selection: new Set(),
      totalPrice: '0.00',
      cartMode: 'default'
    }
  }

  componentDidMount () {
    if (this.props.defaultAllSelect) {
      this.handleAllSelect(true)
    }
  }

  componentDidShow () {
    // this.fetch()
  }

  async fetch () {
    // const { cartlist } = await api.cart.get()
    // // const list = resolveCartItems(cartlist)
    // // const items = normalizeItems(list)

    // const list = []
    // const items = []

    // this.setState({
    //   list,
    //   items
    // })
  }

  get isTotalChecked () {
    return this.props.list.length === this.state.selection.size
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
    this.props.onCartSelection([...selection])

    log.debug(`[cart change] item: ${item_id}, selection: ${selection}`)
  }

  handleQuantityChange (idx, quantity) {
    const item = this.props.list[idx]
    this.props.onCartUpdate(item, quantity)
  }

  handleAllSelect = (checked) => {
    const { selection } = this.state
    const { list } = this.props

    if (checked) {
      list.forEach((item) => {
        selection.add(item.item_id)
      })
    } else {
      selection.clear()
    }

    this.setState({
      selection: new Set(selection)
    })
    this.props.onCartSelection([...selection])
  }

  handleDelect = () => {
    const selection = [...this.state.selection]
    selection.forEach(item_id => {
      this.props.onCartDel({ item_id })
    })

    this.setState({
      selection: new Set(selection)
    })
    this.props.onCartSelection(selection)
  }

  handleCheckout = () => {
    Taro.navigateTo({
      url: '/pages/cart/espier-checkout'
    })
  }

  transformCartList (list) {
    return pickBy(list, {
      item_id: 'item_id',
      title: 'item_name',
      desc: 'brief',
      curSymbol: 'cur.symbol',
      img: ({ pics }) => pics[0],
      price: ({ price }) => (+price / 100).toFixed(2),
      market_price: ({ market_price }) => (+market_price / 100).toFixed(2),
      quantity: 'num'
    })
  }

  navigateTo = navigateTo

  render () {
    const { list } = this.props
    const { selection, totalPrice, cartMode } = this.state

    if (!list) {
      return <Loading />
    }

    const totalSelection = selection.size
    const totalItems = totalSelection
    const isEmpty = !list.length

    const cartList = this.transformCartList(list)

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
            <View className='cart-group__shop'>
              {
                cartList.map((item, idx) => {
                  return (
                    <GoodsItem
                      key={item.item_id}
                      info={item}
                      renderFooter={
                        <block>
                          <AtInputNumber
                            min={1}
                            max={999999}
                            value={item.quantity}
                            onChange={this.handleQuantityChange.bind(this, idx)}
                          />
                        </block>
                      }
                    >
                      <SpCheckbox
                        key={item.item_id}
                        checked={selection.has(item.item_id)}
                        onChange={this.handleSelectionChange.bind(this, item.item_id)}
                      />
                    </GoodsItem>
                  )
                })
              }
            </View>
            {
              !list.length && (
                <View>
                  <SpNote customStyle='margin-bottom: 20px' img='cart_empty.png'>快去给我挑点宝贝吧~</SpNote>
                  <AtButton
                    circle
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
