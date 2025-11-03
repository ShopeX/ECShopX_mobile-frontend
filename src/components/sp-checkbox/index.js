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
import React, { Component, useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { classNames, getThemeStyle, styleNames } from '@/utils'
import './index.scss'

function SpCheckboxNew(props) {
  const {
    className,
    children,
    checked = false,
    label,
    onChange = () => {},
    disabled = false
  } = props

  const [isChecked, setChecked] = useState(checked)

  const onChangeCheckbox = (e) => {
    e.stopPropagation()
    if (disabled) return
    setChecked(!isChecked)
    onChange && onChange(!isChecked)
  }

  useEffect(() => {
    setChecked(props.checked)
  }, [])

  return (
    <View
      className={classNames(
        {
          'sp-checkbox-new': true
        },
        className
      )}
      onClick={onChangeCheckbox}
    >
      <Text
        className={classNames(
          {
            iconfont: true
          },
          disabled ? 'icon-circle1' : isChecked ? 'icon-roundcheckfill' : 'icon-round',
          disabled && isChecked && 'icon-roundcheckfill'
        )}
      ></Text>
      <View className='sp-checkbox-new__label'>{label || children}</View>
    </View>
  )
}

export default SpCheckboxNew
