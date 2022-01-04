import React, { useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

function SpTagBar (props) {
  const { list, value, children, onChange = () => {} } = props

  const isChecked = (item) => {
    return (
      value == item.tag_id ||
      value == item.value ||
      value == item.plusValue ||
      value == item.minusValue
    )
  }

  return (
    <View className='sp-tag-bar'>
      <View className='tag-bar-hd'>
        <ScrollView className='tag-container' scrollX>
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
