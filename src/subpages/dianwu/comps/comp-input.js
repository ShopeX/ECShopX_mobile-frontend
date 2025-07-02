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
