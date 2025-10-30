// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
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
      {/* <View className='recommend-item-fd'>
        <Text className='iconfont icon-like'></Text>
        <Text className='num'>{articlePraiseNum}</Text>
      </View> */}
    </View>
  )
}

SpRecommendItem.options = {
  addGlobalClass: true
}

export default SpRecommendItem
