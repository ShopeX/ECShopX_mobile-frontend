import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtInput, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { Loading, Price, SpCell, AddressChoose, SpToast, NavBar } from '@/components'
import api from '@/api'
import S from '@/spx'
import { withLogin } from '@/hocs'
import { pickBy, log } from '@/utils'
import { lockScreen } from '@/utils/dom'
import { getSelectedCart } from '@/store/cart'
import CheckoutItems from './checkout-items'


import './espier-checkout.scss'
import find from "lodash/find";

@connect(({ cart }) => ({
  coupon: cart.coupon,
  fastbuy: cart.fastbuy,
  list: getSelectedCart(cart)
}), (dispatch) => ({
  onClearFastbuy: () => dispatch({ type: 'cart/clearFastbuy' }),
  onClearCart: () => dispatch({ type: 'cart/clear' })
}))
@connect(( { address } ) => ({
  defaultAddress: address.defaultAddress,
}), (dispatch) => ({
  onAddressChoose: (defaultAddress) => dispatch({ type: 'address/choose', payload: defaultAddress }),
}))
@withLogin()
export default class CartCheckout extends Component {
  static defaultProps = {
    list: [],
    fastbuy: null
  }

  constructor (props) {
    super(props)

    this.state = {
      address_list: [],
      info: null,
      address: null,
      showShippingPicker: false,
      showAddressPicker: false,
      showCheckoutItems: false,
      showCoupons: false,
      curCheckoutItems: [],
      coupons: [],
      total: {
        items_count: '',
        total_fee: '0.00',
        item_fee: '',
        freight_fee: '',
        member_discount: '',
        coupon_discount: '',
        point: ''
      },
      payType: ''
    }
  }

  componentDidMount () {
    this.fetch(() => this.changeSelection())

    const { cart_type, pay_type: payType } = this.$router.params
    let info = null

    if (cart_type === 'fastbuy') {
      const fastBuyItem = this.props.fastbuy
      info = {
        cart: [{
          list: [fastBuyItem],
          cart_total_num: fastBuyItem.num
        }]
      }
    } else {
      // 积分购买不在此种情况

      this.props.onClearFastbuy()
      const { list } = this.props
      info = {
        cart: [{
          list,
          cart_total_num: list.reduce((acc, item) => (+item.num) + acc, 0)
        }]
      }
    }

    this.setState({
      info,
      payType
    })

    let total_fee = 0
    let items_count = 0
    const items = info.cart[0].list.map((item) => {
      const { item_id, num } = item
      total_fee += +(item.price)
      items_count += +(item.num)
      return {
        item_id,
        num
      }
    })

    this.params = {
      items,
      receipt_type: 'logistics',
      order_type: 'normal',
      promotion: 'normal',
      member_discount: false,
      pay_type: payType || 'deposit'
    }

    this.setState({
      total: {
        items_count,
        total_fee: total_fee.toFixed(2)
      }
    })
    this.handleAddressChange(this.props.defaultAddress)
  }

  componentDidShow () {
    console.log( 123)
    if(this.state.address_list < 2) {
      this.fetch(() => this.changeSelection())
    }
    // this.fetch(() => this.changeSelection())
    if (!this.props.list.length && !this.props.fastbuy) {
      Taro.showToast({
        title: '购物车中无商品',
        icon: 'none'
      }).then(() => {
        Taro.navigateTo({
          url: '/pages/home/index'
        })
      })

      return
    }
    if (!this.params) return
    if (!this.state.address) return
    this.calcOrder()
    this.setState({
      address: this.props.defaultAddress
    },()=>{
      this.handleAddressChange(this.state.address)
    })
  }

  async fetch (cb) {
    Taro.showLoading({
      mask: true
    })
    const { list } = await api.member.addressList()
    Taro.hideLoading()

    this.setState({
      address_list: list
    }, () => {
      cb && cb(list)
    })
  }

  changeSelection (params = {}) {
    const { address_list } = this.state
    if (address_list.length === 0) {
      Taro.navigateTo({
        url: '/pages/member/edit-address'
      })
      return
    }
    const { address_id } = params
    let address = find(address_list, addr => address_id ? address_id === addr.address_id : addr.is_def > 0) || address_list[0] || null

    log.debug('[address picker] change selection: ', address)
    this.props.onAddressChoose(address)
    this.handleAddressChange(address)
    // this.props.onChange(address)
  }


  getParams () {
    const receiver = pickBy(this.state.address, {
      receiver_name: 'name',
      receiver_mobile: 'mobile',
      receiver_state: 'state',
      receiver_city: 'city',
      receiver_district: 'district',
      receiver_address: 'address',
      receiver_zip: 'zip'
    })
    const { coupon } = this.props

    const params = {
      ...this.params,
      ...receiver,
      coupon_discount: 0,
      member_discount: 0
    }
    if (coupon) {
      if (coupon.type === 'coupon' && coupon.value.code) {
        params.coupon_discount = coupon.value.code
      } else if (coupon.type === 'member') {
        params.member_discount = coupon.value ? 1 : 0
      }
    }
    this.params = params

    return params
  }

