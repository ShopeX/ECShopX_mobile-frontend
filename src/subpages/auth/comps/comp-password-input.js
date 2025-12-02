/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'
import { SpInput as AtInput } from '@/components'
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
        placeholder='密码需由6-16位数字或字母组成'
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
