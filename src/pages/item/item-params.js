import React, { Component } from 'react';
import { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components'
import api from '@/api'
import { pickBy } from '@/utils'
import { SpNavBar, SpPage } from '@/components'
import { ParamsItem } from './comps'

import './item-params.scss'

export default class ItemParams extends Component {
  $instance = getCurrentInstance();

  constructor(props) {
    super(props)

    this.state = {
      list: []
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    const { id } = this.$instance.router.params
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

  render() {
    const { list } = this.state

    return (
      <SpPage>
        <View className='goods-params-wrap'>
        <SpNavBar title='商品参数' leftIconType='chevron-left' />
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
