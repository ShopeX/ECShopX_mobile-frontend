import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtInput } from 'taro-ui'
import { Loading, Price, SpCell, AddressChoose, SpToast, NavBar } from '@/components'
import api from '@/api'
import S from '@/spx'
import { withLogin } from '@/hocs'
import { pickBy, log } from '@/utils'
import { lockScreen } from '@/utils/dom'
import find from 'lodash/find'
import CheckoutItems from './checkout-items'
import OrderItem from '../trade/comps/order-item'

import './espier-checkout.scss'

const transformCartList = (list) => {
  return pickBy(list, {
    item_id: 'item_id',
    cart_id: 'cart_id',
    title: 'item_name',
    curSymbol: 'fee_symbol',
    discount_info: 'discount_info',
    order_item_type: 'order_item_type',
    pics: 'pic',
    price: ({ price }) => (+price / 100).toFixed(2),
    num: 'num'
  }).sort((a) => a.order_item_type !== 'gift' ? -1 : 1)
}

@connect(({ address, cart }) => ({
  defaultAddress: address.defaultAddress,
  coupon: cart.coupon
}), (dispatch) => ({
  onClearFastbuy: () => dispatch({ type: 'cart/clearFastbuy' }),
  onClearCart: () => dispatch({ type: 'cart/clear' }),
  onAddressChoose: (defaultAddress) => dispatch({ type: 'address/choose', payload: defaultAddress })
}))
@withLogin()
export default class CartCheckout extends Component {
  static defaultProps = {
    list: []
  }

  constructor (props) {
    super(props)

    this.state = {
      info: null,
      address_list: [],
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
      payType: '',
      invoiceTitle: ''
    }
  }

