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
import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'
import { SpInput as AtInput } from '@/components'
import { PASSWORD_TIP } from '../const'
import './comp-password-input.scss'

const initialValue = {
  //一种是正常的 text 一种是 password
  type: 'password'
}

const CompPasswordInput = (props) => {
  const { onChange = () => {}, disabled, onFocus = () => {}, onBlur = () => {}, value } = props

  const [state, setState] = useImmer(initialValue)

  const { type } = state

  const handleToggle = () => {
    setState((_state) => {
      _state.type = type === 'text' ? 'password' : 'text'
    })
  }

  return (
    <View className='comp-password-input'>
      <AtInput
        clear
        type={type}
        placeholder={PASSWORD_TIP}
        placeholderClass='input-placeholder'
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        disabled={disabled}
      />
      <View className='input-icon' onClick={handleToggle}>
        <Text
          className={classNames('icon iconfont', [
            type === 'text' ? 'icon-xianshi' : 'icon-yincang'
          ])}
        ></Text>
      </View>
    </View>
  )
}

CompPasswordInput.options = {
  addGlobalClass: true
}

export default CompPasswordInput
