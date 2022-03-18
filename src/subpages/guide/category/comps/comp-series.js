import React, { memo, useState, useEffect } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { SpLoading, SpImage } from '@/components'
import { classNames, styleNames } from '@/utils'

import './comp-series.scss'

const CompSeries = (props) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const { info, pluralType = true, imgType = true, fixTop } = props

  useEffect(() => {
    if (info.length <= 0) return
    setActiveIndex(0)
  }, [info])

  const handleClickItem = (item) => {
    const { category_id, main_category_id } = item
    let url = ''
    if (category_id) {
      url = `/subpages/guide/item/list?cat_id=${category_id}`
    }
    if (main_category_id) {
      url = `/subpages/guide/item/list?main_cat_id=${main_category_id}`
    }
    if (url) {
      Taro.navigateTo({
        url
      })
    }
  }

  const handleCustomClick = (id) => {
    if (id) {
      Taro.navigateTo({
        url: `/subpages/guide/custom/custom-page?id=${id}`
      })
    }
  }

  const renderCategoryHandler = (child) => {
    return (
      <View
        className='category-content__img'
        key={child.category_id}
        onClick={() => handleClickItem(child)}
      >
        <SpImage
          className={classNames(imgType ? 'cat-img' : 'cat-img-no')}
          mode='aspectFill'
          src={child.img}
        />
        <View className='img-cat-name'>{child.name}</View>
      </View>
    )
  }

  if (!info || info.length == 0 || info.length <= activeIndex) {
    return <SpLoading />
  }

  const currentTopImg = info[activeIndex].img || '' //当前分类顶部图片
  const currentChildren = info[activeIndex].children || [] // 子类
  const currentID = info[activeIndex].id || ''
  console.log('comp-series:', fixTop)
  return (
    <View className='comp-series'>
      {/* left */}
      <ScrollView
        className='comp-series__nav'
        style={styleNames({
          top: `${fixTop}px`
        })}
        scrollY
      >
        <View className='comp-series__nav_list'>
          {info.map((item, index) => (
            <View
              className={classNames(
                'comp-series__nav-list__content',
                activeIndex === index && 'comp-series__nav-list__content-active'
              )}
              key={`${item.name}-${index}`}
              onClick={() => setActiveIndex(index)}
            >
              <View
                className={classNames(
                  'comp-series__nav-list__content_text',
                  activeIndex === index && 'comp-series__nav-list__content_text-active'
                )}
              >
                {item.hot && (
                  <View className='imgbox'>
                    <SpImage src='hot.png' width={20} />
                  </View>
                )}
                <Text className='text'>{item.name}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* right */}
      <ScrollView
        className='comp-series__content'
        style={styleNames({
          top: `${fixTop}px`
        })}
        scrollY
      >
        <View className={classNames(pluralType ? 'category-content' : 'category-content-no')}>
          {currentTopImg && (
            <SpImage
              className='category__banner'
              mode='aspectFill'
              src={currentTopImg}
              onClick={() => handleCustomClick(currentID)}
            />
          )}
          <View className='comp-series__content_box'>
            {currentChildren.map((item, index) => {
              return item.children ? (
                <View className='new' key={index}>
                  <View className='group-title'>{item.name}</View>
                  <View className='content-group'>
                    {item.children.map((child) => renderCategoryHandler(child))}
                  </View>
                </View>
              ) : (
                () => renderCategoryHandler(item)
              )
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default memo(CompSeries)
