import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import CompsCategoryOld from './comps/comps-category-old'
// import CompsCategoryNew from './comps/comps-category-new'

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
    const res = await api.category.getCommonSetting()
    //category  老的
    setState((draft) => {
      draft.keywords = res.category_style == 'category'?true:false
    })
  }

  return (
    <View>
      {/* {
        keywords?<CompsCategoryNew />:<CompsCategoryOld />
      } */}
      <CompsCategoryOld />
    </View>
  )
}

export default StoreItemList
