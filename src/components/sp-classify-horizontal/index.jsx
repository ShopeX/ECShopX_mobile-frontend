import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import classNames from 'classnames'
import { SpImage } from '@/components'
import './index.scss'

function SpClassifyHorizontal(props) {
  const { data = [], onClick = () => {} } = props
  const [curBrandIndex, setCurBrandIndex] = useState(0)
  const [viewScrollItem, setViewScrollItem] = useState('')

  const handleClick = (item, index) => {
    const viewIndex = Math.min(index - 1, data.length - 2)
    setCurBrandIndex(index)
    onClick(item, index)
    setViewScrollItem(`sp-classify-horizontal-item-image-${viewIndex}`)
  }
  return (
    <ScrollView
      className='sp-classify-horizontal'
      scrollX
      scrollIntoView={viewScrollItem}
      scrollWithAnimation
    >
      <View className='sp-classify-horizontal-list'>
        {data?.map((item, index) => (
          <View
            key={index}
            className={classNames('sp-classify-horizontal-item', {
              'active': curBrandIndex === index
            })}
            onClick={() => {
              handleClick(item, index)
            }}
          >
            <View
              className='sp-classify-horizontal-item-image'
              id={`sp-classify-horizontal-item-image-${index}`}
            >
              {item.image && <SpImage src={item.image} mode='aspectFill' width={92} height={92} />}
            </View>
            <View className='sp-classify-horizontal-item-name'>{item.name}</View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default SpClassifyHorizontal
