import React, { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'

import './comp-panel.scss'

function CompsPanel (props) {
  const { title, extra, icon = 'icon-qianwang-01', children, className } = props
  return (
    <View
      className={classNames(
        {
          'comp-panel': true
        },
        className
      )}
    >
      <View className='comp-panel-hd'>
        <View className='panel-title'>{title}</View>
        {extra && (
          <View className='panel-extra'>
            <Text className='extra'>{extra}</Text>
            <Text
              className={classNames(
                {
                  iconfont: true
                },
                icon
              )}
            ></Text>
          </View>
        )}
      </View>
      <View className='comp-panel-bd'>{children}</View>
    </View>
  )
}

CompsPanel.options = {
  addGlobalClass: true
}

export default CompsPanel
