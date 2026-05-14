/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { withPager, withBackToTop } from '@/hocs'
import { SpCell } from '@/components'
import './reservation-detail.scss'

class ReservationDetail extends Component {
  constructor(props) {
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

  componentDidMount() {}

  async fetch() {}

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

  render() {
    return (
      <View className='reservation-detail'>
        <View className='reservation-detail__status'>
          <Image
            mode='widthFix'
            src='/assets/imgs/pay_fail.png'
            className='reservation-detail__status_img'
          ></Image>
          <View className='reservation-detail__status_name'>
            <Text className='status-title'>{$t('fa0f98d6.ff1d1f')}</Text>
            <Text>{$t('fa0f98d6.4ddc73')}</Text>
          </View>
        </View>
        <View className='reservation-detail__address'>
          <View className='reservation-detail__address_info'>
            <Text className='address-title'>{$t('fa0f98d6.740032')}</Text>
            <Text>{$t('fa0f98d6.85c7c1')}</Text>
          </View>
          <View>&gt;</View>
        </View>
        <View className='reservation-detail__info'>
          <SpCell title={$t('fa0f98d6.652e09')} value={$t('d839699a.4343fa')}></SpCell>
          <SpCell title={$t('fa0f98d6.700685')} value='122344566'></SpCell>
          <SpCell title={$t('fa0f98d6.f806ca')} value='122344566'></SpCell>
        </View>
        <View className='reservation-detail__info'>
          <Text className='reservation-detail__info_title'>{$t('fa0f98d6.fdbb0b')}</Text>
        </View>
      </View>
    )
  }
}

export default withPager(withBackToTop(withTranslation()(ReservationDetail)))
