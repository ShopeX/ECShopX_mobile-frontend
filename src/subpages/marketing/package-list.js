// 组合促销
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpPage, SpGoodsCell, SpCheckboxNew, SpScrollView } from '@/components'
import api from '@/api'
import CompPackageItem from './comps/comp-packageitem'

import './package-list.scss'

const initialState = {
  list: []
}

function PackageList (props) {
  const $instance = getCurrentInstance()
  const { id, distributor_id } = $instance.router.params

  const [state, setState] = useImmer(initialState)
  const { list } = state
  // useEffect(() => {
  //   fetch()
  // }, [])

  const fetch = async (params) => {
    const { pageIndex: page, pageSize } = params
    const { list, total_count: total } = await api.item.packageList({
      item_id: id,
      page,
      pageSize
    })

    setState((draft) => {
      draft.list = list
    })

    return {
      total
    }
  }

  return (
    <SpPage className='page-marketing-packagelist'>
      <SpScrollView fetch={fetch}>
        {list.map((item) => (
          <CompPackageItem info={item} />
        ))}
      </SpScrollView>
      {/* <View></View>
      <SpCheckboxNew>
        <SpGoodsCell />
      </SpCheckboxNew> */}
    </SpPage>
  )
}

PackageList.options = {
  addGlobalClass: true
}

export default PackageList
