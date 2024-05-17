import Taro from '@tarojs/taro'
import { useEffect, useState, useCallback } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage, SpTabs, SpSearchInput } from '@/components'
import CompFilterBar from './comps/comp-filter-bar'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import CompPurchasingList from './comps/comp-purchasing-list'
import './purchasing.scss'

const initialConfigState = {
  codeStatus: false,
}

const Purchasing = () => {
  const [state, setState] = useImmer(initialConfigState)

  const { searchConditionList ,codeStatus} = state

  return (
    <SpPage className={classNames('page-selectShop')}>
      <SpSearchInput
        placeholder='输入内容'
        onConfirm={(val) => {
          console.log(666, val)
        }}
        onSelectArea={(val) => {
          console.log('666area', val)
        }}
      />

      <CompPurchasingList />


      

    </SpPage>
  )
}

export default Purchasing