  async calcOrder () {
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    const params = this.getParams()
    const data = await api.cart.total(params)

    const { item_fee, member_discount = 0, coupon_discount = 0, freight_fee = 0, freight_point = 0, point = 0, total_fee } = data
    const total = {
      ...this.state.total,
      item_fee,
      member_discount: -1 * member_discount,
      coupon_discount: -1 * coupon_discount,
      freight_fee,
      total_fee,
      point,
      freight_point
    }
    Taro.hideLoading()

    this.setState({
      total
    })
  }


  handleAddressChange = (address) => {
    if (!address) {
      return
    }
    address = pickBy(address, {
      state: 'province',
      city: 'city',
      district: 'county',
      addr_id: 'address_id',
      mobile: 'telephone',
      name: 'username',
      zip: 'postalCode',
      address: 'adrdetail',
      area: 'area'
    })

    this.setState({
      address
    }, () => {
      this.calcOrder()
    })
    if (!address) {
      this.setState({
        showAddressPicker: true
      })
    }
  }

  handleShippingChange = (type) => {
    console.log(type)
  }

  handleClickItems (items) {
    this.setState({
      curCheckoutItems: items
    })
    this.toggleCheckoutItems()
  }

  // toggleAddressPicker (isOpened) {
  //   if (isOpened === undefined) {
  //     isOpened = !this.state.showAddressPicker
  //   }
  //
  //   lockScreen(isOpened)
  //   this.setState({ showAddressPicker: isOpened })
  // }

  toggleCheckoutItems (isOpened) {
    if (isOpened === undefined) {
      isOpened = !this.state.showCheckoutItems
    }

    lockScreen(isOpened)
    this.setState({ showCheckoutItems: isOpened })
  }

  toggleState (key, val) {
    if (val === undefined) {
      val = !this.state[key]
    }

    this.setState({
      [key]: val
    })
  }

  handlePay = async () => {
    if (!this.state.address) {
      return S.toast('请选择地址')
    }

    Taro.showLoading({
      title: '正在提交',
      mask: true
    })

    let order_id
    try {
      const res = await api.trade.create(this.params)
      order_id = res.order_id
    } catch (e) {
      Taro.showToast({
        title: e.message,
        icon: false
      })
    }
    Taro.hideLoading()

    if (!order_id) return

    const url = `/pages/cashier/index?order_id=${order_id}`
    this.props.onClearCart()
    Taro.navigateTo({ url })
  }

  handleCouponsClick = () => {
    Taro.navigateTo({
      url: `/pages/cart/coupon-picker?items=${JSON.stringify(this.params.items)}`
    })
  }

