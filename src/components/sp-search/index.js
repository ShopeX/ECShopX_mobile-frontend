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
import React, { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Icon } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

function SpSearch(props) {
  const { info, onClick } = props
  const { padded } = info?.base || {}
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
    <View
      className={classNames('sp-search', {
        'wgt__padded': padded,
        'fixed-top': fixTop
      })}
    >
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
