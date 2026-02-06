import React, { useMemo, useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { pickBy } from '@/utils'
import doc from '@/doc'
import { SpClassifyHorizontal, SpClassifyVertical } from '@/components'
import './classify.scss'

function WgtClassify(props) {
  const { info, id } = props
  const { base, data, pagetype } = info
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
  const outStyle = useMemo(() => {
    const { outerMargin, outerBackground } = base
    return {
      paddingTop: Taro.pxTransform(outerMargin.paddedt),
      paddingBottom: Taro.pxTransform(outerMargin.paddedb),
      backgroundColor: outerBackground.color,
      backgroundImage: outerBackground.image ? `url(${outerBackground.image})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  }, [base])

  const innerStyle = useMemo(() => {
    const { innerPadding, innerBackground } = base
    return {
      paddingLeft: Taro.pxTransform(innerPadding.paddedl),
      paddingRight: Taro.pxTransform(innerPadding.paddedr),
      paddingTop: Taro.pxTransform(innerPadding.paddedt),
      paddingBottom: Taro.pxTransform(innerPadding.paddedb),
      backgroundColor: innerBackground?.type == 'solid' ? innerBackground.color : 'none',
      backgroundImage:
        innerBackground?.type == 'gradient'
          ? `linear-gradient(${innerBackground.startColor}, ${innerBackground.endColor})`
          : 'none'
    }
  }, [base])

  const renderHorizontal = useMemo(() => {
    return (
      <View className='wgt-classify__content-horizontal-item' style={innerStyle}>
        <SpClassifyHorizontal data={list?.children || []} onClick={handleSubCategoryClick} />
      </View>
    )
  }, [innerStyle, list])

  const renderVertical = useMemo(() => {
    return (
      <View className='wgt-classify__content-vertical-item' style={innerStyle}>
        <SpClassifyVertical data={list} onClick={handleSubCategoryClick} />
      </View>
    )
  }, [innerStyle, list])

  return (
    <View className='wgt-classify' id={`wgt-classify-${id}`}>
      <View className='wgt-classify__content' style={outStyle}>
        {animate === 'horizontal' && renderHorizontal}
        {animate === 'vertical' && renderVertical}
      </View>
    </View>
  )
}

export default React.memo(WgtClassify)
