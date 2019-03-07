import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Price } from '@/components'
import { pickBy, formatTime } from '@/utils'
import api from '@/api'

export default class CouponPicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      coupons: []
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { items } = this.$router.params
    const couponsData = await api.cart.coupons(JSON.parse(items))
    const coupons = pickBy(couponsData.list, {
      card_type: 'card_type',
      title: 'title',
      card_id: 'card_id',
      valid: 'valid',
      reduce_cost: 'reduce_cost',
      least_cost: 'least_cost',
      discount: 'discount',
      begin_date: ({ begin_date }) => formatTime(begin_date * 1000),
      end_date: ({ end_date }) => formatTime(end_date * 1000)
    })

    this.setState({
      coupons
    })
  }

  handleItemClick (coupon) {
    console.log(coupon)
  }

  render () {
    const { coupons } = this.state

    return (
      <View className='coupon-picker'>
        {
          coupons.map((coupon, idx) => {
            return (
              <View
                key={idx}
                className='coupon-item'
                onClick={this.handleItemClick.bind(this, coupon)}
              >
                <View className='coupon-item__bd'>
                  <Text className='coupon-item__name'>{coupon.title}</Text>
                  <Text className='coupon-item__time'>有效期：{coupon.begin_date} ~ {coupon.end_date}</Text>
                </View>
                <View className='coupon-item__ft'>
                  {coupon.card_type === 'cash' && (<Price value={coupon.reduce_cost} unit='cent' />)}
                  {coupon.card_type === 'discount' && (<Text>{(100 - coupon.discount) / 10}折</Text>)}
                  {coupon.card_type === 'gift' && (<Text>兑换券</Text>)}
                  {(coupon.card_type !== 'gift' && coupon.least_cost > 0)
                    ? <Text>满<Price value={coupon.least_cost} unit='cent' />元可用</Text>
                    : (coupon.card_type != 'gift' && (<Text>满0.01可用</Text>))
                  }

                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
