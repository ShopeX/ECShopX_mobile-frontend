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
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

export default class SpCell extends Component {
  static defaultProps = {
    isLink: false,
    value: null,
    border: false,
    title: '',
    arrow: 'right',
    onClick: () => {},
    commonStyle: '',
    certainly: false
  }

  static options = {
    addGlobalClass: true
  }

  render() {
    const {
      isLink,
      value,
      icon,
      img,
      iconPrefix,
      title,
      onClick,
      arrow,
      border,
      className,
      commonStyle,
      certainly
    } = this.props

    let linkClassName = `iconfont icon-arrowRight`

    // if (Taro.getEnv() == Taro.ENV_TYPE.ALIPAY) {
    //   linkClassName = 'icon-arrowRight'
    // }

    return (
      <View
        className={classNames('sp-cell', className, {
          'sp-cell__is-link': isLink,
          'sp-cell__no-border': !border,
          'commonStyle': commonStyle
        })}
        onClick={onClick}
      >
        {img && <Image className='sp-cell__icon' src={img} mode='aspectFit' />}
        {icon && (
          <View
            className={`sp-cell__icon ${
              iconPrefix ? iconPrefix + ' ' + iconPrefix + '-' + icon : 'at-icon at-icon-' + icon
            }`}
          ></View>
        )}
        <View className='sp-cell__hd'>
          {certainly && <Text className='sp-cell__xin'>* </Text>}
          {title && <Text className='sp-cell__title'>{title}</Text>}
        </View>
        <View className='sp-cell__bd'>{this.props.children}</View>
        <View className='sp-cell__ft'>
          {value && <View className='sp-cell__value'>{value}</View>}
        </View>
        <View className='sp-cell__link'>{isLink && <View className={linkClassName}></View>}</View>
      </View>
    )
  }
}
