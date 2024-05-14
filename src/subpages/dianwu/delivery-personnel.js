import React from 'react'
import { useImmer } from 'use-immer'
import Taro, { useDidShow } from '@tarojs/taro'
import { AtSearchBar } from 'taro-ui'
import { View, Text, Picker } from '@tarojs/components'
import {
  SpPage,
  SpTabs,
} from '@/components'
import CompDelivery from './comps/comp-delivery'
import CompRanking from './comps/comp-ranking'
import './delivery-personnel.scss'

const initialState = {
  types: false,
  selector: ['姓名', '手机号'],
  selectorChecked: '姓名',
  selectorCheckedIndex: 0,
  deliverylnformation: '',
  refreshData: false,
  tabList: [{ title: '我的配送员' }, { title: '配送费用排行' }]
}

function DeliveryPersonnel() {
  const [state, setState] = useImmer(initialState)
  const {
    types,
    selector,
    selectorChecked,
    deliverylnformation,
    selectorCheckedIndex,
    refreshData,
    tabList
  } = state

  // const classification = (val) => {
  //   setState((draft) => {
  //     draft.types = val
  //   })
  // }

  const onChange = (e) => {
    setState((draft) => {
      draft.selectorChecked = selector[e.detail.value]
      draft.selectorCheckedIndex = e.detail.value
    })
  }

  const onDeliveryActionClick = () => {
    setState((draft) => {
      draft.refreshData = !refreshData
    })
    console.log('开始搜索')
  }

  const onDeliveryChange = (value) => {
    setState((draft) => {
      draft.deliverylnformation = value
    })
  }

  const onClear = () => {
    setState((draft) => {
      draft.deliverylnformation = ''
    })
    onDeliveryActionClick()
  }

  return (
    <SpPage className='page-dianwu-delivery-personnel' scrollToTopBtn>
      <View>
        <View className='selector'>
          <Picker mode='selector' range={selector} onChange={onChange}>
            <Text className='picker'>{selectorChecked}</Text>
            <Text className='iconfont icon-arrowDown'></Text>
          </Picker>
          <AtSearchBar
            className='selector-sea'
            actionName='搜索'
            value={deliverylnformation}
            onChange={onDeliveryChange}
            onActionClick={onDeliveryActionClick}
            onClear={onClear}
          />
        </View>

        <SpTabs
          current={types}
          tablist={tabList}
          onChange={(e) => {
            setState((draft) => {
              draft.types = e
            })
          }}
        />
        {/* <View className={classNames('classification', types ? 'active' : '')}>
          <View onClick={() => classification(true)} className={classNames(types ? 'active' : '')}>
            我的配送员
          </View>
          <View
            onClick={() => classification(false)}
            className={classNames(!types ? 'active' : '')}
          >
            配送费用排行
          </View>
        </View> */}

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
