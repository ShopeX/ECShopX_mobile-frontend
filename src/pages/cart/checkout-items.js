// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { Component } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import { GoodsItem } from '@/components'
import { classNames } from '@/utils'
import { connect } from 'react-redux'

import './checkout-items.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class CheckoutItems extends Component {
  static defaultProps = {
    isOpened: false,
    list: [],
    onClickBack: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  render() {
    const { isOpened, list, onClickBack } = this.props

    return (
      <View className={classNames('checkout-items', isOpened ? 'checkout-items__active' : null)}>
        <AtNavBar
          leftIconType='chevron-left'
          title={`商品清单(${list.length})件`}
          onClickLeftIcon={onClickBack}
        />
        <ScrollView class='checkout-items__scroll'>
          <View className='checkout-items__list'>
            {list.map((item) => {
              return <GoodsItem key={item.item_id} info={item} />
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}
