/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { withPager, withBackToTop } from '@/hocs'
import './brand-detail.scss'

class BrandDetail extends Component {
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

    const placeholder = $t('65338650.708c9d')

    return (
      <View className='brand-detail'>
        <View className='brand-detail__normal brand-detail__brand'>
          <Picker
            mode='selector'
            range={brand_store_list}
            onChange={this.handleCell.bind(this, 'store')}
          >
            <View className='picker'>
              <View className='picker__title'>{$t('65338650.9d4b91')}</View>
              <View className='pick-value'>
                <Text>{brand_store !== '' ? brand_store : placeholder}</Text>
                <View className='sp-cell__ft-icon iconfont at-icon at-icon-chevron-right'></View>
              </View>
            </View>
          </Picker>
          <Picker
            mode='selector'
            range={brand_name_list}
            onChange={this.handleCell.bind(this, 'brand')}
          >
            <View className='picker'>
              <View className='picker__title'>{$t('65338650.d403a9')}</View>
              <View className='pick-value'>
                <Text>{brand_name !== '' ? brand_name : placeholder}</Text>
                <View className='sp-cell__ft-icon iconfont at-icon at-icon-chevron-right'></View>
              </View>
            </View>
          </Picker>
          <Picker
            mode='selector'
            range={brand_service_list}
            onChange={this.handleCell.bind(this, 'service')}
          >
            <View className='picker'>
              <View className='picker__title'>{$t('65338650.97ad14')}</View>
              <View className='pick-value'>
                <Text>{brand_service !== '' ? brand_service : placeholder}</Text>
                <View className='sp-cell__ft-icon iconfont at-icon at-icon-chevron-right'></View>
              </View>
            </View>
          </Picker>
        </View>
        <View className='brand-detail__normal brand-detail__time'>
          <Picker
            mode='selector'
            range={brand_time_list}
            onChange={this.handleCell.bind(this, 'time')}
          >
            <View className='picker'>
              <View className='picker__title'>{$t('65338650.652e09')}</View>
              <View className='pick-value'>
                <Text>{brand_time !== '' ? brand_time : placeholder}</Text>
                <View className='sp-cell__ft-icon iconfont at-icon at-icon-chevron-right'></View>
              </View>
            </View>
          </Picker>
        </View>
        <View className='brand-detail__btn' onClick={this.handleReservate.bind(this)}>
          {$t('65338650.8ef63c')}
        </View>
      </View>
    )
  }
}

export default withPager(withBackToTop(withTranslation()(BrandDetail)))
