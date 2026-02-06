/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo, useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { pickBy, classNames, styleNames } from '@/utils'
import doc from '@/doc'
import { SpClassifyHorizontal, SpClassifyVertical } from '@/components'
import { getGlobalBaseStyle } from '../helper'
import './index.scss'

function WgtClassify(props) {
  const { info, id } = props

  // 从 params 中获取配置和数据，兼容两种数据结构
  const params = info?.params || info || {}
  const base = params.base || {}
  const data = params.data || {}

  const [list, setList] = useState([])
  const { dataType, animate } = base

  useEffect(() => {
    if (data?.type == 'select') {
      setList(pickBy(data?.category, doc.wgt.STORECLASSIFY_SELECT))
    } else {
      const _data = pickBy(data?.data, doc.wgt.STORECLASSIFY)
      setList({ children: _data })
    }
  }, [data])

  const handleSubCategoryClick = (item) => {
    const store_ids = item?.store_ids?.join(',') || ''
    const category_id = item?.id
    if (dataType === 'manage') {
      //管理分类
      Taro.navigateTo({
        url: `/subpages/item/list?main_cat_id=${category_id}&store_ids=${store_ids}&hide_search=1`
      })
    } else {
      //销售分类
      Taro.navigateTo({
        url: `/subpages/item/list?category_id=${category_id}&store_ids=${store_ids}&hide_search=1`
      })
    }
  }

  // 获取外层样式（包含 outerMargin 和背景配置）
  const outerStyle = useMemo(() => {
    console.log(base.outerMargin, 'base.outerMargin')
    return getGlobalBaseStyle(base.outerMargin || {})
  }, [base.outerMargin])

  // 获取内层样式（包含 innerPadding）
  const innerStyle = useMemo(() => {
    return getGlobalBaseStyle(base.innerPadding || {})
  }, [base.innerPadding])

  const renderHorizontal = useMemo(() => {
    return (
      <View className='wgt-classify__content-horizontal-item' style={styleNames(innerStyle)}>
        <SpClassifyHorizontal data={list?.children || []} onClick={handleSubCategoryClick} />
      </View>
    )
  }, [innerStyle, list, handleSubCategoryClick])

  const renderVertical = useMemo(() => {
    return (
      <View className='wgt-classify__content-vertical-item' style={styleNames(innerStyle)}>
        <SpClassifyVertical data={list} onClick={handleSubCategoryClick} />
      </View>
    )
  }, [innerStyle, list, handleSubCategoryClick])

  if (!info) {
    return null
  }

  return (
    <View
      className={classNames('wgt wgt-classify', {
        'wgt__padded': base.padded
      })}
      style={styleNames(outerStyle)}
      id={`wgt-classify-${id || ''}`}
    >
      <View className='wgt-classify__content'>
        {animate === 'horizontal' && renderHorizontal}
        {animate === 'vertical' && renderVertical}
      </View>
    </View>
  )
}

export default React.memo(WgtClassify)
