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
import React, { useMemo, useCallback } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'

import './heading.scss'

function WgtHeading(props) {
  if (!props.info) {
    return null
  }

  const { config, base, data } = props.info || {}

  const computedStyle = useCallback(() => {
    return {
      textAlign: config.align,
      color: config.color,
      fontSize: Taro.pxTransform(config.fontSize * 2),
      fontStyle: config.italic,
      lineHeight: config.lineHeight,
      fontWeight: config.weight
    }
  }, [config])

  return (
    <View
      className={classNames(`wgt wgt-heading`, {
        'wgt__padded': base.padded
      })}
    >
      <View
        className={classNames(`wgt-body`, {
          'padded': config.padded
        })}
        style={computedStyle()}
      >
        {base.title}
      </View>
    </View>
  )
}

WgtHeading.defaultProps = {
  info: null
}

export default WgtHeading
