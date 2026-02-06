/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo, useCallback } from 'react'
import { View } from '@tarojs/components'
import { SpBrandIndexes } from '@/components'
import { getGlobalBaseStyle } from '../helper'
import './index.scss'

function WgtStoreAlphabet(props) {
  const { info, id } = props
  const { base = {}, data = [] } = info || {}
  const { dataType } = base || {}

  // 获取外层样式（包含 outerMargin）
  const outStyle = useCallback(() => {
    return getGlobalBaseStyle(base?.outerMargin || {})
  }, [base])

  // 获取内层样式（包含 innerPadding）
  const innerStyle = useMemo(() => {
    return getGlobalBaseStyle(base?.innerPadding || {})
  }, [base])

  return (
    <View className='wgt-store-alphabet' style={outStyle()} id={`wgt-store-alphabet-${id}`}>
      <View className='wgt-store-alphabet__content-inner' style={innerStyle}>
        <SpBrandIndexes data={dataType == 'all' ? [] : data} dataType={dataType} base={base} />
      </View>
    </View>
  )
}

export default React.memo(WgtStoreAlphabet)
