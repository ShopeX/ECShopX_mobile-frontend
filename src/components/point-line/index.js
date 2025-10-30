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
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import configStore from '@/store'

import './index.scss'

const { store } = configStore()
export default class HomeCapsule extends Component {
  static defaultProps = {
    url: ''
  }

  render() {
    const { className, point, plus, isGoodCard, isStoreOut } = this.props
    const classes = classNames('point-line', className, { plus: plus })

    return (
      <View
        className={classNames(classes, [{ isGoodCard: isGoodCard }, { isStoreOut: isStoreOut }])}
      >
        <View className='number'>{point}</View>
        <View className='text'>{store.getState().sys.pointName}</View>
      </View>
    )
  }
}
