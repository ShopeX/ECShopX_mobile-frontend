import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Text, ScrollView, Picker } from '@tarojs/components'
import { connect } from 'react-redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer } from 'taro-ui'
import { SpCell } from '@/components'
import api from '@/api'
import { pickBy, classNames } from '@/utils'

import './reservation-detail.scss'

@withPager
@withBackToTop
export default class ReservationDetail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      brand_name_list: [1, 2, 3, 4],
      brand_time_list: [1, 23, 4],
      brand_service_list: [1, 2, 3, 4],
      brand_store_list: [1, 23, 4],
      brand_name: '',
      brand_time: '',
      brand_service: '',
      brand_store: ''
    }
  }

  componentDidMount () {}

  async fetch () {}

  handleCell = (type, e) => {
    const checked_index = e.detail.value
    if (type === 'brand') {
      this.setState({
        brand_name: this.state.brand_name_list[checked_index]
      })
    }
    if (type === 'time') {
      this.setState({
        brand_time: this.state.brand_time_list[checked_index]
      })
    }
    if (type === 'service') {
      this.setState({
        brand_service: this.state.brand_service_list[checked_index]
      })
    }
    if (type === 'store') {
      this.setState({
        brand_store: this.state.brand_store_list[checked_index]
      })
    }
  }

  handleReservate = () => {
    let query = {
      brand_time: this.state.brand_time,
      brand_name: this.state.brand_name,
      brand_service: this.state.brand_service,
      brand_store: this.state.brand_store
    }
    Taro.navigateTo({
      url: '/marketing/pages/reservation/goods-reservate'
    })
    console.log(query, 53)
  }

  render () {
    const {
      brand_name_list,
      brand_time_list,
      brand_service_list,
      brand_store_list,
      brand_name,
      brand_time,
      brand_service,
      brand_store
    } = this.state

    return (
      <View className='reservation-detail'>
        <View className='reservation-detail__status'>
          <Image
            mode='widthFix'
            src='/assets/imgs/pay_fail.png'
            className='reservation-detail__status_img'
          ></Image>
          <View className='reservation-detail__status_name'>
            <Text className='status-title'>预约成功</Text>
            <Text>免费体验美妆护肤一次，请提早10分钟到达</Text>
          </View>
        </View>
        <View className='reservation-detail__address'>
          <View className='reservation-detail__address_info'>
            <Text className='address-title'>门店名称</Text>
            <Text>门店地址</Text>
          </View>
          <View>&gt;</View>
        </View>
        <View className='reservation-detail__info'>
          <SpCell title='预约时间' value='周五11：30'></SpCell>
          <SpCell title='预约号' value='122344566'></SpCell>
          <SpCell title='会员号' value='122344566'></SpCell>
        </View>
        <View className='reservation-detail__info'>
          <Text className='reservation-detail__info_title'>向商家出示二维码</Text>
        </View>
      </View>
    )
  }
}
