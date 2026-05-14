/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { navigateTo } from '@/utils'
import { $t } from '@/i18n'
import './index.scss'

@connect(({ shop }) => ({
  store: shop.curStore
}))
export default class SpStorePicker extends Component {
  static options = {
    addGlobalClass: true
  }

  navigateTo = navigateTo

  render() {
    const { store } = this.props
    return (
      <View
        className='sp-store-picker'
        onClick={this.navigateTo.bind(this, '/subpages/store/list')}
      >
        {/* <Text className="iconfont icon-dizhi-01"></Text> */}
        <Text className='shop-name'>{store ? store.store_name : $t('6a6a790c.afa2e6')}</Text>
        <Text className='iconfont icon-arrowRight'></Text>
      </View>
    )
  }
}
