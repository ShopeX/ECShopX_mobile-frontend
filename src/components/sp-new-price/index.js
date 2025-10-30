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
import React, { useMemo, memo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames, getNavbarHeight } from '@/utils'
import './index.scss'

const SpNewPrice = (props) => {
  /**
   * prefix 代表前缀
   * digits 默认为2位小数
   * equal 代表整数和小数是否相等 默认不相等
   */

  const {
    price: priceProp = 0,
    prefix = '¥',
    digits = 2,
    equal = false,
    discount = false,
    size = 'normal',
    className = '',
    isPoints = true
  } = props

  const price = useMemo(() => {
    return isPoints ? priceProp / 100 : priceProp
  }, [isPoints, priceProp])

  //过滤后的字符串
  const changePrice = Number(price).toFixed(digits)

  //取整数位
  const int = changePrice.split('.')[0]

  //取小数位
  const decimal = changePrice.split('.')[1]

  return (
    <View
      className={classNames('sp-component-newprice', className, {
        ['discount']: discount,
        ['equal']: equal,
        ['small']: size == 'small'
      })}
    >
      {prefix}
      <Text className='int'>{int}.</Text>
      {decimal}
    </View>
  )
}

export default memo(SpNewPrice)
