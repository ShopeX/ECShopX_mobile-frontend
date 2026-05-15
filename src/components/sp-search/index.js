/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './index.scss'

function SpSearch(props) {
  const { i18n } = useTranslation()
  const { info, onClick } = props
  const { padded } = info?.base || {}
  const fixTop = info?.config?.fixTop ?? false
  const placeholderRaw = info?.config?.placeholder
  const placeholder = useMemo(
    () =>
      placeholderRaw !== undefined && placeholderRaw !== null && placeholderRaw !== ''
        ? placeholderRaw
        : $t('78eb15d3.e5f71f'),
    [placeholderRaw, i18n.language]
  )

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      Taro.navigateTo({
        url: `/subpages/item/list`
      })
    }
  }

  return (
    // <View className={!isFixTop && 'sp-search-nofix'}>
    <View
      className={classNames('sp-search', {
        'wgt__padded': padded,
        'fixed-top': fixTop
      })}
    >
      <View className='sp-search-block' onClick={handleClick}>
        <View className='iconfont icon-sousuo-01'></View>
        <Text className='place-holder'>{placeholder}</Text>
      </View>
    </View>
    // </View>
  )
}

SpSearch.options = {
  addGlobalClass: true
}

export default SpSearch
