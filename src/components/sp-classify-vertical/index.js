import React from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import './index.scss'

function CompCategoryItem(props) {
  const { data = null, onClick = () => {} } = props
  console.log(data, 'data-22---')

  const handleClick = (item, index) => {
    onClick(item, index)
  }

  const handleTitleClick = (item, index) => {
    onClick(item, index)
  }

  if (!data) return null
  return (
    <View className='sp-classify-vertical'>
      {data?.title && (
        <View
          className='sp-classify-vertical__header'
          onClick={() => handleTitleClick(data, 1, data?.title)}
        >
          <Text className='sp-classify-vertical__title'>{data?.title}</Text>
          <View className='sp-classify-vertical__arrow'></View>
        </View>
      )}

      <View className='sp-classify-vertical__items'>
        {data?.children?.map((ele, index) => (
          <View
            key={index}
            className='sp-classify-vertical__item'
            onClick={() => handleClick(ele, index)}
          >
            <View className='sp-classify-vertical__image'>
              {ele.image && <SpImage src={ele.image} mode='aspectFill' />}
            </View>
            <Text className='sp-classify-vertical__name'>{ele.name}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default React.memo(CompCategoryItem)
