/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

function SpTagBar(props) {
  const { list, value, children, className = '', onChange = () => {} } = props
  const [currentIndex, setCurrentIndex] = useState(0)

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
        <ScrollView
          className='tag-container'
          scrollX
          enhanced
          show-scrollbar={false}
          scrollIntoView={`tag-item__${Math.max(currentIndex - 1, 0)}`}
        >
          {list.map((item, index) => (
            <View
              className={classNames('tag-item', {
                active: isChecked(item)
              })}
              onClick={() => {
                setCurrentIndex(index)
                onChange(index, item)
              }}
              key={`tag-item__${index}`}
              id={`tag-item__${index}`}
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
