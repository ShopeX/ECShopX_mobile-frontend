import React, { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Icon } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

function SpSearch(props) {
  const { info, onClick } = props
  const { padded } = info.base
  const { placeholder = '搜索', fixTop = false } = info.config

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      Taro.navigateTo({
        url: `/pages/item/list`
      })
    }
  }

  return (
    // <View className={!isFixTop && 'sp-search-nofix'}>
    <View className={classNames('sp-search', {
      'wgt__padded': padded,
      'fixed-top': fixTop
    })} >
      <View className='sp-search-block' onClick={handleClick}>
        <View className='iconfont icon-sousuo-01'></View>
        <Text className='place-holder'>{placeholder}</Text>
      </View>
    </View>
    // </View>
  )
}

SpSearch.options = {
  addGlobalClass: true
}

export default SpSearch
