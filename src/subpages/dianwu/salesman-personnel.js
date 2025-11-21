/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { useImmer } from 'use-immer'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpTabs, SpSearchInput } from '@/components'
import CompDeliverySalesman from './comps/comp-delivery-salesman'
import CompRankingSalesman from './comps/comp-ranking-salesman'
import './salesman-personnel.scss'

const initialState = {
  types: false,
  selectorCheckedIndex: 0,
  deliverylnformation: '',
  refreshData: false,
  tabList: [{ title: '我的业务员' }, { title: '业绩排行' }],
  searchConditionList: [
    { label: '手机号', value: 'mobile' },
    { label: '姓名', value: 'username' }
  ]
}

function SalesmanPersonnel() {
  const [state, setState] = useImmer(initialState)
  const {
    types,
    deliverylnformation,
    selectorCheckedIndex,
    refreshData,
    tabList,
    searchConditionList
  } = state

  const onDeliveryActionClick = (val) => {
    setState((draft) => {
      draft.selectorCheckedIndex = val.key == 'mobile' ? 1 : 0
      draft.deliverylnformation = val.keywords
      draft.refreshData = !refreshData
    })
  }

  return (
    <SpPage className='page-dianwu-salesman-personnel' scrollToTopBtn>
      <View>
        <SpSearchInput
          placeholder='输入内容'
          isShowSearchCondition
          searchConditionList={searchConditionList}
          onConfirm={(val) => {
            onDeliveryActionClick(val)
          }}
        />

        <SpTabs
          current={types}
          tablist={tabList}
          onChange={(e) => {
            setState((draft) => {
              draft.types = e
            })
          }}
        />

        {!types ? (
          <CompDeliverySalesman
            selectorCheckedIndex={selectorCheckedIndex}
            deliverylnformation={deliverylnformation}
            refreshData={refreshData}
          />
        ) : (
          <CompRankingSalesman
            selectorCheckedIndex={selectorCheckedIndex}
            deliverylnformation={deliverylnformation}
            refreshData={refreshData}
          />
        )}
      </View>
    </SpPage>
  )
}

SalesmanPersonnel.options = {
  addGlobalClass: true
}

export default SalesmanPersonnel
