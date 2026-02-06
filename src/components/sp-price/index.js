import React, { Component } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, isNumber, isString, styleNames } from '@/utils'

import './index.scss'
/**
 * SpPrice 价格组件
 *
 * 用于显示价格的组件，支持多种格式和样式。
 *
 * @props {string|number} value - 价格值，可以是字符串或数字
 * @props {boolean} primary - 是否使用主色调显示，默认为false
 * @props {boolean} noSymbol - 是否不显示货币符号，默认为false
 * @props {boolean} noDecimal - 是否不显示小数部分，默认为false
 * @props {string} unit - 价格单位，可选值为'default'或'cent'，默认为'default'。当为'cent'时，显示的价格会除以100
 * @props {string} appendText - 附加文本，显示在价格后面
 * @props {boolean} plus - 是否显示加号，默认为false
 * @props {number} size - 字体大小，默认为34
 * @props {number} weight - 字体粗细，默认为500
 * @props {string} className - 自定义类名
 * @props {boolean} lineThrough - 是否添加删除线，用于显示原价
 * @props {string} symbol - 自定义货币符号
 *
 * @example
 * // 基本用法
 * <SpPrice value={99.99} />
 *
 * // 以分为单位显示
 * <SpPrice value={9999} unit="cent" />
 *
 * // 不显示小数
 * <SpPrice value={99.99} noDecimal />
 *
 * // 不显示货币符号
 * <SpPrice value={99.99} noSymbol />
 *
 * // 添加附加文本
 * <SpPrice value={99.99} appendText="/月" />
 *
 * // 显示为原价（添加删除线）
 * <SpPrice value={99.99} lineThrough />
 *
 * // 自定义样式
 * <SpPrice value={99.99} size={40} weight={600} primary />
 */

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
    size: 34,
    weight: 500,
    color: null,
    sizeSame: false,
    unitSize: null
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
      size,
      color,
      sizeSame,
      weight,
      unitSize,
      family = '',
      showdecimal = false
    } = this.props
    let _value = value
    if (isString(value)) {
      _value = parseFloat(value)
    }

    let priceVal = unit === 'cent' ? +_value / 100 : _value
    if (isNumber(priceVal)) {
      priceVal = priceVal.toFixed(2)
    }
    let [int, decimal] = (priceVal || '').split('.')
    // 处理小数点部分,只保留2位有效小数
    if (decimal) {
      if (!showdecimal) {
        decimal = decimal.replace(/0+$/, '') // 去掉末尾的0
      }
      if (decimal.length > 2) {
        decimal = decimal.slice(0, 2)
      }
    }
    // 处理千分位显示，在整数部分每三位数字添加逗号
    const formattedInt = int ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
    int = formattedInt
    const minus = _value < 0
    const symbol = this.props.symbol
    const fontWeight = weight == 'blod' ? 600 : weight
    const fontFamily =
      family || (weight == 'blod' || weight >= 600 ? 'D-DIN-PRO' : 'D-DIN-PRO-Regular')
    return (
      <View
        className={classNames(
          'sp-price',
          {
            'line-through': lineThrough
          },
          primary ? 'sp-price__primary' : null,
          className
        )}
        style={styleNames({
          'color': color
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
              'fontWeight': 500,
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
            'fontWeight': fontWeight,
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
              'fontWeight': fontWeight,
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
}
