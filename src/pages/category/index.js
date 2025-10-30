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
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import { platformTemplateName } from '@/utils/platform'
import { SpPage } from '@/components'
import CompsAddPurchase from './comps/comps-category-addCart'
import CompsCategoryNew from './comps/comps-category-tile'

import './index.scss'

const initialState = {
  layout: 0 // 0: 默认, 1: 带购物车布局, 2: 平铺布局
}

function StoreItemList(props) {
  const [state, setState] = useImmer(initialState)
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
    const { addCar, classify } = list?.[0]?.params || {}
    // TODO:后端字段反了，需要调整 addCar=平铺，classify=加购
    setState((draft) => {
      // draft.keywords = seriesList.addCar && !seriesList.classify
      if (classify) {
        draft.layout = 1
      } else {
        draft.layout = 2
      }
    })
  }

  return (
    <SpPage>
      {state.layout === 1 && <CompsAddPurchase />}
      {state.layout === 2 && <CompsCategoryNew />}
    </SpPage>
  )
}

export default StoreItemList
