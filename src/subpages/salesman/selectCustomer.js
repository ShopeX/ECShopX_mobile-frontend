import Taro from '@tarojs/taro'
import { useEffect, useState,useCallback } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage,SpTabs,SpSearchInput } from '@/components'
import CompFilterBar from './comps/comp-filter-bar'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import './selectCustomer.scss'

const initialConfigState = {
  tabList: [
    { title: '已购买' },
    { title: '未购买' }
  ],
  curTabIdx:0,
  keywords:''
}

const Index = () => {
  const [state, setState] = useImmer(initialConfigState)

  const {curTabIdx,tabList,keywords} = state

  const filterBarChange = useCallback((res)=>{
    console.log('filterBarChange',res)
  })

  return (
    <SpPage className={classNames('page-selectCustomer')}>
      <SpSearchInput placeholder='输入内容'
      isShowArea
      isShowSearchCondition
      onConfirm={(val) => {
        console.log(666,val)
        // setState((draft) => {
        //   draft.keywords = val
        // })
      }}
      onSelectArea={(val) => {
        console.log('666area',val)
        // setState((draft) => {
        //   draft.keywords = val
        // })
      }}
       />
    <View></View>
      <SpTabs current={curTabIdx} tablist={tabList} onChange={(e) => {
      setState(draft => {
        draft.curTabIdx = e
      })
    }} />
      选客户
    </SpPage>
  )
}

export default Index
