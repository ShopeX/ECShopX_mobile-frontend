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
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { SpInput as AtInput } from '@/components'
import './comp-input.scss'

function CompInput(props) {
  const {
    placeholder = '',
    name = '',
    value = '',
    prefix = '',
    suffix = '',
    disabled = false,
    onChange = () => {},
    onConfirm = () => {}
  } = props

  return (
    <View className='comp-input'>
      <Text className='append-prefix'>{prefix}</Text>
      <AtInput
        // type='number'
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => {
          onChange(e)
        }}
        onConfirm={(e) => {
          onConfirm(e)
        }}
      />
      <Text className='append-suffix'>{suffix}</Text>
    </View>
  )
}

CompInput.options = {
  addGlobalClass: true
}

export default CompInput
