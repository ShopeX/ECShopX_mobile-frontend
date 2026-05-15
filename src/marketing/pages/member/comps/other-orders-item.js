/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { View, Button } from '@tarojs/components'
import { $t, ti } from '@/i18n'
import './other-orders-item.scss'

class OtherOrdersItem extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { info, onClick } = this.props

    if (!info) {
      return null
    }

    return (
      <View className='other-orders-item' onClick={onClick}>
        <View className='flex item-info'>
          <View>{ti('8116735b.44263f', [info.order_id])}</View>
          <View>{ti('85e2d31f.fd312f', [info.n_total_fee])}</View>
        </View>
        <View className='align-right'>
          <Button className='d-button' circle size='mini' onClick={onClick}>
            {$t('8116735b.8054f7')}
          </Button>
        </View>
      </View>
    )
  }
}

export default withTranslation()(OtherOrdersItem)
