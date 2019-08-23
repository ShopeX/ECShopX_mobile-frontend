import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtInput } from 'taro-ui'
import { Loading, Price, SpCell, AddressChoose, SpToast, NavBar } from '@/components'
import api from '@/api'
import S from '@/spx'
import { withLogin } from '@/hocs'
import { pickBy, log } from '@/utils'
import { lockScreen } from '@/utils/dom'
import find from 'lodash/find'
import _cloneDeep from 'lodash/cloneDeep'
import CheckoutItems from './checkout-items'
import PaymentPicker from './comps/payment-picker'
import DrugInfo from './comps/drug-info'
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
  address: address.current,
  coupon: cart.coupon
}), (dispatch) => ({
  onClearFastbuy: () => dispatch({ type: 'cart/clearFastbuy' }),
  onClearCart: () => dispatch({ type: 'cart/clear' }),
  onClearCoupon: () => dispatch({ type: 'cart/clearCoupon' }),
  onAddressChoose: (address) => dispatch({ type: 'address/choose', payload: address })
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
      submitLoading: false,
      address_list: [],
      shop: null,
      showShippingPicker: false,
      showAddressPicker: false,
      showCheckoutItems: false,
      showCoupons: false,
      curCheckoutItems: [],
      coupons: [],
      drug: null,
      total: {
        items_count: '',
        total_fee: '0.00',
        item_fee: '',
        freight_fee: '',
        member_discount: '',
        coupon_discount: '',
        point: ''
      },
      payType: 'wxpay',
      disabledPayment: null,
      isPaymentOpend: false,
      isDrugInfoOpend: false,
      invoiceTitle: ''
    }
  }

  componentDidShow () {
    this.setState({
      isPaymentOpend: false,
      isDrugInfoOpend: false
    })
    this.fetchAddress()
  }

  componentDidMount () {
    // this.fetchAddress()

    const { cart_type, pay_type: payType, shop_id } = this.$router.params
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
      payType: payType || this.state.payType
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
      pay_type: payType || 'wxpay'
    }

    this.setState({
      total: {
        items_count,
        total_fee: total_fee.toFixed(2)
      }
    })
    this.handleAddressChange(this.props.defaultAddress)
  }

  componentWillUnmount() {
    // teardown clean
    this.props.onClearCoupon()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.address !== this.props.address) {
      this.fetchAddress()
    }
  }

  async fetchAddress (cb) {
    const { type } = this.$router.params
    const isDrug = type === 'drug'
    Taro.showLoading({
      mask: true
    })
    // if (!isDrug) {
      const { list } = await api.member.addressList()
      this.setState({
        address_list: list
      }, () => {
        this.changeSelection()
        cb && cb(list)
      })
    /* } else {
      const { store_name, store_address, shop_id, hour } = await api.shop.getShop()
      this.setState({
        shop: {
          store_name,
          store_address,
          shop_id,
          hour
        }
      }, () => {
        this.calcOrder()
      })
    } */
    Taro.hideLoading()
  }

  changeSelection (params = {}) {
    const { address_list } = this.state
    if (address_list.length === 0) {
      // this.props.address = {
      //   current: null
      // }
      this.props.onAddressChoose(null)
      this.setState({
        address: null
      })
      // this.handleAddressChange()
      this.calcOrder()
      /*Taro.navigateTo({
        url: '/pages/member/edit-address'
      })*/
      return
    }

    let address = this.props.address
    if (!address) {
      const { address_id } = params
      address = find(address_list, addr => address_id ? address_id === addr.address_id : addr.is_def > 0) || address_list[0] || null
    }

    log.debug('[address picker] selection: ', address)
    this.props.onAddressChoose(address)
    this.handleAddressChange(address)
  }

  getParams () {
    const { type, seckill_id = null, ticket = null, group_id = null, shop_id } = this.$router.params
    let orderType = ''
    let activity = {}
    orderType = (() => {
      const key = type
      let value = ''
      switch (key) {
        case 'drug':
          value = 'normal_drug'
          break;
        case 'group':
          value = 'normal_group'
          activity = Object.assign(activity, {group_id: seckill_id})
          break;
        case 'seckill':
          value = 'normal_seckill'
          activity = Object.assign(activity, {seckill_id: seckill_id, seckill_ticket: ticket})
          break;
        default:
          value = 'normal'
      }
      return value
    })()
    const receiver = pickBy(this.state.address, {
      receiver_name: 'name',
      receiver_mobile: 'mobile',
      receiver_state: 'state',
      receiver_city: 'city',
      receiver_district: 'district',
      receiver_address: 'address',
      receiver_zip: 'zip'
    })
    let buyerInfo = {}
    if (type === 'drug') {
      buyerInfo = pickBy(this.state.drug, {
        drug_buyer_name: 'name',
        drug_buyer_id_card: 'id_card',
        drug_list_image: 'imgs',
      })
    }
    const { payType } = this.state
    const { coupon } = this.props
    const params = {
      ...this.params,
      ...receiver,
      ...buyerInfo,
      ...activity,
      receipt_type: 'logistics',
      order_type: orderType,
      promotion: 'normal',
      member_discount: 0,
      coupon_discount: 0,
			pay_type: payType,
			distributor_id: shop_id==='undefined'?0:shop_id
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

    return _cloneDeep(params)
  }

  async calcOrder () {
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    const params = this.getParams()
    console.log(params)
    let data
    try {
      data = await api.cart.total(params)
    } catch (e) {
      this.resolvePayError(e)
    }

    if (!data) return

    const { items, item_fee, totalItemNum, member_discount = 0, coupon_discount = 0, discount_fee, freight_fee = 0, freight_point = 0, point = 0, total_fee, remainpt, deduction } = data
    const total = {
      ...this.state.total,
      item_fee,
      discount_fee: -1 * discount_fee,
      member_discount: -1 * member_discount,
      coupon_discount: -1 * coupon_discount,
      freight_fee,
      total_fee: params.pay_type === 'dhpoint' ? 0 : total_fee,
      items_count: totalItemNum,
      point,
      freight_point,
      remainpt, // 总积分
      deduction // 抵扣
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
      address_id: 'address_id',
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

  handleChange = (val) => {
    let drug = null
    const arr = Object.values(val)
    console.log(arr)
    const isNan = arr.length > 0 && arr.find(item => item !== '')
    if (isNan) drug = val
    this.setState({
      drug,
      isDrugInfoOpend: false
    })
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

  handlePaymentShow = async () => {
    this.setState({
      isPaymentOpend: true,
      isDrugInfoOpend: false
    })
  }

  handleDrugInfoShow = async () => {
    this.setState({
      isPaymentOpend: false,
      isDrugInfoOpend: true
    })
  }

  resolvePayError (e) {
    const { payType } = this.state
    if (payType === 'dhpoint') {
      // let payTypeNeedsChange = ['当前积分不足以支付本次订单费用', '当月使用积分已达限额'].includes(e.message)
      this.setState({
        disabledPayment: { name: 'dhpoint', message: e.message },
        payType: 'wxpay'
      }, () => {
        this.calcOrder()
      })
    }
  }

  handlePay = async () => {
    if (!this.state.address) {
      return S.toast('请选择地址')
    }

    const { payType, total } = this.state
    const { type } = this.$router.params
    const isDrug = type === 'drug'

    if (payType === 'dhpoint') {
      try {
        const { confirm } = await Taro.showModal({
          title: '积分支付',
          content: `确认使用${total.remainpt}积分全额抵扣商品总价吗`,
          confirmColor: '#0b4137',
          confirmText: '确认使用',
          cancelText: '取消'
        })
        if (!confirm) return
      } catch (e) {
        console.log(e)
        return
      }
    }

    Taro.showLoading({
      title: '正在提交',
      mask: true
    })

    this.setState({
      submitLoading: true
    })

    let order_id, orderInfo
    try {
      let params = this.getParams()
      delete params.items
      // 积分不开票
      if (payType === 'dhpoint') {
        delete params.invoice_type
        delete params.invoice_content
      }
      orderInfo = await api.trade.create(params)
      order_id = isDrug ? orderInfo.order_id : orderInfo.trade_info.order_id
    } catch (e) {
      Taro.showToast({
        title: e.message,
        icon: 'none'
      })

      this.resolvePayError(e)

      // dhpoint 判断
      if (payType === 'dhpoint') {
        this.setState({
          submitLoading: false
        })
      }
    }

    Taro.hideLoading()
    if (!order_id) return

    if (isDrug) {
      Taro.redirectTo({
        url: '/pages/trade/list'
      })
      return
    }
    // 支付流程
    const paymentParams = {
      order_id,
      pay_type: this.state.payType,
      order_type: orderInfo.order_type
    }

    let config, payErr
    try {
      config = await api.cashier.getPayment(paymentParams)
      console.log(config, 449)
    } catch (e) {
      payErr = e
      console.log(e)
    }

    this.setState({
      submitLoading: false
    })
    // 积分流程
    if (payType === 'dhpoint') {
      if (!payErr) {
        Taro.showToast({
          title: '支付成功',
          icon: 'none'
        })

        this.props.onClearCart()
        Taro.redirectTo({
          url: `/pages/trade/detail?id=${order_id}`
        })
      }


      return
    }

    payErr = null
    try {
      const payRes = await Taro.requestPayment(config)
      log.debug(`[order pay]: `, payRes)
    } catch (e) {
      payErr = e
      Taro.showToast({
        title: e.err_desc || e.errMsg || '支付失败',
        icon: 'none'
      })
    }

    if (!payErr) {
      await Taro.showToast({
        title: '支付成功',
        icon: 'success'
      })

      this.props.onClearCart()
      Taro.redirectTo({
        url: `/pages/trade/detail?id=${order_id}`
      })

      /*this.props.onClearCart()
      Taro.redirectTo({
        url: `/pages/trade/detail?id=${order_id}`
      })*/
    } else {
      if (payErr.errMsg.indexOf('fail cancel') >= 0) {
        Taro.redirectTo({
          url: `/pages/trade/detail?id=${order_id}`
        })
      }
    }
    return

    // const url = `/pages/cashier/index?order_id=${order_id}`
    // this.props.onClearCart()
    // Taro.navigateTo({ url })
  }

  handleCouponsClick = () => {
    if (this.state.payType === 'dhpoint') {
      return
    }

    const items = this.params.items
      .filter(item => item.order_item_type !== 'gift')
      .map(item => {
        const { item_id, num, total_fee: price } = item
        return {
          item_id,
          price,
          num
        }
      })

    Taro.navigateTo({
      url: `/pages/cart/coupon-picker?items=${JSON.stringify(items)}`
    })
  }

  handlePaymentChange = async (payType) => {
    if (payType === 'dhpoint') {
      this.props.onClearCoupon()
    }
    this.setState({
      payType,
      isPaymentOpend: false
    }, () => {
      this.calcOrder()
    })
  }

  handleLayoutClose = () => {
    this.setState({
      isPaymentOpend: false,
      isDrugInfoOpend: false
    })
  }

  render () {
    const { coupon } = this.props
    const { info, address, total, showAddressPicker, showCheckoutItems, curCheckoutItems, payType, invoiceTitle, submitLoading, disabledPayment, isPaymentOpend } = this.state
    const { type } = this.$router.params
    const isDrug = type === 'drug'

    if (!info) {
      return <Loading />
    }

    const couponText = !coupon
      ? ''
      : coupon.type === 'member'
        ? '会员折扣'
        : ((coupon.value && coupon.value.title) || '')
    const isBtnDisabled = !address

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
          {
            /* !isDrug
            ? <AddressChoose
              isAddress={address}
            />
            : <View className='address-info'>
                <View className='address-info__label'>自提地址</View>
                <View className='view-flex view-flex-middle'>
                  <View className='address-info__icon icon-periscope'></View>
                  <View>
                    <View className='address-info__receiver'>{shop.store_name}</View>
                    <View className='address-info__addr'>{shop.store_address}</View>
                    <View className='address-info__addr'>营业时间：{shop.hour}</View>
                  </View>
                </View>
              </View> */
          }

          {(payType !== 'point' && payType !== 'dhpoint') && (
            <SpCell
              isLink
              className='coupons-list'
              title='选择优惠券'
              onClick={this.handleCouponsClick}
              value={couponText || ''}
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
                    {
                      isDrug &&
                      <SpCell
                        isLink
                        className='coupons-list'
                        title='用药人信息'
                        onClick={this.handleDrugInfoShow}
                        value={drug ? '已上传' : '用药人及处方上传'}
                      />
                    }
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

          {/*<SpCell
            isLink
            className='trade-invoice'
            title='开发票'
            onClick={this.handleInvoiceClick}
          >
            <Text>{invoiceTitle || '否'}</Text>
          </SpCell>*/}

          {/*<SpCell
            className='trade-shipping'
            title='配送方式'
            value='[快递免邮]'
          >
          </SpCell>*/}

          <View className='trade-payment'>
            <SpCell
              isLink
              border={false}
              title='支付方式'
              onClick={this.handlePaymentShow}
            >
              <Text>{payType === 'dhpoint' ? '积分支付' : '微信支付'}</Text>
            </SpCell>
            {total.deduction && (
              <View className='trade-payment__hint'>
                可用{total.remainpt}积分，抵扣 <Price unit='cent' value={total.deduction} /> (包含运费 <Price unit='cent' value={total.freight_fee}></Price>)
              </View>
            )}
          </View>

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
              {/*<SpCell
                className='trade-sub-total__item'
                title='会员折扣：'
              >
                <Price
                  unit='cent'
                  value={total.member_discount}
                />
              </SpCell>*/}
              <SpCell
                className='trade-sub-total__item'
                title='优惠金额：'
              >
                <Price
                  unit='cent'
                  value={total.discount_fee}
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
            共<Text className='total-items'>{total.items_count}</Text>件商品　总计:
            {
              payType !== 'point'
                ? <Price primary unit='cent' value={total.total_fee} />
                : (total.point && <Price primary value={total.point} noSymbol noDecimal appendText='积分' />)
            }
          </View>
          <AtButton
            type='primary'
            className='btn-confirm-order'
            loading={submitLoading}
            disabled={isBtnDisabled}
            onClick={this.handlePay}
          >{isDrug ? '提交预约' : '提交订单'}</AtButton>
        </View>

        {
          <DrugInfo
            isOpened={isDrugInfoOpend}
            info={drug}
            onClose={this.handleLayoutClose}
            onChange={this.handleChange}
          />
        }

        <PaymentPicker
          isOpened={isPaymentOpend}
          type={payType}
          disabledPayment={disabledPayment}
          onClose={this.handleLayoutClose}
          onChange={this.handlePaymentChange}
        ></PaymentPicker>

        <SpToast />
      </View>
    )
  }
}
