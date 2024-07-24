import Taro, { usePullDownRefresh, useRouter, useDidShow } from '@tarojs/taro'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage, SpTabs, SpSearchInput, SpScrollView } from '@/components'
import CompFilterBar from './comps/comp-filter-bar'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import CompCustomerList from './comps/comp-customer-list'
import './selectCustomer.scss'

const initialConfigState = {
  tabList: [{ title: '已购买' }, { title: '未购买' }],
  curTabIdx: 0,
  keywords: ''
}

const SelectCustomer = () => {
  const [state, setState] = useImmer(initialConfigState)

  const { curTabIdx, tabList, keywords } = state
  const goodsRef = useRef()

  useEffect(() => {
    setState((draft) => {
      draft.list = []
    })
    goodsRef.current.reset()
  }, [])

  useDidShow(() => {
    setState((draft) => {
      draft.list = []
    })
    goodsRef.current.reset()
  })

  const fetch = async ({ pageIndex, pageSize }) => {
    // return {
    //   total: total_count
    // }
  }

  return (
    <SpPage className={classNames('page-SelectCustomer')}>
      <SpSearchInput
        placeholder='输入内容'
        isShowArea
        isShowSearchCondition
        onConfirm={(val) => {
          console.log(666, val)
        }}
        onSelectArea={(val) => {
          console.log('666area', val)
        }}
      />
      <SpTabs
        current={curTabIdx}
        tablist={tabList}
        onChange={(e) => {
          setState((draft) => {
            draft.curTabIdx = e
          })
        }}
      />
      <SpScrollView auto={false} ref={goodsRef} fetch={fetch}>
        <CompCustomerList />
        <CompCustomerList />
        <CompCustomerList />
      </SpScrollView>
    </SpPage>
  )
}

export default SelectCustomer
