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
import { View, ScrollView, Text } from '@tarojs/components'
import { SpSelect } from '@/components'
import { useImmer } from 'use-immer'

import './comp-third-category.scss'

const initialState = {
  isShowFloat: false,
  scrollIntoView: 'category-0',
  selectValue: null
}

function CompThirdCategory(props) {
  const { onClick = () => {}, list = [], cusIndex = 0 } = props
  const [state, setState] = useImmer(initialState)
  const { isShowFloat, scrollIntoView, selectValue } = state

  useEffect(() => {
    setState((draft) => {
      draft.isShowFloat = false
      draft.selectValue = list[cusIndex].id
    })
  }, [cusIndex])

  const onSelectClick = (id) => {
    const scrollIntoViewId = list[id]?.id

    setState((draft) => {
      draft.isShowFloat = false
      draft.scrollIntoView = `category-${scrollIntoViewId}`
    })
    onClick(id)
  }
  const onShowClick = () => {
    setState((draft) => {
      draft.isShowFloat = !isShowFloat
    })
  }

  const onChangeBrand = ([id]) => {
    const index = list.findIndex((item) => item.id == id)

    setState((draft) => {
      draft.isShowFloat = false
      draft.scrollIntoView = `category-${id}`
    })
    onClick(index)
  }

  return (
    <View className='comp-third-category'>
      <ScrollView className='comp-third-category-scroll' scrollX scrollIntoView={scrollIntoView}>
        {list.map((el, index) => (
          <View
            className={`comp-third-category-scroll-item ${index == cusIndex ? 'active' : ''}`}
            key={el.id}
            onClick={() => onSelectClick(index)}
            id={`category-${el.id}`}
          >
            <View className='comp-third-category-goods-desc'>{el.name}</View>
          </View>
        ))}
      </ScrollView>
      <View className='comp-third-category-filter'>
        {list.length > 0 && (
          <View
            className={`iconfont icon-arrowDown ${isShowFloat && 'rotate'}`}
            onClick={onShowClick}
          ></View>
        )}
      </View>
      <View
        className={`comp-third-category-float ${isShowFloat ? 'isshow' : ''}`}
        onClick={onShowClick}
      >
        <View className='sp-select-box'>
          <SpSelect info={list} value={[selectValue]} onChange={onChangeBrand} />
        </View>
      </View>
    </View>
  )
}

export default CompThirdCategory
