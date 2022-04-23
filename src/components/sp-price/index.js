import React, { Component } from 'react'
import { Text } from '@tarojs/components'
import { classNames, isNumber, styleNames } from '@/utils'

import './index.scss'

export default class SpPrice extends Component {
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
    plus: false,
    size: 32
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
      plus,
      size
    } = this.props
    let priceVal = unit === 'cent' ? +value / 100 : value
    if (isNumber(priceVal)) {
      priceVal = priceVal.toFixed(2)
    }
    const [int, decimal] = (priceVal || '').split('.')
    const minus = value < 0
    const symbol = this.props.symbol

    return (
      <Text
        className={classNames(
          'sp-price',
          {
            'line-through': lineThrough
          },
          primary ? 'sp-price__primary' : null,
          className
        )}
      >
        {minus && <Text>-</Text>}
        {plus && <Text>+</Text>}
        {noSymbol ? null : (
          <Text
            className='sp-price__symbol'
            style={styleNames({
              fontSize: `${size - 8}rpx`
            })}
          >
            {symbol || '¥'}
          </Text>
        )}
        <Text
          className='sp-price__int'
          style={styleNames({
            fontSize: `${size}rpx`
          })}
        >
          {int.indexOf('-') === 0 ? int.slice(1) : int}
        </Text>
        {decimal !== undefined && !noDecimal && (
          <Text
            className='sp-price__decimal'
            style={styleNames({
              fontSize: `${size - 4}rpx`
            })}
          >
            .{decimal}
          </Text>
        )}
        {appendText && <Text className='sp-price__append'>{appendText}</Text>}
      </Text>
    )
  }
}
