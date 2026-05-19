/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, isNumber, isString, styleNames } from '@/utils'

import './index.scss'

/**
 * SpPrice 价格组件（合并原 SpNewPrice 的 card 样式）
 *
 * @props variant - 'card' 门店商品卡片样式（原 SpNewPrice）；默认标准样式
 * @props value / price - 价格值（price 为兼容旧 SpNewPrice）
 * @props unit - 'cent' | 'default'；card  variant 默认 'cent'
 * @props discount - card：灰色删除线原价；default：等同 lineThrough
 * @props equal - card：整数与小数字号一致
 * @props sizePreset - card：'normal' | 'small'
 * @props digits - card：小数位数，默认 2
 */
export default class SpPrice extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    className: null,
    value: null,
    price: null,
    primary: false,
    noSymbol: false,
    noDecimal: false,
    unit: 'default',
    appendText: '',
    plus: false,
    size: 34,
    weight: 500,
    color: null,
    sizeSame: false,
    unitSize: null,
    variant: 'default',
    discount: false,
    equal: false,
    sizePreset: 'normal',
    digits: 2
  }

  static externalClasses = ['classes']

  resolveRawValue() {
    const { value, price } = this.props
    if (value != null && value !== '') {
      return value
    }
    return price
  }

  resolveUnit() {
    const { unit, variant } = this.props
    if (variant === 'card' && unit === 'default') {
      return 'cent'
    }
    return unit
  }

  renderCardVariant() {
    const {
      className,
      primary,
      discount,
      equal,
      sizePreset,
      digits,
      noSymbol,
      appendText,
      plus
    } = this.props
    const raw = this.resolveRawValue()
    const unit = this.resolveUnit()
    let num = raw
    if (isString(num)) {
      num = parseFloat(num)
    }
    let priceVal = unit === 'cent' ? +num / 100 : +num
    if (!isNumber(priceVal) || Number.isNaN(priceVal)) {
      priceVal = 0
    }
    const fixed = Number(priceVal).toFixed(digits)
    const [intPart, decimalPart] = fixed.split('.')
    const symbol = this.props.symbol || '¥'
    const minus = num < 0

    return (
      <View
        className={classNames(
          'sp-price',
          'sp-price--card',
          {
            'sp-price--card-discount': discount,
            'sp-price--card-equal': equal,
            'sp-price--card-small': sizePreset === 'small'
          },
          primary ? 'sp-price__primary' : null,
          className
        )}
      >
        {minus && <Text>-</Text>}
        {plus && <Text>+</Text>}
        {!noSymbol && <Text className='sp-price--card-prefix'>{symbol}</Text>}
        <Text className='sp-price--card-int'>{intPart}.</Text>
        {!this.props.noDecimal && decimalPart != null && (
          <Text className='sp-price--card-decimal'>{decimalPart}</Text>
        )}
        {appendText && <Text className='sp-price__append'>{appendText}</Text>}
      </View>
    )
  }

  renderDefaultVariant() {
    const {
      value = '',
      noSymbol,
      primary,
      noDecimal,
      className,
      appendText,
      lineThrough,
      plus,
      size,
      color,
      sizeSame,
      weight,
      unitSize,
      family = '',
      showdecimal = false,
      discount
    } = this.props
    const unit = this.resolveUnit()
    let _value = this.resolveRawValue()
    if (isString(_value)) {
      _value = parseFloat(_value)
    }

    let priceVal = unit === 'cent' ? +_value / 100 : _value
    if (isNumber(priceVal)) {
      priceVal = priceVal.toFixed(2)
    }
    let [int, decimal] = (priceVal || '').split('.')
    if (decimal) {
      if (!showdecimal) {
        decimal = decimal.replace(/0+$/, '')
      }
      if (decimal.length > 2) {
        decimal = decimal.slice(0, 2)
      }
    }
    const formattedInt = int ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
    int = formattedInt
    const minus = _value < 0
    const symbol = this.props.symbol
    const fontWeight = weight == 'blod' ? 600 : weight
    const fontFamily =
      family || (weight == 'blod' || weight >= 600 ? 'D-DIN-PRO' : 'D-DIN-PRO-Regular')
    const showLineThrough = lineThrough || discount

    return (
      <View
        className={classNames(
          'sp-price',
          {
            'line-through': showLineThrough
          },
          primary ? 'sp-price__primary' : null,
          className
        )}
        style={styleNames({
          color: color
        })}
      >
        {minus && <Text>-</Text>}
        {plus && <Text>+</Text>}
        {noSymbol ? null : (
          <Text
            className='sp-price__symbol'
            style={styleNames({
              fontSize: `${unitSize ? unitSize : !sizeSame ? size - 8 : size}rpx`,
              color: color,
              fontWeight: 500,
              fontFamily: 'D-DIN-PRO-Medium'
            })}
          >
            {symbol || '¥'}
          </Text>
        )}
        <Text
          className='sp-price__int'
          style={styleNames({
            fontSize: `${size}rpx`,
            color: color,
            fontWeight: fontWeight,
            fontFamily
          })}
        >
          {int.indexOf('-') === 0 ? int.slice(1) : int}
        </Text>
        {decimal !== undefined && decimal && !noDecimal && (
          <Text
            className='sp-price__decimal'
            style={styleNames({
              fontSize: `${size}rpx`,
              color: color,
              fontWeight: fontWeight,
              fontFamily
            })}
          >
            .{decimal}
          </Text>
        )}
        {appendText && <Text className='sp-price__append'>{appendText}</Text>}
      </View>
    )
  }

  render() {
    if (this.props.variant === 'card') {
      return this.renderCardVariant()
    }
    return this.renderDefaultVariant()
  }
}
