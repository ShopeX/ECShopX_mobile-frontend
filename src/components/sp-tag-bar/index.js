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
import { View, ScrollView } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

function SpTagBar(props) {
  const { list, value, children, className = '', onChange = () => {} } = props

  const isChecked = (item) => {
    return (
      value == item.tag_id ||
      value == item.value ||
      value == item.plusValue ||
      value == item.minusValue
    )
  }

  return (
    <View className={classNames('sp-tag-bar', className)}>
      <View className='tag-bar-hd'>
        <ScrollView className='tag-container' scrollX enhanced show-scrollbar={false}>
          {list.map((item, index) => (
            <View
              className={classNames('tag-item', {
                active: isChecked(item)
              })}
              onClick={() => {
                onChange(index, item)
              }}
              key={`tag-item__${index}`}
            >
              {item.tag_name}
              {item.num ? `(${item.num})` : ''}
            </View>
          ))}
        </ScrollView>
      </View>
      <View className='tag-bar-ft'>{children}</View>
    </View>
  )
}

SpTagBar.options = {
  addGlobalClass: true
}

export default SpTagBar
