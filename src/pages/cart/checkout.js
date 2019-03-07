import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Switch } from '@tarojs/components'
import { AtButton, AtInput, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { Loading, Price, SpCell, AddressPicker } from '@/components'
import api from '@/api'
import { lockScreen } from '@/utils/dom'
import CheckoutItems from './checkout-items'

import './checkout.scss'

export default class CartCheckout extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: null,
      address: null,
      showShippingPicker: false,
      showAddressPicker: false,
      showCheckoutItems: false,
      curCheckoutItems: null,
      total: null,
      pointTotal: 0,
      point: null,
      usePoint: false
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { point_total: { point_count: pointTotal } } = await api.member.pointDetail()
    const { cartInfo: info, total, default_address: address } = await api.cart.checkout()

    this.setState({
      info,
      pointTotal,
      total,
      address
    })
  }

  handleAddressChange = (address) => {
    this.setState({
      address
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

  toggleAddressPicker (isOpened) {
    if (isOpened === undefined) {
      isOpened = !this.state.showAddressPicker
    }

    lockScreen(isOpened)
    this.setState({ showAddressPicker: isOpened })
  }

  toggleCheckoutItems (isOpened) {
    if (isOpened === undefined) {
      isOpened = !this.state.showCheckoutItems
    }

    lockScreen(isOpened)
    this.setState({ showCheckoutItems: isOpened })
  }

  render () {
    const { info, address, point, usePoint, pointTotal, total, showShippingPicker, showAddressPicker, showCheckoutItems, curCheckoutItems } = this.state
    const pointPrice = (pointTotal / 100).toFixed(2)

    if (!info) {
      return <Loading />
    }

    return (
      <View className='page-checkout'>
        <ScrollView
          scrollY
          className='checkout__wrap'
        >
          <View
            className='address-info'
            onClick={this.toggleAddressPicker.bind(this, true)}
          >
            <SpCell
              isLink
              icon='map-pin'
            >
              {
                address
                  ? <View className='address-info__bd'>
                      <Text className='address-info__receiver'>
                        收货人：{address.name} {address.mobile}
                      </Text>
                      <Text className='address-info__addr'>
                        收货地址：{address.addrdetail}
                      </Text>
                    </View>
                  : <View className='address-info__bd'>请选择收货地址</View>
              }
            </SpCell>
          </View>

          <View className='cart-list'>
            {
              info.resultCartData.map(cart => {
                return (
                  <View
                    className='cart-group'
                    key={cart.shop_id}
                  >
                    <View className='cart-group__shop'>{cart.shop_name}</View>
                    <View className='sec cart-group__cont'>
                      <SpCell
                        isLink
                        className='trade-items'
                        value={`共${cart.cartCount.itemnum}件商品`}
                        onClick={this.handleClickItems.bind(this, cart.items)}
                      >
                        <View className='trade-items__bd'>
                          {
                            cart.items.map((item, idx) => {
                              return (<Image
                                key={idx}
                                className='trade-item__img'
                                mode='aspectFill'
                                src={item.image_default_id}
                              />)
                            })
                          }
                        </View>
                      </SpCell>
                      <SpCell
                        className='trade-shipping'
                        title='配送方式'
                        value='顺丰'
                        isLink
                      >
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

          <View className='sec trade-point'>
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
          </SpCell>

          <View className='sec trade-sub-total'>
            <SpCell
              className='trade-sub-total__item'
              title='商品金额'
            >
              <Price value='39.90' />
            </SpCell>
            <SpCell
              className='trade-sub-total__item'
              title='商品金额'
            >
              <Text>免运费</Text>
            </SpCell>
            <SpCell
              className='trade-sub-total__item'
              title='优惠券'
            >
              <Price value='-39.90' />
            </SpCell>
            <SpCell
              className='trade-sub-total__item'
              title='积分'
            >
              <Price value='-10.90' />
            </SpCell>
          </View>
        </ScrollView>

        <AddressPicker
          isOpened={showAddressPicker}
          value={address}
          onChange={this.handleAddressChange}
          onClickBack={this.toggleAddressPicker.bind(this, false)}
        />

        <CheckoutItems
          isOpened={showCheckoutItems}
          list={curCheckoutItems}
          onClickBack={this.toggleCheckoutItems.bind(this, false)}
        />

        <AtActionSheet
          isOpened={showShippingPicker}
          onClose={() => this.setState({ showShippingPicker: false })}
        >
          <AtActionSheetItem onClick={this.handleShippingChange}>顺丰</AtActionSheetItem>
          <AtActionSheetItem onClick={this.handleShippingChange}>自提</AtActionSheetItem>
        </AtActionSheet>

        <View className='toolbar checkout-toolbar'>
          <View className='checkout__total'>
            共<Text className='total-items'>{total.itemsCount}</Text>件，合计: <Price primary value={total.allCostFee} />
          </View>
          <AtButton
            circle
            type='primary'
            className='btn-confirm-order'
          >提交订单</AtButton>
        </View>
      </View>
    )
  }
}
