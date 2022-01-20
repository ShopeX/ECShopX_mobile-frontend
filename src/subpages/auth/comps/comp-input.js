import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'
import './comp-input.scss'

const initialValue = {
  //一种是正常的 text 一种是 password
  type: 'password'
}

const CompInput = (props) => {
  const {
    name,
    type,
    placeholder,
    onChange = () => {},
    onFocus = () => {},
    onBlur = () => {},
    ...restProps
  } = props

  const [state, setState] = useImmer(initialValue)

  return (
    <View className='comp-input'>
      <AtInput
        clear
        type={type}
        name={name}
        placeholder={placeholder}
        placeholderClass='input-placeholder'
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        {...restProps}
      />
    </View>
  )
}

CompInput.options = {
  addGlobalClass: true
}

export default CompInput
