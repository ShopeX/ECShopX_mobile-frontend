import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

function SpFloatMenus (props) {
  const { children, className } = props
  return <View className={classNames('sp-float-menus', className)}>{children}</View>
}

SpFloatMenus.options = {
  addGlobalClass: true
}

export default SpFloatMenus
