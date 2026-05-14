/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import api from '@/api'
import { pickBy } from '@/utils'
import { SpNavBar, SpPage } from '@/components'
import { $t } from '@/i18n'
import { ParamsItem } from './comps'

import './item-params.scss'

class ItemParams extends Component {
  $instance = getCurrentInstance() || {}

  constructor(props) {
    super(props)

    this.state = {
      list: []
    }
  }

  componentDidMount() {
    this.fetch()
    this.syncNavTitle()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('45ebf973.8686bb') })
  }

  async fetch() {
    const { id } = this.$instance?.router?.params
    if (id) {
      const info = await api.item.detail(id)
      const { item_params } = info
      const itemParams = pickBy(item_params, {
        label: 'attribute_name',
        value: 'attribute_value_name'
      })
      this.setState({
        list: itemParams
      })
    }
  }

  render() {
    const { list } = this.state

    return (
      <SpPage>
        <View className='goods-params-wrap'>
          <SpNavBar title={$t('45ebf973.8686bb')} leftIconType='chevron-left' />
          <View className='goods-params'>
            {list.map((item) => {
              return <ParamsItem key={item.attribute_id} info={item} />
            })}
          </View>
        </View>
      </SpPage>
    )
  }
}

export default withTranslation()(ItemParams)
