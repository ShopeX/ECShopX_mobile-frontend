/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpPage, SpTabbar } from '@/components'
import CategoryFlatLayout from './components/category-flat-layout'
import './index.scss'

const initialState = {
  containerHeight: '' // 由 SpPage onReady 回填，用于容器高度
}

function StoreItemList(props) {
  const [state, setState] = useImmer(initialState)
  const pageRef = useRef(null)
  const $router = useRouter()
  useEffect(() => {
    const { idListStr, ruleId } = $router?.params || {}
    if (idListStr) {
      const shopList = idListStr.split(',')
      Taro.setStorageSync('task_shop_list', shopList)
      Taro.setStorageSync('task_shop_rule_id', ruleId)
    }
    pageRef.current.pageLock()
  }, [])

  const handlePageReady = (info) => {
    if (info?.height) {
      setState((draft) => {
        draft.containerHeight = info.height
      })
    }
  }

  return (
    <SpPage
      className='page-category'
      pageConfig={{
        titleStyle: '3',
        navigateBackgroundColor: '#fff'
      }}
      ref={pageRef}
      showLive
      renderFooter={<SpTabbar />}
      onReady={handlePageReady}
      showpoweredBy={false}
      showNavitionLeft={false}
    >
      <View
        className='page-category__container'
        style={{ height: state.containerHeight || '100%' }}
      >
        <CategoryFlatLayout />
      </View>
    </SpPage>
  )
}

export default StoreItemList