  render () {
    const { coupon } = this.props
    const { info, address, total, showAddressPicker, showCheckoutItems, curCheckoutItems, payType } = this.state
    if (!info) {
      return <Loading />
    }

    const couponText = !coupon
      ? ''
      : coupon.type === 'member'
        ? '会员折扣'
        : ((coupon.value && coupon.value.title) || '')
    const isBtnDisabled = !address || !address.addr_id

    return (
      <View className='page-checkout'>
        {
          showAddressPicker === false
            ? <NavBar
              title='填写订单信息'
              leftIconType='chevron-left'
              fixed='true'
            />
            : null
        }
        <ScrollView
          scrollY
          className='checkout__wrap'
        >
          <AddressChoose
            isAddress={address}
          />
          {/*<View*/}
            {/*className='address-info'*/}
            {/*onClick={this.toggleAddressPicker.bind(this, true)}*/}
          {/*>*/}
            {/*<SpCell*/}
              {/*isLink*/}
              {/*icon='map-pin'*/}
            {/*>*/}
              {/*{*/}
                {/*address*/}
                  {/*? <View className='address-info__bd'>*/}
                      {/*<Text className='address-info__receiver'>*/}
                        {/*收货人：{address.name} {address.mobile}*/}
                      {/*</Text>*/}
                      {/*<Text className='address-info__addr'>*/}
                        {/*收货地址：{address.province}{address.state}{address.district}{address.address}*/}
                      {/*</Text>*/}
                    {/*</View>*/}
                  {/*: <View className='address-info__bd'>请选择收货地址</View>*/}
              {/*}*/}
            {/*</SpCell>*/}
          {/*</View>*/}

          <View className='cart-list'>
            {
              info.cart.map(cart => {
                return (
                  <View
                    className='cart-group'
                    key={cart.shop_id}
                  >
                    {/*<View className='cart-group__shop'>{cart.shop_name}</View>*/}
                    <View className='sec cart-group__cont'>
                      <SpCell
                        className='trade-items'
                        value={`共${cart.cart_total_num}件商品`}
                        // onClick={this.handleClickItems.bind(this, cart.items)}
                      >
                        <View className='trade-items__bd'>
                          {
                            cart.list.map((item, idx) => {
                              return (
                                <Image
                                  key={idx}
                                  className='trade-item__img'
                                  mode='aspectFill'
                                  src={Array.isArray(item.pics) ? item.pics[0] : item.pics}
                                />
                              )
                            })
                          }
                          {cart.list.length === 1 && (
                            <Text className='trade-item__title'>{cart.list[0].item_name}</Text>
                          )}
                        </View>
                      </SpCell>
                      <SpCell
                        className='sec trade-remark'
                        border={false}
                      >
                        <AtInput
                          className='trade-remark__input'
                          placeholder='给商家留言：选填（50字以内）'
                        />
                      </SpCell>
                    </View>
                  </View>
                )
              })
            }
          </View>

          {payType !== 'point' && (
            <SpCell
              is-link
              className='coupons-list'
              title='选择优惠券'
              onClick={this.handleCouponsClick}
              value={couponText}
            />
          )}

          {/*<View className='sec trade-point'>
            <SpCell
              title='积分'
              border={false}
            >
              <View className='trade-point__wrap'>
                <Text className='trade-point__hint'>可用1000积分(每1积分抵扣1元)可抵扣 <Price value={pointPrice} /></Text>
                <Switch
                  checked
                  value={usePoint}
                  onChange={this.handlePointChange}
                />
              </View>
            </SpCell>
            <AtInput
              className='trade-point__input'
              type='text'
              value={point}
              placeholder='全部抵扣或在此输入积分数'
            />
          </View>

          <SpCell
            className='trade-invoice'
            title='申请发票'
          >
            <Switch
              checked
            />
          </SpCell>*/}

          {payType === 'point' && (
            <View className='sec trade-sub-total'>
              <SpCell
                className='trade-sub-total__item'
                title='运费'
              >
                <Price
                  noSymbol
                  noDecimal
                  appendText='积分'
                  value={total.freight_point}
                />
              </SpCell>
              <SpCell
                className='trade-sub-total__item'
                title='积分'
              >
                <Price
                  noSymbol
                  noDecimal
                  appendText='积分'
                  value={total.point}
                />
              </SpCell>
            </View>
          )}

          {payType !== 'point' && (
            <View className='sec trade-sub-total'>
              <SpCell
                className='trade-sub-total__item'
                title='商品金额'
              >
                <Price
                  unit='cent'
                  value={total.item_fee}
                />
              </SpCell>
              <SpCell
                className='trade-sub-total__item'
                title='会员折扣金额'
              >
                <Price
                  unit='cent'
                  value={total.member_discount}
                />
              </SpCell>
              <SpCell
                className='trade-sub-total__item'
                title='优惠券'
              >
                <Price
                  unit='cent'
                  value={total.coupon_discount}
                />
              </SpCell>
              <SpCell
                className='trade-sub-total__item'
                title='运费'
              >
                <Price
                  unit='cent'
                  value={total.freight_fee}
                />
              </SpCell>
            </View>
          )}
        </ScrollView>

        {/*<AddressPicker*/}
          {/*isOpened={showAddressPicker}*/}
          {/*value={address}*/}
          {/*onChange={this.handleAddressChange}*/}
          {/*onClickBack={this.toggleState.bind(this, 'showAddressPicker', false)}*/}
        {/*/>*/}
        {/*<AddressList*/}
          {/*onClickTo={this.clickTo.bind(this)}*/}
          {/*onChange={this.handleAddressChange.bind(this)}*/}
          {/*onClickBack={this.handleClickBack.bind(this)}*/}
        {/*/>*/}

        <CheckoutItems
          isOpened={showCheckoutItems}
          list={curCheckoutItems}
          onClickBack={this.toggleCheckoutItems.bind(this, false)}
        />

        <View className='toolbar checkout-toolbar'>
          <View className='checkout__total'>
            共<Text className='total-items'>{total.items_count}</Text>件，合计:
            {
              payType !== 'point'
                ? <Price primary unit='cent' value={total.total_fee} />
                : (total.point && <Price primary value={total.point} noSymbol noDecimal appendText='积分' />)
            }
          </View>
          <AtButton
            circle
            type='primary'
            className='btn-confirm-order'
            disabled={isBtnDisabled}
            onClick={this.handlePay}
          >提交订单</AtButton>
        </View>

        <SpToast />
      </View>
    )
  }
}
