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
import { View, ScrollView, Image, Text } from '@tarojs/components'
import { useImmer } from 'use-immer'

import './comp-first-category.scss'

const initialState = {
  isShowFloat: false,
  scrollIntoView: 'category-0'
}

function CompFirstCategory(props) {
  const [state, setState] = useImmer(initialState)
  const { isShowFloat, scrollIntoView } = state
  const { onClick = () => {}, list = [], cusIndex = 0 } = props

  const onSelectClick = (index) => {
    setState((draft) => {
      draft.isShowFloat = false
      draft.scrollIntoView = `category-${index}`
    })
    onClick(index)
  }

  const onShowClick = (e) => {
    e.stopPropagation()
    setState((draft) => {
      draft.isShowFloat = !isShowFloat
    })
  }

  const CompItem = () => {
    return list.map((el, elidx) => (
      <View
        className={`comp-first-category-scroll-item ${elidx == cusIndex ? 'active' : ''}`}
        key={elidx}
        onClick={() => onSelectClick(elidx)}
        id={`category-${elidx}`}
      >
        <View className='comp-first-category-goods-imgbox'>
          {el.img ? (
            <Image src={el.img} width={100} height={100} className='goods-img' lazyLoad />
          ) : (
            <Text> {el.name}</Text>
          )}
        </View>
        <View className='comp-first-category-goods-desc'>{el.name}</View>
      </View>
    ))
  }

  return (
    <View className='comp-first-category'>
      <ScrollView className='comp-first-category-scrollX' scrollX scrollIntoView={scrollIntoView}>
        <View className='comp-first-category-content'>{CompItem()}</View>
      </ScrollView>
      <View onClick={onShowClick} className='comp-first-category-filter'>
        <Text>全部</Text>
        <Text className='at-icon at-icon-list'></Text>
      </View>
      <View
        className={`comp-first-category-float ${isShowFloat ? 'isshow' : ''}`}
        onClick={onShowClick}
      >
        <View className='sp-select-box'>
          <ScrollView className='comp-first-category-scrollY' scrollY>
            {CompItem()}
          </ScrollView>
          {/* <Text onClick={onShowClick} className={`iconfont icon-close`} /> */}
        </View>
      </View>
    </View>
  )
}

export default CompFirstCategory
