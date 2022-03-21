import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import './index.scss'

function SpRecommendItem(props) {
  const { info, onClick = () => {} } = props
  if (!info) {
    return null
  }
  const { img, title, authorIcon, author, articlePraiseNum } = info
  return (
    <View className='sp-recommend-item' onClick={onClick}>
      <View className='recommend-item-hd'>
        <SpImage src={img} />
      </View>
      <View className='recommend-item-bd'>
        <View className='title'>{title}</View>
        <View className='author-info'>
          <View className='author-icon'>
            <SpImage src={authorIcon} />
          </View>
          <Text className='author-name'>{author}</Text>
        </View>
      </View>
      <View className='recommend-item-fd'>
        <Text className='iconfont icon-like'></Text>
        <Text className='num'>{articlePraiseNum}</Text>
      </View>
    </View>
  )
}

SpRecommendItem.options = {
  addGlobalClass: true
}

export default SpRecommendItem
