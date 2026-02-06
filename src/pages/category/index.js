/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import { platformTemplateName, entryLaunch } from '@/utils'
import { SpPage, SpSearchOne, SpTabbar } from '@/components'
import CompsAddPurchase from './comps/comps-category-addCart'
import CategoryFlatLayout from './components/category-flat-layout'
import './index.scss'

const initialState = {
  layout: 0, // 0: 默认, 1: 带购物车布局, 2: 带分类布局
  containerHeight: '' // 由 SpPage onReady 回填，用于容器高度
}

function StoreItemList(props) {
  const [state, setState] = useImmer(initialState)
  const pageRef = useRef(null)
  const $router = useRouter()
  useEffect(() => {
    getCategoryLayout()
    pageRef.current.pageLock()
  }, [])

  const getCategoryLayout = async () => {
    const { idListStr, ruleId } = $router?.params
    if (idListStr) {
      const shopList = idListStr.split(',')
      Taro.setStorageSync('task_shop_list', shopList)
      Taro.setStorageSync('task_shop_rule_id', ruleId)
    }
    const { list } = await api.category.getCategory({
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: 'category'
    })
    const { addCar, classify } = list?.[0]?.params || {}
    console.log('==list==', list)
    console.log('==addCar==', addCar)
    console.log('==classify==', classify)
    setState((draft) => {
      draft.layout = addCar && !classify ? 2 : 1
    })
  }

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
    >
      <View
        className='page-category__container'
        style={{ height: state.containerHeight || '100%' }}
      >
        {state.layout === 1 && <CompsAddPurchase />}
        {state.layout === 2 && <CategoryFlatLayout />}
      </View>
    </SpPage>
  )
}

export default StoreItemList
