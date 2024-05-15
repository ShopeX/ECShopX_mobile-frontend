import Taro from '@tarojs/taro'
import { useEffect, useState, useCallback } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage, SpTabs, SpSearchInput } from '@/components'
import CompFilterBar from './comps/comp-filter-bar'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import CompShopList from './comps/comp-shop-list'
import './selectShop.scss'

const initialConfigState = {
  keywords: '',
  searchConditionList: [
    { label: '手机号', value: 'phone' },
    { label: '店铺名称', value: 'distributor_name' }
  ]
}

const selectShop = () => {
  const [state, setState] = useImmer(initialConfigState)

  const { searchConditionList } = state

  return (
    <SpPage className={classNames('page-selectShop')}>
      <SpSearchInput
        placeholder='输入内容'
        isShowArea
        isShowSearchCondition
        searchConditionList={searchConditionList}
        onConfirm={(val) => {
          console.log(666, val)
        }}
        onSelectArea={(val) => {
          console.log('666area', val)
        }}
      />

      <CompShopList />
    </SpPage>
  )
}

export default selectShop
