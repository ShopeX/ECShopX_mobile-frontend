import React, { memo, useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { SpLoading, SpImage } from '@/components'
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'

import './comp-series.scss'

const initialState = {
  currentTopImg: [], //当前分类顶部图片
  currentChildren: [], // 子类
  currentID: []
}

const CompSeries = (props) => {
  const [state, setState] = useImmer(initialState)
  const [activeIndex, setActiveIndex] = useState(0)

  const { info, pluralType = true, imgType = true } = props

  const colors = useSelector((state) => state.colors.current)

  useEffect(() => {
    if (info.length <= 0) return
    setActiveIndex(0)
  }, [info])

  // useEffect(() => {
  //   if (info.length <= 0) return

  //   const currentTopImg = info[activeIndex].img
  //   const currentChildren = info[activeIndex].children
  //   const currentID = info[activeIndex].id || ''

  //   setState((v) => {
  //     ;(v.currentTopImg = currentTopImg),
  //       (v.currentChildren = currentChildren),
  //       (v.currentID = currentID)
  //   })
  // }, [activeIndex])

  const handleClickItem = (item) => {
    const { category_id, main_category_id } = item
    let url = ''
    if (category_id) {
      url = `/pages/item/list?cat_id=${category_id || ''}`
    }
    if (main_category_id) {
      url = `/pages/item/list?main_cat_id=${main_category_id || ''}`
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
        url: `/pages/custom/custom-page?id=${id}`
      })
    }
  }

  // const { currentTopImg, currentChildren, currentID } = state

  if (!info || info.length == 0 || info.length <= activeIndex) {
    return <SpLoading />
  }

  const currentTopImg = info[activeIndex].img || ''
  const currentChildren = info[activeIndex].children || []
  const currentID = info[activeIndex].id || ''
  return (
    <View className='CompSeries'>
      {/* left */}
      <ScrollView className='CompSeries__nav' scrollY>
        <View className='CompSeries__nav_list'>
          {info.map((item, index) => (
            <View
              className={classNames(
                'CompSeries__nav-list__content',
                activeIndex === index && 'CompSeries__nav-list__content-active'
              )}
              style={activeIndex == index && `border-left: 4px solid ${colors.data[0].primary};`}
              key={`${item.name}-${index}`}
              onClick={() => setActiveIndex(index)}
            >
              {item.hot && <Text className='hot-tag' key={`${item.name}-${index}`}></Text>}
              {item.name}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* right */}
      <ScrollView className='CompSeries__content' scrollY>
        <View className={classNames(pluralType ? 'category-content' : 'category-content-no')}>
          {currentTopImg && (
            // <Image
            //   src={currentTopImg}
            //   mode='aspectFill'
            //   className='category__banner'
            //   onClick={() => handleCustomClick(currentID)}
            // />
            <SpImage
              className='category__banner'
              mode='aspectFill'
              src={currentTopImg}
              onClick={() => handleCustomClick(currentID)}
            />
          )}
          {currentChildren.map((item, index) =>
            item.children ? (
              <View className='new' key={index}>
                <View className='group-title'>{item.name}</View>
                <View className='content-group'>
                  {item.children.map((child) => (
                    <View
                      className='category-content__img'
                      key={child.category_id}
                      onClick={() => handleClickItem(child)}
                    >
                      {child.img && (
                        // <Image
                        //   className={classNames(imgType ? 'cat-img' : 'cat-img-no')}
                        //   mode='aspectFit'
                        //   src={child.img}
                        // />
                        <SpImage
                          className={classNames(imgType ? 'cat-img' : 'cat-img-no')}
                          mode='aspectFit'
                          src={child.img}
                        />
                      )}
                      <View className='img-cat-name'>{child.name}</View>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View
                className='category-content__img'
                key={item.category_id}
                onClick={() => handleClickItem(item)}
              >
                {item.img && (
                  <Image
                    className={classNames(imgType ? 'cat-img' : 'cat-img-no')}
                    mode='aspectFit'
                    src={item.img}
                  />
                )}
                <View className='img-cat-name'>{item.name}</View>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default memo(CompSeries)
