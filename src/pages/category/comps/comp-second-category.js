import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { useImmer } from 'use-immer'

import './comp-second-category.scss'

function compSecondCategory (props) {
  const { onClick = () => {}, list = [], cusIndex = 0 } = props

  return (
    <View className='comp-second-category'>
      <ScrollView className='comp-second-category-scroll' scrollY>
        {list.map((el, elidx) => (
          <View className={`comp-second-category-scroll-item ${elidx == cusIndex ? 'active' : ''}`} key={elidx} onClick={() => onClick(elidx)}>
            <View className='comp-second-category-goods-desc'>{el.name}</View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default compSecondCategory