  componentDidMount () {
    this.fetchAddress()

    const { cart_type, pay_type: payType } = this.$router.params
    let info = null

    if (cart_type === 'fastbuy') {
      this.props.onClearFastbuy()
      info = null
    } else if (cart_type === 'cart') {
      // 积分购买不在此种情况

      this.props.onClearFastbuy()
      info = null
    }

    this.setState({
      info,
      payType
    })

    let total_fee = 0
    let items_count = 0
    const items = (info && info.cart) ? info.cart[0].list.map((item) => {
      const { item_id, num } = item
      total_fee += +(item.price)
      items_count += +(item.num)
      return {
        item_id,
        num
      }
    })
    : []

    this.params = {
      cart_type,
      items,
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
    if(this.state.address_list < 2) {
      this.fetchAddress()
    }
    if (!this.params || !this.state.address) return

    this.calcOrder()
    this.setState({
      address: this.props.defaultAddress
    },()=>{
      this.handleAddressChange(this.state.address)
    })
  }

  async fetchAddress (cb) {
    Taro.showLoading({
      mask: true
    })
    const { list } = await api.member.addressList()
    Taro.hideLoading()

    this.setState({
      address_list: list
    }, () => {
      this.changeSelection()
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
      receipt_type: 'logistics',
      order_type: 'normal',
      promotion: 'normal',
      member_discount: 0,
      coupon_discount: 0,
    }

    log.debug('[checkout] params: ', params)

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

    const { items, item_fee, member_discount = 0, coupon_discount = 0, freight_fee = 0, freight_point = 0, point = 0, total_fee } = data
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

    let info = this.state.info
    if (items && !this.state.info) {
      // 从后端获取订单item
      info = {
        cart: [{
          list: transformCartList(items),
          cart_total_num: items.reduce((acc, item) => (+item.num) + acc, 0)
        }]
      }
      this.params.items = items
    }

    Taro.hideLoading()
    this.setState({
      total,
      info
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

  handleInvoiceClick = async () => {
    const res = await Taro.chooseInvoiceTitle()

    if (res.errMsg === 'chooseInvoiceTitle:ok') {
      log.debug('[invoice] info:', res)
      const { type, title: content, companyAddress: company_address, taxNumber: registration_number, bankName: bankname, bankAccount: bankaccount, telephone: company_phone } = res
      this.params = {
        ...this.params,
        invoice_type: 'normal',
        invoice_content: {
          title: type !== 0 ? 'individual' : 'unit',
          content,
          company_address,
          registration_number,
          bankname,
          bankaccount,
          company_phone
        }
      }
      this.setState({
        invoiceTitle: content
      })
    }
  }

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
    const items = this.params.items
      .filter(item => item.order_item_type !== 'gift')
      .map(item => {
        const { item_id, num } = item
        return {
          item_id,
          num
        }
      })

    Taro.navigateTo({
      url: `/pages/cart/coupon-picker?items=${JSON.stringify(items)}`
    })
  }

  render () {
    const { coupon } = this.props
    const { info, address, total, showAddressPicker, showCheckoutItems, curCheckoutItems, payType, invoiceTitle } = this.state
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

          {payType !== 'point' && (
            <SpCell
              is-link
              className='coupons-list'
              title='选择优惠券'
              onClick={this.handleCouponsClick}
              value={couponText}
            />
          )}

          <View className='cart-list'>
            {
              info.cart.map(cart => {
                return (
                  <View
                    className='cart-group'
                    key={cart.shop_id}
                  >
                    <View className='sec cart-group__cont'>
                      {
                        cart.list.map((item, idx) => {
                          return (
                            <View
                              className='order-item__wrap'
                              key={item.item_id}
                            >
                              {
                                item.order_item_type === 'gift'
                                  ? (<View className='order-item__idx'><Text>赠品</Text></View>)
                                  : (<View className='order-item__idx'><Text>第{idx + 1}件商品</Text></View>)
                              }
                              <OrderItem
                                info={item}
                                showExtra={false}
                                renderDesc={
                                  <View className='order-item__desc'>
                                    {item.discount_info && item.discount_info.map((discount) =>
                                        <Text
                                          className='order-item__discount'
                                          key={discount.type}
                                        >{discount.info}</Text>
                                      )}
                                  </View>
                                }
                                customFooter
                                renderFooter={
                                  <View className='order-item__ft'>
                                    {payType === 'point'
                                      ? <Price className='order-item__price' appendText='积分' noSymbol noDecimal value={item.point}></Price>
                                      : <Price className='order-item__price' value={item.price}></Price>
                                    }
                                    <Text className='order-item__num'>x {item.num}</Text>
                                  </View>
                                }
                              />
                            </View>
                          )
                        })
                      }
                    </View>
                    {/*<View className='cart-group__shop'>{cart.shop_name}</View>*/}
                    <View className='sec cart-group__cont'>
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

          <SpCell
            isLink
            className='trade-invoice'
            title='开发票'
            onClick={this.handleInvoiceClick}
          >
            <Text>{invoiceTitle || '否'}</Text>
          </SpCell>

          {/*<SpCell
            className='trade-shipping'
            title='配送方式'
            value='[快递免邮]'
          >
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
                title='商品金额：'
              >
                <Price
                  unit='cent'
                  value={total.item_fee}
                />
              </SpCell>
              <SpCell
                className='trade-sub-total__item'
                title='会员折扣：'
              >
                <Price
                  unit='cent'
                  value={total.member_discount}
                />
              </SpCell>
              <SpCell
                className='trade-sub-total__item'
                title='优惠券：'
              >
                <Price
                  unit='cent'
                  value={total.coupon_discount}
                />
              </SpCell>
              <SpCell
                className='trade-sub-total__item'
                title='运费：'
              >
                <Price
                  unit='cent'
                  value={total.freight_fee}
                />
              </SpCell>
            </View>
          )}
        </ScrollView>

        <CheckoutItems
          isOpened={showCheckoutItems}
          list={curCheckoutItems}
          onClickBack={this.toggleCheckoutItems.bind(this, false)}
        />

        <View className='toolbar checkout-toolbar'>
          <View className='checkout__total'>
            <Text>共 <Text className='total-items'>{total.items_count}</Text> 件商品　　总计:　</Text>
            {
              payType !== 'point'
                ? <Price primary unit='cent' value={total.total_fee} />
                : (total.point && <Price primary value={total.point} noSymbol noDecimal appendText='积分' />)
            }
          </View>
          <AtButton
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
