import Taro from '@tarojs/taro'
import React, { useCallback, useState, useMemo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'

const voidFunc = () => {}

const SpButton = (props) => {
  const {
    resetText = '取消',
    confirmText = '确定',
    onConfirm = voidFunc,
    onReset = voidFunc
  } = props

  return (
    <View className='sp-button'>
      <View className='sp-button__reset' onClick={onReset}>
        {resetText}
      </View>
      <View className='sp-button__confirm' onClick={onConfirm}>
        {confirmText}
      </View>
    </View>
  )
}

SpButton.options = {
  addGlobalClass: true
}

export default SpButton
