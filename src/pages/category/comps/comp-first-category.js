/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { View, ScrollView, Image, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpImage } from '@/components'

import './comp-first-category.scss'

const initialState = {
  isShowFloat: false,
  scrollIntoView: 'category-0'
}

function CompFirstCategory(props) {
  const [state, setState] = useImmer(initialState)
  const { isShowFloat, scrollIntoView } = state
  const { onClick = () => {}, list = [], cusIndex = 0 } = props

  const onSelectClick = (index) => {
    setState((draft) => {
      draft.isShowFloat = false
      draft.scrollIntoView = `category-${index}`
    })
    onClick(index)
  }

  const onShowClick = (e) => {
    e.stopPropagation()
    setState((draft) => {
      draft.isShowFloat = !isShowFloat
    })
  }

  const renderCategoryItem = () => {
    return list.map((item, index) => (
      <View
        className={`category-item ${index == cusIndex ? 'active' : ''}`}
        key={index}
        onClick={() => onSelectClick(index)}
        id={`category-${index}`}
      >
        <View className='category-image'>
          <SpImage src={item.img} width={100} height={100} circle={100} lazyLoad />
        </View>
        <View className='category-name'>{item.name}</View>
      </View>
    ))
  }

  return (
    <View className='comp-first-category'>
      <ScrollView className='comp-first-category-scrollX' scrollX scrollIntoView={scrollIntoView}>
        <View className='comp-first-category-content'>{renderCategoryItem()}</View>
      </ScrollView>
      <View onClick={onShowClick} className='comp-first-category-filter'>
        <Text>全部</Text>
        <Text className='at-icon at-icon-list'></Text>
      </View>
      <View
        className={`comp-first-category-float ${isShowFloat ? 'isshow' : ''}`}
        onClick={onShowClick}
      >
        <View className='sp-select-box'>
          <ScrollView className='category-full' scrollY>
            <View className='category-full-container'>{renderCategoryItem()}</View>
          </ScrollView>
        </View>
      </View>
    </View>
  )
}

export default CompFirstCategory
