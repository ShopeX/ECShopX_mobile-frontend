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
import './brand-result.scss'

class BrandResult extends Component {
  constructor(props) {
    super(props)

    this.state = {
      brand_store: '',
      brand_time: ''
    }
  }

  componentDidMount() {}

  async fetch() {}

  handleClickRecord = () => {
    Taro.navigateTo({
      url: '/marketing/pages/reservation/reservation-list'
    })
  }

  render() {
    const { brand_store, brand_time } = this.state

    return (
      <View className='brand-result'>
        <View className='brand-result__title'>
          <Image
            mode='widthFix'
            className='brand-result__title_img'
            src='/assets/imgs/pay_fail.png'
          ></Image>
          <Text className='brand-result__title_status'>{$t('91ab6c28.ff1d1f')}</Text>
          <Text className='brand-result__title_tip'>{$t('91ab6c28.dfdd63')}</Text>
        </View>
        <View className='brand-result__info'>
          <SpCell title={$t('91ab6c28.ef35a1')} isLink value={brand_store}></SpCell>
          <SpCell title={$t('91ab6c28.652e09')} value={brand_time}></SpCell>
        </View>
        <View className='brand-result__btn' onClick={this.handleClickRecord.bind(this)}>
          {$t('91ab6c28.007ce5')}
        </View>
        <View className='brand-result__btn cancel_btn'>{$t('91ab6c28.5c0f6a')}</View>
      </View>
    )
  }
}

export default withPager(withBackToTop(withTranslation()(BrandResult)))
