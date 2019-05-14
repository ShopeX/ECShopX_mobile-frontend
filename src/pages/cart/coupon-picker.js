import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { Price, SpCheckbox, CouponItem } from '@/components'
import { pickBy } from '@/utils'
import api from '@/api'

import './coupon-picker.scss'

@connect(({ cart }) => ({
  curCoupon: cart.coupon
}), (dispatch) => ({
  onChangeCoupon: (coupon) => dispatch({ type: 'cart/changeCoupon', payload: coupon })
}))
export default class CouponPicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      coupons: null
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { items, use_platform = 'mall' } = this.$router.params

    const params = {
      items: JSON.parse(items),
      use_platform,
      page_type: 'picker',
      valid: true
    }

    const couponsData = await api.cart.coupons(params)
    const coupons = pickBy(couponsData.list, {
      card_type: 'card_type',
      title: 'title',
      card_id: 'card_id',
      code: 'code',
      valid: 'valid',
      reduce_cost: 'reduce_cost',
      least_cost: 'least_cost',
      discount: 'discount',
      begin_date: 'begin_date',
      end_date: 'end_date'
    })

    this.setState({
      coupons
    })
  }

  handleCouponSelect (type = 'coupon', value) {
    const payload = value
      ? { type, value }
      : null
    this.props.onChangeCoupon(payload)
    setTimeout(() => {
      Taro.navigateBack()
    }, 300)
  }

  render () {
    const { coupons } = this.state
    const { curCoupon } = this.props

    if (!coupons) {
      return null
    }

    const memberCoupon = {
      card_type: 'member',
      title: '会员折扣价'
    }

    return (
      <View className='coupon-picker'>
        <CouponItem
          info={memberCoupon}
          onClick={this.handleCouponSelect.bind(this, 'member', true)}
        >
          <SpCheckbox
            checked={curCoupon && curCoupon.type === 'member' && curCoupon.value}
          />
        </CouponItem>
        {
          coupons.map((coupon, idx) => {
            return (
              <CouponItem
                key={idx}
                info={coupon}
                onClick={this.handleCouponSelect.bind(this, 'coupon', coupon)}
              >
                <SpCheckbox
                  checked={curCoupon && curCoupon.type === 'coupon' && curCoupon.value.code === coupon.code}
                />
              </CouponItem>

              // <View
              //   key={idx}
              //   className='coupon-item'
              //   onClick={this.handleCouponSelect.bind(this, 'coupon', coupon)}
              // >
              //   <View className='coupon-item__hd'>
              //     <View className='coupon-item__name'>
              //       {coupon.card_type === 'cash' && (<Price value={coupon.reduce_cost} unit='cent' />)}
              //       {coupon.card_type === 'discount' && (<Text>{(100 - coupon.discount) / 10}折</Text>)}
              //       {coupon.card_type === 'gift' && (<Text>兑换券</Text>)}
              //     </View>
              //     <Text className='coupon-item__type'>{typeStr}</Text>
              //   </View>
              //   <View className='coupon-item__bd'>
              //     <Text className='coupon-item__title'>{coupon.title}</Text>
              //     <View className='coupon-item__rule'>
              //       {(coupon.card_type !== 'gift' && coupon.least_cost > 0)
              //         ? <View className='coupon-item__rule-inner'>满<Price value={coupon.least_cost} unit='cent' />元可用</View>
              //         : (coupon.card_type != 'gift' && (<Text>满0.01可用</Text>))}
              //     </View>
              //     <Text className='coupon-item__time'>使用期限 {coupon.begin_date} ~ {coupon.end_date}</Text>
              //   </View>
              //   <View className='coupon-item__ft'>
              //     <SpCheckbox
              //       checked={curCoupon && curCoupon.type === 'coupon' && curCoupon.value.code === coupon.code}
              //     />
              //   </View>
              // </View>
            )
          })
        }
        <View
          className='coupon-item coupon-item__nil'
          onClick={this.handleCouponSelect.bind(this, 'coupon', null)}
        >
          <View className='coupon-item__bd'>
            <Text className='coupon-item__title'>不使用优惠券</Text>
          </View>
          <View className='coupon-item__ft'>
            <SpCheckbox
              checked={!curCoupon || !curCoupon.value}
            />
          </View>
        </View>
      </View>
    )
  }
}
