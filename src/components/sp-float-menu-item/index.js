import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

function SpFloatMenuItem (props) {
  const { children, onClick = () => {}, className } = props
  return (
    <View className={classNames('sp-float-menu-item', className)} onClick={onClick}>
      {children}
    </View>
  )
}

SpFloatMenuItem.options = {
  addGlobalClass: true
}

export default SpFloatMenuItem
