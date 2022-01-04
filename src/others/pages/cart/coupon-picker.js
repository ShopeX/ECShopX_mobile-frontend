import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from 'react-redux'
import { SpCheckbox, CouponItem, Loading, SpNote } from '@/components'
import { pickBy } from '@/utils'
import { withPager } from '@/hocs'
import api from '@/api'

import './coupon-picker.scss'

@connect(
  ({ cart }) => ({
    curCoupon: cart.coupon
  }),
  (dispatch) => ({
    onChangeCoupon: (coupon) => dispatch({ type: 'cart/changeCoupon', payload: coupon })
  })
)
@withPager
export default class CouponPicker extends Component {
  $instance = getCurrentInstance()
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      coupons: []
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (query = {}) {
    //const { distributor_id } = Taro.getStorageSync('curStore')
    const {
      items,
      is_checkout,
      cart_type,
      use_platform = 'mall',
      distributor_id,
      source,
      goodType
    } = this.$instance.router.params
    // const { curCoupon } = this.props
    const { page_no: page, page_size: pageSize } = query

    const params = {
      ...query,
      items: JSON.parse(items),
      use_platform,
      page_type: 'picker',
      distributor_id,
      valid: true,
      is_checkout,
      cart_type,
      iscrossborder: 0,
      page,
      pageSize
    }

    if (goodType === 'cross') {
      params.iscrossborder = 1
    }

    if (source === 'other_pay') {
      let { cxdid, dtid, smid } = Taro.getStorageSync('espierCheckoutData')
      params.cxdid = cxdid
      params.distributor_id = dtid
      params.cart_type = 'cxd'
      params.order_type = 'normal_shopguide'
      params.salesman_id = smid
    }

    // 新导购信息处理
    const smid = Taro.getStorageSync('s_smid')
    const chatId = Taro.getStorageSync('chatId')
    if (smid) {
      params.salesman_id = smid
    }
    if (chatId) {
      params.chat_id = chatId
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
      end_date: 'end_date',
      description: 'description',
      use_bound: 'use_bound'
    })
    const list = [...this.state.coupons, ...coupons]
    this.setState({
      coupons: list.sort((a) => (a.valid ? -1 : 1))
      // coupons: list
    })
    return { total: couponsData.total_count }
  }

  handleCouponSelect (type = 'coupon', value) {
    if (value && !value.valid) return

    const payload = value
      ? { type, value }
      : {
          not_use_coupon: 1
        }
    this.props.onChangeCoupon(payload)
    setTimeout(() => {
      Taro.navigateBack()
    }, 300)
  }

  render () {
    const { coupons, page = {} } = this.state
    const { curCoupon } = this.props

    if (!coupons) {
      return null
    }

    // const memberCoupon = {
    //   card_type: 'member',
    //   title: '会员折扣价'
    // }

    return (
      <View className='coupon-picker'>
        <ScrollView scrollY className='coupon-list__scroll' onScrollToLower={this.nextPage}>
          {coupons.map((coupon, idx) => {
            return (
              <CouponItem
                key={`${idx}1`}
                info={coupon}
                isDisabled={!coupon.valid}
                onClick={this.handleCouponSelect.bind(this, 'coupon', coupon)}
                isExist
              >
                <SpCheckbox
                  checked={curCoupon && curCoupon.value && curCoupon.value.code === coupon.code}
                  disabled={!coupon.valid}
                />
              </CouponItem>
            )
          })}
          {page.isLoading && <Loading>正在加载...</Loading>}
          {!page.isLoading && !page.hasNext && !coupons.length && (
            <SpNote img='trades_empty.png'>赶快去添加吧~</SpNote>
          )}
        </ScrollView>
        <View
          className='coupon-item coupon-item__nil'
          onClick={this.handleCouponSelect.bind(this, 'coupon', null)}
        >
          <View className='coupon-item__bd'>
            <Text className='coupon-item__title'>不使用优惠券</Text>
          </View>
          <View className='coupon-item__ft'>
            <SpCheckbox checked={!curCoupon || !curCoupon.value} />
          </View>
        </View>
      </View>
    )
  }
}
