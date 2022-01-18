import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'
import { classNames } from '@/utils'
import './index.scss'

function SpFloatLayout (props) {
  const {
    title = '标题',
    children,
    className,
    renderFooter,
    open = false,
    onClose = () => {}
  } = props

  return (
    <View
      className={classNames('sp-float-layout', className, {
        active: open
      })}
    >
      <View className='sp-float-layout__overlay'></View>
      <View className='sp-float-layout__body'>
        <View className='sp-float-layout-hd'>
          <Text className='layout-title'>{title}</Text>
          <Text className='iconfont icon-guanbi' onClick={onClose}></Text>
        </View>
        <ScrollView className='sp-float-layout-bd' scrollY>
          {children}
        </ScrollView>
        <View className='sp-float-layout-ft'>{renderFooter}</View>
      </View>
    </View>
  )
}

SpFloatLayout.options = {
  addGlobalClass: true
}

export default SpFloatLayout
