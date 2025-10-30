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
import { Text } from '@tarojs/components'
import { classNames, isNumber } from '@/utils'

import './price.scss'

export default class Price extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    className: null,
    value: null,
    primary: false,
    noSymbol: false,
    noDecimal: false,
    unit: 'default',
    appendText: '',
    plus: false
  }

  static externalClasses = ['classes']

  render() {
    const {
      value = '',
      noSymbol,
      primary,
      noDecimal,
      className,
      unit,
      appendText,
      lineThrough,
      plus
    } = this.props
    let priceVal = unit === 'cent' ? +value / 100 : value
    if (isNumber(priceVal)) {
      priceVal = priceVal.toFixed(2)
    }
    const [int, decimal] = (priceVal || '').split('.')
    const minus = value < 0
    const symbol = this.props.symbol || '¥'

    return (
      <Text
        className={classNames(
          lineThrough ? 'price-market' : 'price',
          'classes',
          primary ? 'price__primary' : null,
          className
        )}
      >
        {minus && <Text>-</Text>}
        {plus && <Text>+</Text>}
        {noSymbol ? null : <Text className='price__symbol'>{symbol}</Text>}
        <Text className='price__int'>{int.indexOf('-') === 0 ? int.slice(1) : int}</Text>
        {decimal !== undefined && !noDecimal && <Text className='price__decimal'>.{decimal}</Text>}
        {appendText && <Text className='price__append'>{appendText}</Text>}
      </Text>
    )
  }
}
