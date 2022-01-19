import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { isWxWeb } from '@/utils'
import api from '@/api'
import './comp-password-input.scss'

const CompPasswordInput = () => {
  return <View className='comp-password-input'></View>
}

CompPasswordInput.options = {
  addGlobalClass: true
}

export default CompPasswordInput
