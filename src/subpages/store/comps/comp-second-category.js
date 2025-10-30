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
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { useImmer } from 'use-immer'

import './comp-second-category.scss'

function compSecondCategory(props) {
  const { onClick = () => {}, list = [], cusIndex = 0 } = props

  return (
    <View className='comp-second-category'>
      <ScrollView className='comp-second-category-scroll' scrollY>
        {list.map((el, elidx) => (
          <View
            className={`comp-second-category-scroll-item ${elidx == cusIndex ? 'active' : ''}`}
            key={elidx}
            onClick={() => onClick(elidx)}
          >
            <View className='comp-second-category-goods-desc'>{el.name}</View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default compSecondCategory
