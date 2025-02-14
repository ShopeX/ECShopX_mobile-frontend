import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'

import './comp-second-category.scss'

function compSecondCategory(props) {
  const { onClick = () => { }, list = [], cusIndex = 0 } = props

  return (
    <View className='comp-second-category'>
      <ScrollView className='comp-second-category-scroll' scrollY>
        {list.map((item, index) => (
          <View className={`category-item ${index == cusIndex ? 'active' : ''}`} key={index} onClick={() => onClick(index)}>
            <View className='category-name'>{item.name}</View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default compSecondCategory
