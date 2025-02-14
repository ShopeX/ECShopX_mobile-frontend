import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import { platformTemplateName } from '@/utils/platform'
import CompsAddPurchase from './comps/comps-category-addCart'
import CompsCategoryNew from './comps/comps-category-tile'

import './index.scss'

const initialState = {
  keywords: ''
}

function StoreItemList(props) {
  const [state, setState] = useImmer(initialState)
  const {
    keywords,
  } = state

  useEffect(() => {
    getCategoryList()
  }, [])

  const getCategoryList = async () => {
    // const res = await api.category.getCommonSetting()
    // //category  老的
    // setState((draft) => {
    //   draft.keywords = res.category_style == 'category'?true:false
    // })
    const query = { template_name: platformTemplateName, version: 'v1.0.1', page_name: 'category' }
    const { list } = await api.category.getCategory(query)
    let seriesList = list[0].params
    setState((draft) => {
      draft.keywords = seriesList.addCar && !seriesList.classify
    })
  }

  return (
    <View>
      {
        keywords?<CompsCategoryNew />:<CompsAddPurchase />
      }
      {/* <CompsCategoryNew /> */}
    </View>
  )
}

export default StoreItemList
