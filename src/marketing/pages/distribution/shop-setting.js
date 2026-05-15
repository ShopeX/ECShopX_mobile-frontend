/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { withTranslation } from 'react-i18next'
import { SpCell, SpPage } from '@/components'
import { $t } from '@/i18n'
import api from '@/api'
import './shop-setting.scss'

class DistributionShopSetting extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: {}
    }
  }

  componentDidShow() {
    this.fetch()
  }

  async fetch() {
    const res = await api.distribution.info()
    const { shop_name, brief, shop_pic } = res

    this.setState({
      info: {
        shop_name,
        brief,
        shop_pic
      }
    })
  }

  handleClick = (key) => {
    const { info } = this.state

    Taro.navigateTo({
      url: `/marketing/pages/distribution/shop-form?key=${key}&val=${info[key] || ''}`
    })
  }

  render() {
    const { info } = this.state

    return (
      <SpPage className='page-distribution-shop-setting'>
        <View className='min-h-full'>
          <SpCell
            title={$t('dd89651c.798f95')}
            value={info.shop_name}
            onClick={this.handleClick.bind(this, 'shop_name')}
            border
            isLink
          />
          <SpCell
            title={$t('dd89651c.41479a')}
            value={info.brief}
            onClick={this.handleClick.bind(this, 'brief')}
            border
            isLink
          />
          <SpCell
            title={$t('dd89651c.537de8')}
            onClick={this.handleClick.bind(this, 'shop_pic')}
            isLink
          >
            <Image
              className='shop-sign'
              src={info.shop_pic || 'https://fakeimg.pl/320x100/EFEFEF/CCC/?font=lobster'}
              mode='widthFix'
            />
          </SpCell>
        </View>
      </SpPage>
    )
  }
}

export default withTranslation()(DistributionShopSetting)
