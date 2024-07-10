import React from 'react'
import { useImmer } from 'use-immer'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpTabs, SpSearchInput } from '@/components'
import CompDelivery from './comps/comp-delivery'
import CompRanking from './comps/comp-ranking'
import './delivery-personnel.scss'

const initialState = {
  types: false,
  selectorCheckedIndex: 0,
  deliverylnformation: '',
  refreshData: false,
  tabList: [{ title: '我的业务员' }, { title: '业务费用排行' }]
}

function DeliveryPersonnel() {
  const [state, setState] = useImmer(initialState)
  const { types, deliverylnformation, selectorCheckedIndex, refreshData, tabList } = state

  const onDeliveryActionClick = (val) => {
    setState((draft) => {
      draft.selectorCheckedIndex = val.key == 'phone' ? 1 : 0
      draft.deliverylnformation = val.keywords
      draft.refreshData = !refreshData
    })
  }

  return (
    <SpPage className='page-dianwu-delivery-personnel' scrollToTopBtn>
      <View>
        <SpSearchInput
          placeholder='输入内容'
          isShowSearchCondition
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
          <CompDelivery
            selectorCheckedIndex={selectorCheckedIndex}
            deliverylnformation={deliverylnformation}
            refreshData={refreshData}
          />
        ) : (
          <CompRanking
            selectorCheckedIndex={selectorCheckedIndex}
            deliverylnformation={deliverylnformation}
            refreshData={refreshData}
          />
        )}
      </View>
    </SpPage>
  )
}

DeliveryPersonnel.options = {
  addGlobalClass: true
}

export default DeliveryPersonnel
